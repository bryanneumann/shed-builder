import { 
  shedDesigns, 
  materialItems, 
  pricingData, 
  userLocations,
  type ShedDesign, 
  type InsertShedDesign,
  type MaterialItem,
  type InsertMaterialItem,
  type PricingData,
  type InsertPricingData,
  type UserLocation,
  type InsertUserLocation
} from "@shared/schema";
import { db } from "./db";
import { eq, and, ilike } from "drizzle-orm";

export interface IStorage {
  // Shed designs
  getShedDesign(id: number): Promise<ShedDesign | undefined>;
  getShedDesigns(): Promise<ShedDesign[]>;
  getTemplates(): Promise<ShedDesign[]>;
  createShedDesign(design: InsertShedDesign): Promise<ShedDesign>;
  updateShedDesign(id: number, design: Partial<InsertShedDesign>): Promise<ShedDesign | undefined>;
  deleteShedDesign(id: number): Promise<boolean>;
  
  // Material items
  getMaterialItems(shedDesignId: number): Promise<MaterialItem[]>;
  createMaterialItem(item: InsertMaterialItem): Promise<MaterialItem>;
  updateMaterialItem(id: number, item: Partial<InsertMaterialItem>): Promise<MaterialItem | undefined>;
  deleteMaterialItem(id: number): Promise<boolean>;
  
  // Pricing data
  getPricingData(productName: string, zipCode: string): Promise<PricingData[]>;
  createPricingData(data: InsertPricingData): Promise<PricingData>;
  updatePricingData(id: number, data: Partial<InsertPricingData>): Promise<PricingData | undefined>;
  
  // User locations
  getUserLocation(zipCode: string): Promise<UserLocation | undefined>;
  createUserLocation(location: InsertUserLocation): Promise<UserLocation>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.seedTemplates();
  }

  // Shed designs
  async getShedDesign(id: number): Promise<ShedDesign | undefined> {
    const [design] = await db.select().from(shedDesigns).where(eq(shedDesigns.id, id));
    return design || undefined;
  }

  async getShedDesigns(): Promise<ShedDesign[]> {
    return await db.select().from(shedDesigns);
  }

  async getTemplates(): Promise<ShedDesign[]> {
    return await db.select().from(shedDesigns).where(eq(shedDesigns.isTemplate, true));
  }

  async createShedDesign(design: InsertShedDesign): Promise<ShedDesign> {
    const [newDesign] = await db
      .insert(shedDesigns)
      .values(design)
      .returning();
    return newDesign;
  }

  async updateShedDesign(id: number, design: Partial<InsertShedDesign>): Promise<ShedDesign | undefined> {
    const [updated] = await db
      .update(shedDesigns)
      .set(design)
      .where(eq(shedDesigns.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteShedDesign(id: number): Promise<boolean> {
    const result = await db
      .delete(shedDesigns)
      .where(eq(shedDesigns.id, id))
      .returning();
    return result.length > 0;
  }

  // Material items
  async getMaterialItems(shedDesignId: number): Promise<MaterialItem[]> {
    return await db
      .select()
      .from(materialItems)
      .where(eq(materialItems.shedDesignId, shedDesignId));
  }

  async createMaterialItem(item: InsertMaterialItem): Promise<MaterialItem> {
    const [newItem] = await db
      .insert(materialItems)
      .values(item)
      .returning();
    return newItem;
  }

  async updateMaterialItem(id: number, item: Partial<InsertMaterialItem>): Promise<MaterialItem | undefined> {
    const [updated] = await db
      .update(materialItems)
      .set(item)
      .where(eq(materialItems.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteMaterialItem(id: number): Promise<boolean> {
    const result = await db
      .delete(materialItems)
      .where(eq(materialItems.id, id))
      .returning();
    return result.length > 0;
  }

  // Pricing data
  async getPricingData(productName: string, zipCode: string): Promise<PricingData[]> {
    return await db
      .select()
      .from(pricingData)
      .where(and(
        ilike(pricingData.productName, `%${productName}%`),
        eq(pricingData.zipCode, zipCode)
      ));
  }

  async createPricingData(data: InsertPricingData): Promise<PricingData> {
    const [newData] = await db
      .insert(pricingData)
      .values(data)
      .returning();
    return newData;
  }

  async updatePricingData(id: number, data: Partial<InsertPricingData>): Promise<PricingData | undefined> {
    const [updated] = await db
      .update(pricingData)
      .set({ ...data, lastUpdated: new Date() })
      .where(eq(pricingData.id, id))
      .returning();
    return updated || undefined;
  }

  // User locations
  async getUserLocation(zipCode: string): Promise<UserLocation | undefined> {
    const [location] = await db
      .select()
      .from(userLocations)
      .where(eq(userLocations.zipCode, zipCode));
    return location || undefined;
  }

  async createUserLocation(location: InsertUserLocation): Promise<UserLocation> {
    const [newLocation] = await db
      .insert(userLocations)
      .values(location)
      .returning();
    return newLocation;
  }

  private async seedTemplates() {
    try {
      // Check if templates already exist
      const existingTemplates = await this.getTemplates();
      if (existingTemplates.length > 0) {
        return; // Templates already seeded
      }

      // Pre-populate with common shed templates
      const templates = [
        {
          name: "8x8 Basic",
          length: 8,
          width: 8,
          height: 8,
          roofType: "gable" as const,
          foundationType: "concrete-slab" as const,
          lumberGrade: "pressure-treated" as const,
          joistSpacing: 16,
          studSize: "2x4" as const,
          wallHeight: 8,
          doorCount: 1,
          windowCount: 0,
          sidingType: "plywood" as const,
          roofingType: "asphalt-shingles" as const,
          isTemplate: true,
          templateCategory: "basic",
        },
        {
          name: "10x12 Storage",
          length: 12,
          width: 10,
          height: 9,
          roofType: "gable" as const,
          foundationType: "concrete-slab" as const,
          lumberGrade: "pressure-treated" as const,
          joistSpacing: 16,
          studSize: "2x4" as const,
          wallHeight: 8,
          doorCount: 1,
          windowCount: 1,
          sidingType: "vinyl" as const,
          roofingType: "asphalt-shingles" as const,
          isTemplate: true,
          templateCategory: "storage",
        },
        {
          name: "8x10 Workshop",
          length: 10,
          width: 8,
          height: 9,
          roofType: "gable" as const,
          foundationType: "concrete-slab" as const,
          lumberGrade: "pressure-treated" as const,
          joistSpacing: 16,
          studSize: "2x4" as const,
          wallHeight: 8,
          doorCount: 1,
          windowCount: 2,
          sidingType: "wood" as const,
          roofingType: "metal" as const,
          isTemplate: true,
          templateCategory: "workshop",
        },
        {
          name: "12x16 Garage",
          length: 16,
          width: 12,
          height: 10,
          roofType: "gable" as const,
          foundationType: "concrete-slab" as const,
          lumberGrade: "pressure-treated" as const,
          joistSpacing: 16,
          studSize: "2x6" as const,
          wallHeight: 9,
          doorCount: 1,
          windowCount: 2,
          sidingType: "vinyl" as const,
          roofingType: "asphalt-shingles" as const,
          isTemplate: true,
          templateCategory: "garage",
        },
      ];

      // Insert templates into database
      await db.insert(shedDesigns).values(templates);
    } catch (error) {
      console.error('Error seeding templates:', error);
    }
  }
}

export const storage = new DatabaseStorage();
