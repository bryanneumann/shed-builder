import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertShedDesignSchema, shedConfigSchema, insertUserLocationSchema } from "@shared/schema";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Shed design routes
  app.get("/api/shed-designs", async (req, res) => {
    try {
      const designs = await storage.getShedDesigns();
      res.json(designs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shed designs" });
    }
  });

  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get("/api/shed-designs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const design = await storage.getShedDesign(id);
      if (!design) {
        return res.status(404).json({ message: "Shed design not found" });
      }
      res.json(design);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shed design" });
    }
  });

  app.post("/api/shed-designs", async (req, res) => {
    try {
      const validatedData = insertShedDesignSchema.parse(req.body);
      const design = await storage.createShedDesign(validatedData);
      res.status(201).json(design);
    } catch (error) {
      res.status(400).json({ message: "Invalid shed design data" });
    }
  });

  app.put("/api/shed-designs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertShedDesignSchema.partial().parse(req.body);
      const design = await storage.updateShedDesign(id, validatedData);
      if (!design) {
        return res.status(404).json({ message: "Shed design not found" });
      }
      res.json(design);
    } catch (error) {
      res.status(400).json({ message: "Invalid shed design data" });
    }
  });

  // Material calculation route
  app.post("/api/calculate-materials", async (req, res) => {
    try {
      const config = shedConfigSchema.parse(req.body);
      const { calculateMaterials } = await import("../client/src/lib/shed-calculations");
      const materials = calculateMaterials(config);
      res.json(materials);
    } catch (error) {
      res.status(400).json({ message: "Invalid shed configuration" });
    }
  });

  // Pricing routes
  app.get("/api/pricing", async (req, res) => {
    try {
      const { product, zipCode } = req.query;
      
      if (!product || !zipCode) {
        return res.status(400).json({ message: "Product name and zip code required" });
      }

      // Try to get cached pricing data first
      let pricingData = await storage.getPricingData(product as string, zipCode as string);
      
      // If no cached data or data is old, fetch from SerpApi
      if (pricingData.length === 0 || isDataStale(pricingData)) {
        try {
          const serpApiKey = process.env.SERP_API_KEY || process.env.SERPAPI_KEY;
          if (!serpApiKey) {
            return res.status(500).json({ message: "SerpApi key not configured" });
          }

          // Fetch from Home Depot
          const homeDepotData = await fetchHomeDepotPricing(product as string, zipCode as string, serpApiKey);
          
          // Fetch from Lowes  
          const lowesData = await fetchLowesPricing(product as string, zipCode as string, serpApiKey);
          
          // Store in cache
          const allPricing = [...homeDepotData, ...lowesData];
          for (const pricing of allPricing) {
            await storage.createPricingData({
              productName: pricing.productName,
              sku: pricing.sku || "",
              retailer: pricing.retailer,
              price: pricing.price,
              zipCode: zipCode as string,
              inStock: pricing.inStock ?? true,
              storeId: pricing.storeId || "",
            });
          }
          
          pricingData = allPricing;
        } catch (apiError) {
          console.error("Failed to fetch pricing from APIs:", apiError);
          // Return empty array if API fails, don't crash the app
          pricingData = [];
        }
      }
      
      res.json(pricingData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pricing data" });
    }
  });

  // Location routes
  app.get("/api/location/:zipCode", async (req, res) => {
    try {
      const zipCode = req.params.zipCode;
      let location = await storage.getUserLocation(zipCode);
      
      if (!location) {
        // Fetch location data from a geocoding service
        try {
          const locationData = await fetchLocationData(zipCode);
          location = await storage.createUserLocation(locationData);
        } catch (error) {
          return res.status(404).json({ message: "Location not found" });
        }
      }
      
      res.json(location);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch location data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function isDataStale(pricingData: any[]): boolean {
  if (pricingData.length === 0) return true;
  const latestUpdate = Math.max(...pricingData.map(p => new Date(p.lastUpdated).getTime()));
  const hoursSinceUpdate = (Date.now() - latestUpdate) / (1000 * 60 * 60);
  return hoursSinceUpdate > 24; // Consider data stale after 24 hours
}

async function fetchHomeDepotPricing(product: string, zipCode: string, apiKey: string) {
  try {
    const response = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "home_depot",
        q: product,
        api_key: apiKey,
        delivery_zip: zipCode,
        hd_sort: "price_low_to_high",
      },
      timeout: 10000,
    });

    const products = response.data.products || [];
    return products.slice(0, 5).map((item: any) => ({
      productName: item.title || product,
      sku: item.model_number || item.sku,
      retailer: "home-depot",
      price: parseFloat(item.price?.replace("$", "").replace(",", "") || "0"),
      inStock: item.availability !== "Out of Stock",
      storeId: item.store_id,
    }));
  } catch (error) {
    console.error("Home Depot API error:", error);
    return [];
  }
}

async function fetchLowesPricing(product: string, zipCode: string, apiKey: string) {
  try {
    const response = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "lowes",
        q: product,
        api_key: apiKey,
        location: zipCode,
      },
      timeout: 10000,
    });

    const products = response.data.products || [];
    return products.slice(0, 5).map((item: any) => ({
      productName: item.title || product,
      sku: item.product_id || item.model,
      retailer: "lowes",
      price: parseFloat(item.price?.replace("$", "").replace(",", "") || "0"),
      inStock: item.availability !== "Out of Stock",
      storeId: item.store_id,
    }));
  } catch (error) {
    console.error("Lowes API error:", error);
    return [];
  }
}

async function fetchLocationData(zipCode: string) {
  try {
    // Using a simple zip code API (could be replaced with more sophisticated geocoding)
    const response = await axios.get(`https://api.zippopotam.us/us/${zipCode}`, {
      timeout: 5000,
    });
    
    const data = response.data;
    return {
      zipCode,
      city: data.places[0]["place name"],
      state: data.places[0]["state abbreviation"],
      latitude: parseFloat(data.places[0].latitude),
      longitude: parseFloat(data.places[0].longitude),
    };
  } catch (error) {
    throw new Error("Failed to fetch location data");
  }
}
