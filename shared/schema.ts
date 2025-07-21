import { pgTable, text, serial, integer, boolean, json, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const shedDesigns = pgTable("shed_designs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  length: real("length").notNull(), // feet
  width: real("width").notNull(), // feet
  height: real("height").notNull(), // feet
  roofType: text("roof_type").notNull().default("gable"), // gable, gambrel, lean-to
  foundationType: text("foundation_type").notNull().default("concrete-slab"),
  lumberGrade: text("lumber_grade").notNull().default("pressure-treated"),
  joistSpacing: integer("joist_spacing").notNull().default(16), // inches on center
  studSize: text("stud_size").notNull().default("2x4"),
  wallHeight: real("wall_height").notNull().default(8), // feet
  doorCount: integer("door_count").notNull().default(1),
  windowCount: integer("window_count").notNull().default(0),
  sidingType: text("siding_type").notNull().default("plywood"),
  roofingType: text("roofing_type").notNull().default("asphalt-shingles"),
  isTemplate: boolean("is_template").notNull().default(false),
  templateCategory: text("template_category"), // basic, storage, workshop, garage
  createdAt: timestamp("created_at").defaultNow(),
});

export const materialItems = pgTable("material_items", {
  id: serial("id").primaryKey(),
  shedDesignId: integer("shed_design_id").references(() => shedDesigns.id),
  category: text("category").notNull(), // lumber, hardware, roofing, siding, foundation
  name: text("name").notNull(),
  description: text("description"),
  quantity: real("quantity").notNull(),
  unit: text("unit").notNull(), // pieces, sheets, linear-ft, sq-ft, boxes
  estimatedPrice: real("estimated_price").notNull(),
  sku: text("sku"),
  retailer: text("retailer"), // home-depot, lowes, menards
  inStock: boolean("in_stock").default(true),
  storeDistance: real("store_distance"), // miles
});

export const pricingData = pgTable("pricing_data", {
  id: serial("id").primaryKey(),
  productName: text("product_name").notNull(),
  sku: text("sku"),
  retailer: text("retailer").notNull(),
  price: real("price").notNull(),
  zipCode: text("zip_code").notNull(),
  inStock: boolean("in_stock").default(true),
  storeId: text("store_id"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const userLocations = pgTable("user_locations", {
  id: serial("id").primaryKey(),
  zipCode: text("zip_code").notNull().unique(),
  city: text("city"),
  state: text("state"),
  latitude: real("latitude"),
  longitude: real("longitude"),
});

// Insert schemas
export const insertShedDesignSchema = createInsertSchema(shedDesigns).omit({
  id: true,
  createdAt: true,
});

export const insertMaterialItemSchema = createInsertSchema(materialItems).omit({
  id: true,
});

export const insertPricingDataSchema = createInsertSchema(pricingData).omit({
  id: true,
  lastUpdated: true,
});

export const insertUserLocationSchema = createInsertSchema(userLocations).omit({
  id: true,
});

// Types
export type ShedDesign = typeof shedDesigns.$inferSelect;
export type InsertShedDesign = z.infer<typeof insertShedDesignSchema>;
export type MaterialItem = typeof materialItems.$inferSelect;
export type InsertMaterialItem = z.infer<typeof insertMaterialItemSchema>;
export type PricingData = typeof pricingData.$inferSelect;
export type InsertPricingData = z.infer<typeof insertPricingDataSchema>;
export type UserLocation = typeof userLocations.$inferSelect;
export type InsertUserLocation = z.infer<typeof insertUserLocationSchema>;

// Shed configuration schema for frontend forms
export const shedConfigSchema = z.object({
  name: z.string().min(1, "Name is required"),
  length: z.number().min(4).max(40),
  width: z.number().min(4).max(40),
  height: z.number().min(6).max(16),
  roofType: z.enum(["gable", "gambrel", "lean-to"]),
  foundationType: z.enum(["concrete-slab", "gravel-pad", "concrete-piers"]),
  lumberGrade: z.enum(["pressure-treated", "douglas-fir", "southern-pine"]),
  joistSpacing: z.enum([12, 16, 24]),
  studSize: z.enum(["2x4", "2x6"]),
  wallHeight: z.number().min(6).max(12),
  doorCount: z.number().min(0).max(4),
  windowCount: z.number().min(0).max(8),
  sidingType: z.enum(["plywood", "vinyl", "wood", "metal"]),
  roofingType: z.enum(["asphalt-shingles", "metal", "rubber"]),
});

export type ShedConfig = z.infer<typeof shedConfigSchema>;
