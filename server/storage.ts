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

export class MemStorage implements IStorage {
  private shedDesigns: Map<number, ShedDesign> = new Map();
  private materialItems: Map<number, MaterialItem> = new Map();
  private pricingData: Map<number, PricingData> = new Map();
  private userLocations: Map<string, UserLocation> = new Map();
  
  private currentShedId = 1;
  private currentMaterialId = 1;
  private currentPricingId = 1;
  private currentLocationId = 1;

  constructor() {
    this.seedTemplates();
  }

  // Shed designs
  async getShedDesign(id: number): Promise<ShedDesign | undefined> {
    return this.shedDesigns.get(id);
  }

  async getShedDesigns(): Promise<ShedDesign[]> {
    return Array.from(this.shedDesigns.values());
  }

  async getTemplates(): Promise<ShedDesign[]> {
    return Array.from(this.shedDesigns.values()).filter(design => design.isTemplate);
  }

  async createShedDesign(design: InsertShedDesign): Promise<ShedDesign> {
    const id = this.currentShedId++;
    const newDesign: ShedDesign = {
      ...design,
      id,
      createdAt: new Date(),
    };
    this.shedDesigns.set(id, newDesign);
    return newDesign;
  }

  async updateShedDesign(id: number, design: Partial<InsertShedDesign>): Promise<ShedDesign | undefined> {
    const existing = this.shedDesigns.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...design };
    this.shedDesigns.set(id, updated);
    return updated;
  }

  async deleteShedDesign(id: number): Promise<boolean> {
    return this.shedDesigns.delete(id);
  }

  // Material items
  async getMaterialItems(shedDesignId: number): Promise<MaterialItem[]> {
    return Array.from(this.materialItems.values()).filter(item => item.shedDesignId === shedDesignId);
  }

  async createMaterialItem(item: InsertMaterialItem): Promise<MaterialItem> {
    const id = this.currentMaterialId++;
    const newItem: MaterialItem = { ...item, id };
    this.materialItems.set(id, newItem);
    return newItem;
  }

  async updateMaterialItem(id: number, item: Partial<InsertMaterialItem>): Promise<MaterialItem | undefined> {
    const existing = this.materialItems.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...item };
    this.materialItems.set(id, updated);
    return updated;
  }

  async deleteMaterialItem(id: number): Promise<boolean> {
    return this.materialItems.delete(id);
  }

  // Pricing data
  async getPricingData(productName: string, zipCode: string): Promise<PricingData[]> {
    return Array.from(this.pricingData.values()).filter(
      data => data.productName.toLowerCase().includes(productName.toLowerCase()) && 
              data.zipCode === zipCode
    );
  }

  async createPricingData(data: InsertPricingData): Promise<PricingData> {
    const id = this.currentPricingId++;
    const newData: PricingData = { 
      ...data, 
      id, 
      lastUpdated: new Date() 
    };
    this.pricingData.set(id, newData);
    return newData;
  }

  async updatePricingData(id: number, data: Partial<InsertPricingData>): Promise<PricingData | undefined> {
    const existing = this.pricingData.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...data, lastUpdated: new Date() };
    this.pricingData.set(id, updated);
    return updated;
  }

  // User locations
  async getUserLocation(zipCode: string): Promise<UserLocation | undefined> {
    return this.userLocations.get(zipCode);
  }

  async createUserLocation(location: InsertUserLocation): Promise<UserLocation> {
    const id = this.currentLocationId++;
    const newLocation: UserLocation = { ...location, id };
    this.userLocations.set(location.zipCode, newLocation);
    return newLocation;
  }

  private seedTemplates() {
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

    templates.forEach((template, index) => {
      const id = this.currentShedId++;
      this.shedDesigns.set(id, {
        ...template,
        id,
        createdAt: new Date(),
      });
    });
  }
}

export const storage = new MemStorage();
