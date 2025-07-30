import type { ShedConfig } from "@shared/schema";

export interface MaterialCalculation {
  category: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  estimatedPrice: number;
}

// Store-specific pricing multipliers
const storePricing = {
  "home-depot": {
    name: "Home Depot",
    multiplier: 1.0, // Base pricing
    skuPrefix: "HD"
  },
  "lowes": {
    name: "Lowe's", 
    multiplier: 0.95, // 5% lower than Home Depot
    skuPrefix: "LW"
  },
  "menards": {
    name: "Menards",
    multiplier: 0.92, // 8% lower than Home Depot  
    skuPrefix: "MN"
  }
};

export function calculateMaterials(config: ShedConfig, selectedStore: string = "home-depot"): MaterialCalculation[] {
  const materials: MaterialCalculation[] = [];
  const storeInfo = storePricing[selectedStore as keyof typeof storePricing] || storePricing["home-depot"];
  
  // Foundation calculations
  if (config.foundationType === "concrete-slab") {
    const area = config.length * config.width;
    const concreteYards = Math.ceil(area * 0.33 / 27); // 4" thick slab
    materials.push({
      category: "foundation",
      name: "Ready-Mix Concrete",
      description: "4000 PSI concrete for slab",
      quantity: concreteYards,
      unit: "cubic yards",
      estimatedPrice: Math.round(concreteYards * 180 * storeInfo.multiplier * 100) / 100,
    });
    
    const rebarPieces = Math.ceil(area / 16); // Rebar grid
    materials.push({
      category: "foundation",
      name: "#4 Rebar",
      description: "20 ft reinforcement bars",
      quantity: rebarPieces,
      unit: "pieces",
      estimatedPrice: Math.round(rebarPieces * 12.50 * storeInfo.multiplier * 100) / 100,
    });
  }
  
  // Floor framing calculations
  const floorJoistCount = Math.floor(config.width / (config.joistSpacing / 12)) + 1;
  const floorJoistLength = config.length;
  
  materials.push({
    category: "lumber",
    name: `2x8x${Math.ceil(floorJoistLength)}' ${config.lumberGrade} Lumber`,
    description: "Floor joists",
    quantity: floorJoistCount,
    unit: "pieces",
    estimatedPrice: Math.round(floorJoistCount * (12.98 * Math.ceil(floorJoistLength / 10)) * storeInfo.multiplier * 100) / 100,
  });
  
  // Rim joists (perimeter)
  const rimJoistLinearFt = (config.length + config.width) * 2;
  materials.push({
    category: "lumber",
    name: `2x8x10' ${config.lumberGrade} Lumber`,
    description: "Rim joists",
    quantity: Math.ceil(rimJoistLinearFt / 10),
    unit: "pieces",
    estimatedPrice: Math.round(Math.ceil(rimJoistLinearFt / 10) * 12.98 * storeInfo.multiplier * 100) / 100,
  });
  
  // Wall framing calculations
  const wallPerimeter = (config.length + config.width) * 2;
  const studSpacing = 16; // inches
  const studCount = Math.floor((wallPerimeter * 12) / studSpacing) + 8; // Extra for corners and openings
  
  materials.push({
    category: "lumber",
    name: `${config.studSize}x8' ${config.lumberGrade} Lumber`,
    description: "Wall studs",
    quantity: studCount,
    unit: "pieces",
    estimatedPrice: Math.round(studCount * (config.studSize === "2x4" ? 4.98 : 6.98) * storeInfo.multiplier * 100) / 100,
  });
  
  // Top and bottom plates (double top plate)
  const plateLinearFt = wallPerimeter * 3; // Bottom + 2 top plates
  materials.push({
    category: "lumber",
    name: `${config.studSize}x10' ${config.lumberGrade} Lumber`,
    description: "Top and bottom plates",
    quantity: Math.ceil(plateLinearFt / 10),
    unit: "pieces",
    estimatedPrice: Math.round(Math.ceil(plateLinearFt / 10) * (config.studSize === "2x4" ? 4.98 : 6.98) * storeInfo.multiplier * 100) / 100,
  });
  
  // Sheathing calculations
  const wallArea = wallPerimeter * config.wallHeight;
  const floorArea = config.length * config.width;
  const roofArea = calculateRoofArea(config);
  
  // Floor sheathing
  const floorSheets = Math.ceil(floorArea / 32); // 4x8 sheets = 32 sq ft
  materials.push({
    category: "lumber",
    name: "4x8x5/8\" OSB Sheathing",
    description: "Floor decking",
    quantity: floorSheets,
    unit: "sheets",
    estimatedPrice: Math.round(floorSheets * 24.98 * storeInfo.multiplier * 100) / 100,
  });
  
  // Wall sheathing
  const wallSheets = Math.ceil(wallArea / 32);
  materials.push({
    category: "lumber",
    name: "4x8x1/2\" OSB Sheathing",
    description: "Wall sheathing",
    quantity: wallSheets,
    unit: "sheets",
    estimatedPrice: Math.round(wallSheets * 22.98 * storeInfo.multiplier * 100) / 100,
  });
  
  // Roof sheathing
  const roofSheets = Math.ceil(roofArea / 32);
  materials.push({
    category: "lumber",
    name: "4x8x1/2\" OSB Sheathing",
    description: "Roof decking",
    quantity: roofSheets,
    unit: "sheets",
    estimatedPrice: Math.round(roofSheets * 22.98 * storeInfo.multiplier * 100) / 100,
  });
  
  // Hardware calculations
  const joistHangers = floorJoistCount;
  materials.push({
    category: "hardware",
    name: "2x8 Galvanized Joist Hangers",
    description: "Simpson Strong-Tie or equivalent",
    quantity: joistHangers,
    unit: "pieces",
    estimatedPrice: Math.round(joistHangers * 2.78 * storeInfo.multiplier * 100) / 100,
  });
  
  // Joist hanger nails
  materials.push({
    category: "hardware",
    name: "1-1/2\" Joist Hanger Nails (5 lb)",
    description: "Galvanized nails for joist hangers",
    quantity: 1,
    unit: "box",
    estimatedPrice: Math.round(24.97 * storeInfo.multiplier * 100) / 100,
  });
  
  // Framing screws
  const screwBoxes = Math.ceil(studCount / 100); // Approximately 100 screws per stud
  materials.push({
    category: "hardware",
    name: "3\" Galvanized Deck Screws (5 lb)",
    description: "Structural screws for framing",
    quantity: screwBoxes,
    unit: "boxes",
    estimatedPrice: Math.round(screwBoxes * 28.97 * storeInfo.multiplier * 100) / 100,
  });
  
  // Hurricane ties for roof
  const hurricaneTies = Math.ceil(studCount / 2); // Every other rafter
  materials.push({
    category: "hardware",
    name: "Hurricane Ties (20 pack)",
    description: "Simpson H2.5A or equivalent",
    quantity: Math.ceil(hurricaneTies / 20),
    unit: "packs",
    estimatedPrice: Math.round(Math.ceil(hurricaneTies / 20) * 18.97 * storeInfo.multiplier * 100) / 100,
  });
  
  // Roofing materials
  const roofSquares = Math.ceil(roofArea / 100); // Roofing sold by 100 sq ft "squares"
  
  if (config.roofingType === "asphalt-shingles") {
    materials.push({
      category: "roofing",
      name: "Architectural Asphalt Shingles",
      description: "30-year warranty shingles",
      quantity: roofSquares,
      unit: "squares",
      estimatedPrice: Math.round(roofSquares * 135.00 * storeInfo.multiplier * 100) / 100,
    });
    
    materials.push({
      category: "roofing",
      name: "15 lb Roofing Felt",
      description: "Underlayment",
      quantity: roofSquares,
      unit: "rolls",
      estimatedPrice: Math.round(roofSquares * 45.00 * storeInfo.multiplier * 100) / 100,
    });
  }
  
  // Ridge cap
  const ridgeLinearFt = config.length;
  materials.push({
    category: "roofing",
    name: "Ridge Cap Shingles",
    description: "Hip and ridge shingles",
    quantity: Math.ceil(ridgeLinearFt / 20),
    unit: "bundles",
    estimatedPrice: Math.round(Math.ceil(ridgeLinearFt / 20) * 65.00 * storeInfo.multiplier * 100) / 100,
  });
  
  // Siding calculations
  const sidingArea = wallArea - (config.doorCount * 21) - (config.windowCount * 12); // Subtract openings
  
  if (config.sidingType === "plywood") {
    const sidingSheets = Math.ceil(sidingArea / 32);
    materials.push({
      category: "siding",
      name: "4x8 T1-11 Siding",
      description: "Grooved plywood siding",
      quantity: sidingSheets,
      unit: "sheets",
      estimatedPrice: Math.round(sidingSheets * 45.00 * storeInfo.multiplier * 100) / 100,
    });
  }
  
  // Trim and fascia
  const trimLinearFt = wallPerimeter + (config.length * 2); // Wall corners + fascia
  materials.push({
    category: "siding",
    name: "1x4x8' Pine Trim Board",
    description: "Corner trim and fascia",
    quantity: Math.ceil(trimLinearFt / 8),
    unit: "pieces",
    estimatedPrice: Math.round(Math.ceil(trimLinearFt / 8) * 8.97 * storeInfo.multiplier * 100) / 100,
  });
  
  // Doors and windows (basic estimates)
  if (config.doorCount > 0) {
    materials.push({
      category: "hardware",
      name: "32\" Steel Entry Door",
      description: "Pre-hung exterior door",
      quantity: config.doorCount,
      unit: "pieces",
      estimatedPrice: Math.round(config.doorCount * 185.00 * storeInfo.multiplier * 100) / 100,
    });
  }
  
  if (config.windowCount > 0) {
    materials.push({
      category: "hardware",
      name: "24\"x36\" Single Hung Window",
      description: "Vinyl window with screen",
      quantity: config.windowCount,
      unit: "pieces",
      estimatedPrice: Math.round(config.windowCount * 125.00 * storeInfo.multiplier * 100) / 100,
    });
  }
  
  return materials;
}

function calculateRoofArea(config: ShedConfig): number {
  // Simplified roof area calculation for gable roof
  const riseOverRun = 0.5; // 6/12 pitch (6" rise per 12" run)
  const roofRun = config.width / 2;
  const roofSlope = Math.sqrt(Math.pow(roofRun, 2) + Math.pow(roofRun * riseOverRun, 2));
  const roofArea = config.length * roofSlope * 2; // Both sides
  
  return roofArea * 1.1; // Add 10% for waste and overhangs
}

export function calculateFramingDetails(config: ShedConfig) {
  const floorJoists = Math.floor(config.width / (config.joistSpacing / 12)) + 1;
  const wallStuds = Math.floor(((config.length + config.width) * 2 * 12) / 16) + 8;
  const topPlates = Math.ceil(((config.length + config.width) * 2) * 3 / 10); // Linear feet / 10ft boards
  const joistHangers = floorJoists;
  
  return {
    floorJoists: `${floorJoists} pieces`,
    wallStuds: `${wallStuds} pieces`,
    topPlates: `${Math.round(((config.length + config.width) * 2) * 3)} linear ft`,
    joistHangers: `${joistHangers} pieces`,
  };
}
