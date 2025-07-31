import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { calculateMaterials } from "@/lib/shed-calculations";
import { Package, Wrench, ExternalLink, Printer, BarChart3, Filter } from "lucide-react";
import { Link } from "wouter";
import AppHeader from "@/components/app-header";
import Shed3DViewer from "@/components/shed-3d-viewer";
import ConfigurationTabs from "@/components/configuration-tabs";

import StoreAvailability from "@/components/store-availability";

import { generatePlanViewSVG, generateFrontElevationSVG, generateSideElevationSVG, generateCrossSectionSVG } from "@/lib/blueprint-generator";
import type { ShedConfig, ShedDesign } from "@shared/schema";

// Material Item Component
function MaterialItem({ material, selectedStore }: { material: any; selectedStore: string }) {
  // Mock stock status - in real app this would come from API
  const inStock = Math.random() > 0.2; // 80% chance of being in stock
  const stockCount = Math.floor(Math.random() * 50) + 5;
  const isLimitedStock = stockCount < 10;
  
  const stores = {
    "home-depot": { name: "Home Depot", skuPrefix: "HD" },
    "lowes": { name: "Lowe's", skuPrefix: "LW" },
    "menards": { name: "Menards", skuPrefix: "MN" }
  };

  return (
    <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
      <div className="flex-1">
        <div className="font-medium text-sm">{material.name}</div>
        <div className="text-xs text-neutral-500">SKU: {stores[selectedStore as keyof typeof stores].skuPrefix || "HD"}{Math.floor(Math.random() * 900000) + 100000} • {stores[selectedStore as keyof typeof stores].name}</div>
        {inStock ? (
          <Badge variant={isLimitedStock ? "secondary" : "default"} className={isLimitedStock ? "bg-warning text-white" : "bg-success text-white"}>
            {isLimitedStock ? "⚠ Limited stock" : "✓ In stock"} - {stockCount} available
          </Badge>
        ) : (
          <Badge variant="destructive">
            ✗ Out of stock
          </Badge>
        )}
      </div>
      <div className="text-right">
        <div className="font-medium">{material.quantity} {material.unit}</div>
        <div className="text-sm text-neutral-600">${(material.estimatedPrice / material.quantity).toFixed(2)} ea</div>
        <div className="font-bold text-primary">${material.estimatedPrice.toFixed(2)}</div>
      </div>
    </div>
  );
}

// Full Shopping List Component with Price Comparison
function FullShoppingList({ config, selectedStore, zipCode }: { 
  config: ShedConfig; 
  selectedStore: string; 
  zipCode: string 
}) {
  const [showPriceComparison, setShowPriceComparison] = useState(false);
  const [compareStores, setCompareStores] = useState(["home-depot", "lowes", "menards"]);
  
  const materials = calculateMaterials(config, selectedStore);
  
  // Group materials by category
  const lumberMaterials = materials.filter(m => m.category === "lumber");
  const hardwareMaterials = materials.filter(m => m.category === "hardware");
  const roofingMaterials = materials.filter(m => m.category === "roofing");
  const sidingMaterials = materials.filter(m => m.category === "siding");
  const foundationMaterials = materials.filter(m => m.category === "foundation");

  const totalCost = materials.reduce((sum, material) => sum + material.estimatedPrice, 0);

  // Calculate prices for all stores for comparison
  const allStorePrices = {
    "home-depot": calculateMaterials(config, "home-depot").reduce((sum, m) => sum + m.estimatedPrice, 0),
    "lowes": calculateMaterials(config, "lowes").reduce((sum, m) => sum + m.estimatedPrice, 0),
    "menards": calculateMaterials(config, "menards").reduce((sum, m) => sum + m.estimatedPrice, 0)
  };

  const stores = {
    "home-depot": { name: "Home Depot", url: "https://www.homedepot.com" },
    "lowes": { name: "Lowe's", url: "https://www.lowes.com" },
    "menards": { name: "Menards", url: "https://www.menards.com" }
  };

  const handleOrderFromStore = () => {
    window.open(stores[selectedStore as keyof typeof stores].url, "_blank");
  };

  const handlePrintComplete = () => {
    // Call the parent comprehensive print function which includes everything
    const printCompleteEvent = new CustomEvent('printComplete');
    window.dispatchEvent(printCompleteEvent);
  };

  const storeNames = {
    "home-depot": "Home Depot",
    "lowes": "Lowe's", 
    "menards": "Menards"
  };

  const handleStoreToggle = (store: string) => {
    setCompareStores(prev => 
      prev.includes(store) 
        ? prev.filter(s => s !== store)
        : [...prev, store]
    );
  };

  return (
    <div className="space-y-6">
      {/* Price Comparison Toggle */}
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-neutral-900">Material Details</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPriceComparison(!showPriceComparison)}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          {showPriceComparison ? "Hide" : "Compare"} Prices
        </Button>
      </div>

      {/* Store Price Comparison Table */}
      {showPriceComparison && (
        <div className="bg-neutral-50 p-4 rounded-lg border">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-neutral-600" />
              <span className="text-sm font-medium text-neutral-700">Compare Stores:</span>
            </div>
            {Object.entries(storeNames).map(([store, name]) => (
              <label key={store} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={compareStores.includes(store)}
                  onChange={() => handleStoreToggle(store)}
                  className="rounded"
                />
                {name}
              </label>
            ))}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Store</th>
                  <th className="text-right py-2 font-medium">Total Cost</th>
                  <th className="text-right py-2 font-medium">Savings</th>
                  <th className="text-center py-2 font-medium">Best Price</th>
                </tr>
              </thead>
              <tbody>
                {compareStores.map(store => {
                  const cost = allStorePrices[store as keyof typeof allStorePrices];
                  const minCost = Math.min(...Object.values(allStorePrices));
                  const savings = cost - minCost;
                  const isBest = cost === minCost;
                  
                  return (
                    <tr key={store} className={`border-b ${isBest ? 'bg-green-50' : ''}`}>
                      <td className="py-2 font-medium">
                        {storeNames[store as keyof typeof storeNames]}
                        <div className="text-xs text-neutral-500">
                          {store === "home-depot" ? "South Austin (3.2 mi)" : 
                           store === "lowes" ? "Sunset Valley (4.7 mi)" : 
                           "Cedar Park (18.3 mi)"}
                        </div>
                      </td>
                      <td className="py-2 text-right font-bold">${cost.toFixed(2)}</td>
                      <td className="py-2 text-right">
                        {savings > 0 ? (
                          <span className="text-red-600">+${savings.toFixed(2)}</span>
                        ) : (
                          <span className="text-green-600">$0.00</span>
                        )}
                      </td>
                      <td className="py-2 text-center">
                        {isBest && <Badge className="bg-green-600 text-white">Best</Badge>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lumber Section */}
        {lumberMaterials.length > 0 && (
          <div>
            <h3 className="font-medium text-neutral-900 mb-4 flex items-center">
              <Package className="h-5 w-5 text-orange-600 mr-2" />
              Lumber & Wood Products
            </h3>
            <div className="space-y-3">
              {lumberMaterials.map((material, index) => (
                <MaterialItem key={index} material={material} selectedStore={selectedStore} />
              ))}
            </div>
          </div>
        )}
        
        {/* Hardware Section */}
        {hardwareMaterials.length > 0 && (
          <div>
            <h3 className="font-medium text-neutral-900 mb-4 flex items-center">
              <Wrench className="h-5 w-5 text-gray-600 mr-2" />
              Hardware & Fasteners
            </h3>
            <div className="space-y-3">
              {hardwareMaterials.map((material, index) => (
                <MaterialItem key={index} material={material} selectedStore={selectedStore} />
              ))}
            </div>
          </div>
        )}
        
        {/* Roofing Section */}
        {roofingMaterials.length > 0 && (
          <div>
            <h3 className="font-medium text-neutral-900 mb-4 flex items-center">
              <Package className="h-5 w-5 text-red-600 mr-2" />
              Roofing Materials
            </h3>
            <div className="space-y-3">
              {roofingMaterials.map((material, index) => (
                <MaterialItem key={index} material={material} selectedStore={selectedStore} />
              ))}
            </div>
          </div>
        )}
        
        {/* Siding Section */}
        {sidingMaterials.length > 0 && (
          <div>
            <h3 className="font-medium text-neutral-900 mb-4 flex items-center">
              <Package className="h-5 w-5 text-blue-600 mr-2" />
              Siding & Trim
            </h3>
            <div className="space-y-3">
              {sidingMaterials.map((material, index) => (
                <MaterialItem key={index} material={material} selectedStore={selectedStore} />
              ))}
            </div>
          </div>
        )}
        
        {/* Foundation Section */}
        {foundationMaterials.length > 0 && (
          <div>
            <h3 className="font-medium text-neutral-900 mb-4 flex items-center">
              <Package className="h-5 w-5 text-gray-800 mr-2" />
              Foundation Materials
            </h3>
            <div className="space-y-3">
              {foundationMaterials.map((material, index) => (
                <MaterialItem key={index} material={material} selectedStore={selectedStore} />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Totals and Actions */}
      <div className="border-t border-neutral-200 pt-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-bold">Total Materials Cost</div>
          <div className="text-2xl font-bold text-primary">${totalCost.toFixed(2)}</div>
        </div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={handleOrderFromStore} className="font-medium">
            <ExternalLink className="h-4 w-4 mr-2" />
            Order from {stores[selectedStore as keyof typeof stores].name}
          </Button>
          <Button onClick={handlePrintComplete} className="font-medium">
            <Printer className="h-4 w-4 mr-2" />
            Print Complete Package
          </Button>
          <Button onClick={() => {
            // Call the parent print function
            const printPlansEvent = new CustomEvent('printPlans');
            window.dispatchEvent(printPlansEvent);
          }} variant="outline" className="font-medium">
            <Printer className="h-4 w-4 mr-2" />
            Print Plans Only
          </Button>
        </div>
      </div>
      
      {materials.length === 0 && (
        <div className="text-center text-neutral-500 py-8">
          Configure your shed to see materials
        </div>
      )}
    </div>
  );
}

export default function ShedDesigner() {
  const { toast } = useToast();

  const [zipCode, setZipCode] = useState("78704");

  // Load saved zip code on component mount
  useEffect(() => {
    const savedZipCode = localStorage.getItem("shedbuilder-zipcode");
    if (savedZipCode) {
      setZipCode(savedZipCode);
    }
  }, []);

  // Save zip code whenever it changes
  const handleZipCodeChange = (newZipCode: string) => {
    setZipCode(newZipCode);
    localStorage.setItem("shedbuilder-zipcode", newZipCode);
  };

  const [selectedStore, setSelectedStore] = useState("home-depot");
  
  const [config, setConfig] = useState<ShedConfig>({
    name: "My Shed",
    length: 10,
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
  });

  // Fetch templates
  const { data: templates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ["/api/templates"],
  });

  const handleConfigChange = (updates: Partial<ShedConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleTemplateSelect = (template: ShedDesign) => {
    setConfig({
      name: template.name,
      length: template.length,
      width: template.width,
      height: template.height,
      roofType: template.roofType as "gable" | "gambrel" | "lean-to" | "hip" | "shed" | "saltbox",
      foundationType: template.foundationType as "concrete-slab" | "gravel-pad" | "concrete-piers",
      lumberGrade: template.lumberGrade as "pressure-treated" | "douglas-fir" | "southern-pine",
      joistSpacing: template.joistSpacing as 12 | 16 | 24,
      studSize: template.studSize as "2x4" | "2x6",
      wallHeight: template.wallHeight,
      doorCount: template.doorCount,
      windowCount: template.windowCount,
      sidingType: template.sidingType as "plywood" | "vinyl" | "wood" | "metal" | "fiber-cement",
      roofingType: template.roofingType as "asphalt-shingles" | "architectural-shingles" | "metal" | "rubber",
    });
    
    toast({
      title: "Template Applied",
      description: `Loaded ${template.name} template configuration.`,
    });
  };



  const stores = {
    "home-depot": { name: "Home Depot", url: "https://www.homedepot.com" },
    "lowes": { name: "Lowe's", url: "https://www.lowes.com" },
    "menards": { name: "Menards", url: "https://www.menards.com" }
  };

  // Listen for print events
  useEffect(() => {
    const handlePrintPlansEvent = () => {
      handlePrintPlans();
    };
    const handlePrintCompleteEvent = () => {
      handlePrintComplete();
    };
    window.addEventListener('printPlans', handlePrintPlansEvent);
    window.addEventListener('printComplete', handlePrintCompleteEvent);
    return () => {
      window.removeEventListener('printPlans', handlePrintPlansEvent);
      window.removeEventListener('printComplete', handlePrintCompleteEvent);
    };
  }, [config, zipCode, selectedStore]);

  const handlePrintComplete = () => {
    const selectedStoreName = stores[selectedStore as keyof typeof stores].name;
    
    // Create a new window for printing with the comprehensive print layout
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      // Add comprehensive styles for all pages
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Complete Shed Building Package - ${config.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; font-size: 11px; line-height: 1.4; }
            .print-page { min-height: 100vh; page-break-after: always; }
            .print-page:last-child { page-break-after: avoid; }
            .page-break { page-break-before: always; }
            h1 { text-align: center; font-size: 24px; margin-bottom: 20px; border-bottom: 3px solid #000; padding-bottom: 10px; }
            h2 { color: #333; font-size: 18px; border-bottom: 2px solid #ccc; padding-bottom: 8px; margin-top: 30px; margin-bottom: 20px; }
            h3 { color: #555; font-size: 14px; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 20px; margin-bottom: 15px; }
            .print-header { margin-bottom: 30px; }
            .project-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; background: #f8f9fa; padding: 15px; border: 1px solid #ddd; font-size: 12px; }
            .blueprint-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .blueprint-item { text-align: center; page-break-inside: avoid; }
            .blueprint-item h3 { font-size: 12px; margin-bottom: 10px; text-align: center; }
            .blueprint-item svg { max-width: 100%; height: auto; border: 1px solid #ccc; }
            .specifications { margin-top: 30px; }
            .spec-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
            .spec-item { padding: 8px; background: #f9f9f9; border: 1px solid #ddd; font-size: 11px; }
            .cut-list-section, .materials-section { margin-top: 20px; }
            .cut-list-item { margin-bottom: 25px; page-break-inside: avoid; }
            .cut-table, .material-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 10px; }
            .cut-table th, .cut-table td, .material-table th, .material-table td { border: 1px solid #000; padding: 6px; text-align: left; }
            .cut-table th, .material-table th { background: #f5f5f5; font-weight: bold; }
            .cutting-notes { margin-top: 30px; background: #fff9c4; padding: 15px; border: 1px solid #e6db74; }
            .cutting-notes ul { margin: 10px 0; padding-left: 20px; }
            .cutting-notes li { margin-bottom: 5px; }
            .material-category { margin-bottom: 25px; page-break-inside: avoid; }
            .total-section { margin-top: 30px; padding-top: 20px; border-top: 2px solid #333; }
            .total-cost { font-size: 16px; font-weight: bold; text-align: right; margin-bottom: 15px; }
            .disclaimer { font-size: 9px; color: #666; font-style: italic; text-align: center; }
            @media print {
              body { margin: 0; padding: 15px; }
              .print-page { min-height: auto; }
            }
          </style>
        </head>
        <body>
          <div class="print-page">
            <div class="print-header">
              <h1>Complete Shed Building Package</h1>
              <div class="project-info">
                <div><strong>Project Name:</strong> ${config.name}</div>
                <div><strong>Dimensions:</strong> ${config.length}' × ${config.width}' × ${config.wallHeight}'</div>
                <div><strong>Roof Type:</strong> ${config.roofType.charAt(0).toUpperCase() + config.roofType.slice(1)}</div>
                <div><strong>Foundation:</strong> ${config.foundationType.charAt(0).toUpperCase() + config.foundationType.slice(1)}</div>
                <div><strong>Wall Height:</strong> ${config.wallHeight}'</div>
                <div><strong>Siding:</strong> ${config.sidingType.charAt(0).toUpperCase() + config.sidingType.slice(1)}</div>
                <div><strong>Date Generated:</strong> ${new Date().toLocaleDateString()}</div>
                <div><strong>Store:</strong> ${selectedStoreName}</div>
                <div><strong>Location:</strong> ${zipCode}</div>
                <div><strong>Total Estimated Cost:</strong> $${materials.reduce((sum, material) => sum + material.estimatedPrice, 0).toFixed(2)}</div>
              </div>
            </div>

            <h2>Blueprint Plans</h2>
            <div class="blueprint-grid">
              <div class="blueprint-item">
                <h3>PLAN VIEW</h3>
                ${generatePlanViewSVG(config)}
              </div>
              <div class="blueprint-item">
                <h3>FRONT ELEVATION</h3>
                ${generateFrontElevationSVG(config)}
              </div>
              <div class="blueprint-item">
                <h3>SIDE ELEVATION</h3>
                ${generateSideElevationSVG(config)}
              </div>
              <div class="blueprint-item">
                <h3>CROSS SECTION</h3>
                ${generateCrossSectionSVG(config)}
              </div>
            </div>
          </div>

          <div class="specifications">
            <h2>Specifications</h2>
            <div class="spec-grid">
              <div class="spec-item"><strong>Foundation Type:</strong> ${config.foundationType.replace('-', ' ')}</div>
              <div class="spec-item"><strong>Lumber Grade:</strong> ${config.lumberGrade.replace('-', ' ')}</div>
              <div class="spec-item"><strong>Joist Spacing:</strong> ${config.joistSpacing}" O.C.</div>
              <div class="spec-item"><strong>Stud Size:</strong> ${config.studSize}</div>
              <div class="spec-item"><strong>Wall Height:</strong> ${config.wallHeight}'</div>
              <div class="spec-item"><strong>Doors:</strong> ${config.doorCount}</div>
              <div class="spec-item"><strong>Windows:</strong> ${config.windowCount}</div>
              <div class="spec-item"><strong>Siding:</strong> ${config.sidingType.replace('-', ' ')}</div>
              <div class="spec-item"><strong>Roofing:</strong> ${config.roofingType.replace('-', ' ')}</div>
            </div>
          </div>
        </div>
      `);

      // Add Page 2: Cut List
      const studCount = Math.ceil((config.length + config.width) * 2 / 1.33);
      const joistCount = Math.ceil(config.length * 12 / config.joistSpacing) + 1;
      
      printWindow.document.write(`
        <div class="print-page page-break">
          <div class="print-header">
            <h1>Lumber Cut List</h1>
            <div class="project-info">
              <div><strong>Project:</strong> ${config.name}</div>
              <div><strong>Cut Date:</strong> ${new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <div class="cut-list-section">
            <div class="cut-list-item">
              <h3>2x4 Wall Studs</h3>
              <table class="cut-table">
                <thead>
                  <tr><th>Length</th><th>Quantity</th><th>Purpose</th><th>Notes</th></tr>
                </thead>
                <tbody>
                  <tr><td>${config.wallHeight}'</td><td>${studCount}</td><td>Wall studs (16" O.C.)</td><td></td></tr>
                </tbody>
              </table>
            </div>

            <div class="cut-list-item">
              <h3>2x4 Top/Bottom Plates</h3>
              <table class="cut-table">
                <thead>
                  <tr><th>Length</th><th>Quantity</th><th>Purpose</th><th>Notes</th></tr>
                </thead>
                <tbody>
                  <tr><td>${config.length}'</td><td>4</td><td>Front/back plates</td><td></td></tr>
                  <tr><td>${config.width - 3.5/12}'</td><td>4</td><td>Side plates</td><td></td></tr>
                </tbody>
              </table>
            </div>

            <div class="cut-list-item">
              <h3>2x8 Floor Joists</h3>
              <table class="cut-table">
                <thead>
                  <tr><th>Length</th><th>Quantity</th><th>Purpose</th><th>Notes</th></tr>
                </thead>
                <tbody>
                  <tr><td>${config.width}'</td><td>${joistCount}</td><td>Floor joists (${config.joistSpacing}" O.C.)</td><td></td></tr>
                </tbody>
              </table>
            </div>

            <div class="cutting-notes">
              <h3>Cutting Notes</h3>
              <ul>
                <li>Always measure twice, cut once</li>
                <li>Mark all pieces clearly before cutting</li>
                <li>Use proper safety equipment when cutting</li>
                <li>Double-check measurements against plans</li>
                <li>Account for kerf (blade width) when cutting</li>
              </ul>
            </div>
          </div>
        </div>
      `);

      // Add Page 3: Material List
      const totalCost = materials.reduce((sum, material) => sum + material.estimatedPrice, 0);
      const materialCategories = [
        { name: 'Lumber & Wood Products', materials: lumberMaterials },
        { name: 'Hardware & Fasteners', materials: hardwareMaterials },
        { name: 'Roofing Materials', materials: roofingMaterials },
        { name: 'Siding & Trim', materials: sidingMaterials },
        { name: 'Foundation Materials', materials: foundationMaterials }
      ];

      printWindow.document.write(`
        <div class="print-page page-break">
          <div class="print-header">
            <h1>Material Shopping List</h1>
            <div class="project-info">
              <div><strong>Project:</strong> ${config.name}</div>
              <div><strong>Estimated Total:</strong> $${totalCost.toFixed(2)}</div>
              <div><strong>Location:</strong> ${zipCode}</div>
              <div><strong>Store:</strong> ${selectedStoreName}</div>
              <div><strong>Pricing Source:</strong> Average retail prices (${new Date().toLocaleDateString()})</div>
            </div>
          </div>

          <div class="materials-section">
      `);

      materialCategories.forEach(category => {
        if (category.materials.length > 0) {
          printWindow.document.write(`
            <div class="material-category">
              <h2>${category.name}</h2>
              <table class="material-table">
                <thead>
                  <tr><th>Item</th><th>Quantity</th><th>Unit</th><th>Est. Price</th><th>Total</th></tr>
                </thead>
                <tbody>
          `);
          
          category.materials.forEach(material => {
            printWindow.document.write(`
              <tr>
                <td>${material.name}</td>
                <td>${material.quantity}</td>
                <td>${material.unit}</td>
                <td>$${(material.estimatedPrice / material.quantity).toFixed(2)}</td>
                <td>$${material.estimatedPrice.toFixed(2)}</td>
              </tr>
            `);
          });
          
          printWindow.document.write(`
                </tbody>
              </table>
            </div>
          `);
        }
      });

      printWindow.document.write(`
          </div>
          <div class="total-section">
            <div class="total-cost">
              <strong>Total Estimated Cost: $${totalCost.toFixed(2)}</strong>
            </div>
            <div class="disclaimer">
              <p><em>Pricing estimates based on average retail prices. Please verify current pricing and availability at ${selectedStoreName} for ZIP code ${zipCode} before purchase. Actual prices may vary by location and current market conditions.</em></p>
            </div>
          </div>
        </div>
      `);

      printWindow.document.write(`</body></html>`);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }

    toast({
      title: "Printing Complete Package",
      description: "Opening print dialog with blueprints, cut list, and shopping list.",
    });
  };

  const handlePrintPlans = () => {
    const selectedStoreName = stores[selectedStore as keyof typeof stores].name;
    
    // Create a new window for printing with the print layout
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      // Get the print stylesheet
      const printStyles = `
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; font-size: 12px; line-height: 1.4; color: #000; }
          .print-page { page-break-after: always; min-height: 100vh; padding: 0.5in; margin: 0; }
          .print-page:last-child { page-break-after: auto; }
          .page-break { page-break-before: always; }
          .print-header { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
          .print-header h1 { font-size: 24px; font-weight: bold; margin: 0 0 10px 0; text-align: center; }
          .project-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px; }
          .blueprints-section { margin-bottom: 30px; }
          .blueprints-section h2 { font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          .blueprint-container { border: 1px solid #000; padding: 10px; background: white; }
          .specifications { margin-bottom: 30px; }
          .specifications h2 { font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          .spec-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
          .spec-item { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
          .cut-list-section { margin-bottom: 30px; }
          .cut-list-item { margin-bottom: 25px; page-break-inside: avoid; }
          .cut-list-item h3 { font-size: 16px; font-weight: bold; margin-bottom: 10px; background: #f0f0f0; padding: 8px; border: 1px solid #ccc; }
          .cut-table { width: 100%; border-collapse: collapse; font-size: 11px; }
          .cut-table th, .cut-table td { border: 1px solid #000; padding: 6px; text-align: left; }
          .cut-table th { background: #f5f5f5; font-weight: bold; }
          .cut-table tr:nth-child(even) { background: #f9f9f9; }
          .materials-section { margin-bottom: 30px; }
          .material-category { margin-bottom: 25px; page-break-inside: avoid; }
          .material-category h2 { font-size: 16px; font-weight: bold; margin-bottom: 10px; background: #e8e8e8; padding: 8px; border: 1px solid #ccc; }
          .material-table { width: 100%; border-collapse: collapse; font-size: 11px; }
          .material-table th, .material-table td { border: 1px solid #000; padding: 6px; text-align: left; }
          .material-table th { background: #f5f5f5; font-weight: bold; }
          .material-table tr:nth-child(even) { background: #f9f9f9; }
          .material-table td:nth-child(2), .material-table td:nth-child(4), .material-table td:nth-child(5) { text-align: right; }
          .cutting-notes { margin-top: 30px; page-break-inside: avoid; }
          .cutting-notes h3 { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
          .cutting-notes ul { list-style-type: disc; margin-left: 20px; }
          .cutting-notes li { margin-bottom: 5px; }
          .total-section { margin-top: 30px; border-top: 2px solid #000; padding-top: 15px; }
          .total-cost { font-size: 18px; text-align: right; margin-bottom: 10px; }
          .disclaimer { font-size: 10px; color: #666; font-style: italic; }
        </style>
      `;

      // Start building the print content
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Shed Construction Plans - ${config.name}</title>
          ${printStyles}
        </head>
        <body>
      `);

      // Add Page 1: Plans and Specifications
      printWindow.document.write(`
        <div class="print-page">
          <div class="print-header">
            <h1>Shed Construction Plans</h1>
            <div class="project-info">
              <div><strong>Project:</strong> ${config.name}</div>
              <div><strong>Dimensions:</strong> ${config.length}' × ${config.width}' × ${config.wallHeight}'</div>
              <div><strong>Roof Type:</strong> ${config.roofType.charAt(0).toUpperCase() + config.roofType.slice(1)}</div>
              <div><strong>Foundation:</strong> ${config.foundationType.replace('-', ' ')}</div>
              <div><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <div class="blueprints-section">
            <h2>Architectural Drawings</h2>
            <div class="blueprint-container">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                  <h3 style="text-align: center; margin-bottom: 10px; font-size: 14px;">PLAN VIEW</h3>
                  ${generatePlanViewSVG(config)}
                </div>
                <div>
                  <h3 style="text-align: center; margin-bottom: 10px; font-size: 14px;">FRONT ELEVATION</h3>
                  ${generateFrontElevationSVG(config)}
                </div>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                  <h3 style="text-align: center; margin-bottom: 10px; font-size: 14px;">SIDE ELEVATION</h3>
                  ${generateSideElevationSVG(config)}
                </div>
                <div>
                  <h3 style="text-align: center; margin-bottom: 10px; font-size: 14px;">CROSS SECTION</h3>
                  ${generateCrossSectionSVG(config)}
                </div>
              </div>
            </div>
          </div>

          <div class="specifications">
            <h2>Specifications</h2>
            <div class="spec-grid">
              <div class="spec-item"><strong>Foundation Type:</strong> ${config.foundationType.replace('-', ' ')}</div>
              <div class="spec-item"><strong>Lumber Grade:</strong> ${config.lumberGrade.replace('-', ' ')}</div>
              <div class="spec-item"><strong>Joist Spacing:</strong> ${config.joistSpacing}" O.C.</div>
              <div class="spec-item"><strong>Stud Size:</strong> ${config.studSize}</div>
              <div class="spec-item"><strong>Wall Height:</strong> ${config.wallHeight}'</div>
              <div class="spec-item"><strong>Doors:</strong> ${config.doorCount}</div>
              <div class="spec-item"><strong>Windows:</strong> ${config.windowCount}</div>
              <div class="spec-item"><strong>Siding:</strong> ${config.sidingType.replace('-', ' ')}</div>
              <div class="spec-item"><strong>Roofing:</strong> ${config.roofingType.replace('-', ' ')}</div>
            </div>
          </div>
        </div>
      `);

      // Add Page 2: Cut List
      const materials = calculateMaterials(config);
      const lumberMaterials = materials.filter(m => m.category === "lumber");
      
      printWindow.document.write(`
        <div class="print-page page-break">
          <div class="print-header">
            <h1>Lumber Cut List</h1>
            <div class="project-info">
              <div><strong>Project:</strong> ${config.name}</div>
              <div><strong>Cut Date:</strong> ${new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <div class="cut-list-section">
      `);

      // Generate specific cut list
      if (lumberMaterials.length > 0) {
        // Wall Studs
        const studCount = Math.ceil((config.length + config.width) * 2 / 1.33);
        printWindow.document.write(`
          <div class="cut-list-item">
            <h3>2x4 Wall Studs</h3>
            <table class="cut-table">
              <thead>
                <tr><th>Length</th><th>Quantity</th><th>Purpose</th><th>Notes</th></tr>
              </thead>
              <tbody>
                <tr><td>${config.wallHeight}'</td><td>${studCount}</td><td>Wall studs (16" O.C.)</td><td></td></tr>
              </tbody>
            </table>
          </div>
        `);

        // Plates
        printWindow.document.write(`
          <div class="cut-list-item">
            <h3>2x4 Top/Bottom Plates</h3>
            <table class="cut-table">
              <thead>
                <tr><th>Length</th><th>Quantity</th><th>Purpose</th><th>Notes</th></tr>
              </thead>
              <tbody>
                <tr><td>${config.length}'</td><td>4</td><td>Front/back plates</td><td></td></tr>
                <tr><td>${config.width - 3.5/12}'</td><td>4</td><td>Side plates</td><td></td></tr>
              </tbody>
            </table>
          </div>
        `);

        // Floor Joists
        const joistCount = Math.ceil(config.length * 12 / config.joistSpacing) + 1;
        printWindow.document.write(`
          <div class="cut-list-item">
            <h3>2x8 Floor Joists</h3>
            <table class="cut-table">
              <thead>
                <tr><th>Length</th><th>Quantity</th><th>Purpose</th><th>Notes</th></tr>
              </thead>
              <tbody>
                <tr><td>${config.width}'</td><td>${joistCount}</td><td>Floor joists (${config.joistSpacing}" O.C.)</td><td></td></tr>
              </tbody>
            </table>
          </div>
        `);

        // Rafters
        const rafterLength = config.roofType === 'gable' 
          ? Math.sqrt(Math.pow(config.width / 2, 2) + Math.pow(2, 2))
          : config.width / Math.cos(Math.PI / 12);
        const rafterCount = Math.ceil(config.length * 12 / 24) + 1;
        printWindow.document.write(`
          <div class="cut-list-item">
            <h3>2x6 Roof Rafters</h3>
            <table class="cut-table">
              <thead>
                <tr><th>Length</th><th>Quantity</th><th>Purpose</th><th>Notes</th></tr>
              </thead>
              <tbody>
                <tr><td>${Math.ceil(rafterLength)}'</td><td>${rafterCount * 2}</td><td>Roof rafters (24" O.C.)</td><td></td></tr>
              </tbody>
            </table>
          </div>
        `);
      }

      printWindow.document.write(`
          </div>
          <div class="cutting-notes">
            <h3>Cutting Notes</h3>
            <ul>
              <li>Always measure twice, cut once</li>
              <li>Mark all pieces clearly before cutting</li>
              <li>Use proper safety equipment when cutting</li>
              <li>Double-check measurements against plans</li>
              <li>Account for kerf (blade width) when cutting</li>
            </ul>
          </div>
        </div>
      `);

      // Add Page 3: Material List
      const totalCost = materials.reduce((sum, material) => sum + material.estimatedPrice, 0);
      const materialCategories = [
        { name: 'Lumber & Wood Products', materials: materials.filter(m => m.category === "lumber") },
        { name: 'Hardware & Fasteners', materials: materials.filter(m => m.category === "hardware") },
        { name: 'Roofing Materials', materials: materials.filter(m => m.category === "roofing") },
        { name: 'Siding & Trim', materials: materials.filter(m => m.category === "siding") },
        { name: 'Foundation Materials', materials: materials.filter(m => m.category === "foundation") }
      ];

      printWindow.document.write(`
        <div class="print-page page-break">
          <div class="print-header">
            <h1>Material Shopping List</h1>
            <div class="project-info">
              <div><strong>Project:</strong> ${config.name}</div>
              <div><strong>Estimated Total:</strong> $${totalCost.toFixed(2)}</div>
              <div><strong>Location:</strong> ${zipCode}</div>
              <div><strong>Store:</strong> ${selectedStoreName}</div>
              <div><strong>Pricing Source:</strong> Average retail prices (${new Date().toLocaleDateString()})</div>
            </div>
          </div>

          <div class="materials-section">
      `);

      materialCategories.forEach(category => {
        if (category.materials.length > 0) {
          printWindow.document.write(`
            <div class="material-category">
              <h2>${category.name}</h2>
              <table class="material-table">
                <thead>
                  <tr><th>Item</th><th>Quantity</th><th>Unit</th><th>Est. Price</th><th>Total</th></tr>
                </thead>
                <tbody>
          `);
          
          category.materials.forEach(material => {
            printWindow.document.write(`
              <tr>
                <td>${material.name}</td>
                <td>${material.quantity}</td>
                <td>${material.unit}</td>
                <td>$${(material.estimatedPrice / material.quantity).toFixed(2)}</td>
                <td>$${material.estimatedPrice.toFixed(2)}</td>
              </tr>
            `);
          });
          
          printWindow.document.write(`
                </tbody>
              </table>
            </div>
          `);
        }
      });

      printWindow.document.write(`
          </div>
          <div class="total-section">
            <div class="total-cost">
              <strong>Total Estimated Cost: $${totalCost.toFixed(2)}</strong>
            </div>
            <div class="disclaimer">
              <p><em>Pricing estimates based on average retail prices. Please verify current pricing and availability at ${selectedStoreName} for ZIP code ${zipCode} before purchase. Actual prices may vary by location and current market conditions.</em></p>
            </div>
          </div>
        </div>
      `);

      printWindow.document.write(`
        </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
    
    toast({
      title: "Printing Plans",
      description: "Opening print dialog with comprehensive plans, cut list, and material list.",
    });
  };

  const handleShare = () => {
    // Generate shareable link
    const shareUrl = `${window.location.origin}?config=${encodeURIComponent(JSON.stringify(config))}`;
    
    if (navigator.share) {
      navigator.share({
        title: "ShedBuilder Pro - My Shed Design",
        text: `Check out my ${config.length}×${config.width} shed design!`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "Share link has been copied to your clipboard.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Design Panel */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-material p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-neutral-900">Shed Designer</h2>
              </div>
              
              {/* Blueprint Visualization */}
              <Shed3DViewer 
                config={config}
              />
              
              {/* Quick Dimensions */}
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Label className="block text-sm text-neutral-600 mb-1">Length</Label>
                  <Input
                    type="number"
                    min="4"
                    max="40"
                    value={config.length}
                    onChange={(e) => handleConfigChange({ length: parseFloat(e.target.value) })}
                    className="text-center"
                  />
                  <span className="text-xs text-neutral-500">feet</span>
                </div>
                <div className="text-center">
                  <Label className="block text-sm text-neutral-600 mb-1">Width</Label>
                  <Input
                    type="number"
                    min="4"
                    max="40"
                    value={config.width}
                    onChange={(e) => handleConfigChange({ width: parseFloat(e.target.value) })}
                    className="text-center"
                  />
                  <span className="text-xs text-neutral-500">feet</span>
                </div>
                <div className="text-center">
                  <Label className="block text-sm text-neutral-600 mb-1">Height</Label>
                  <Input
                    type="number"
                    min="6"
                    max="16"
                    value={config.height}
                    onChange={(e) => handleConfigChange({ height: parseFloat(e.target.value) })}
                    className="text-center"
                  />
                  <span className="text-xs text-neutral-500">feet</span>
                </div>
              </div>
            </div>
            
            {/* Configuration Tabs */}
            <div className="mt-6">
              <ConfigurationTabs 
                config={config}
                onConfigChange={handleConfigChange}
              />
            </div>
          </div>
          
          {/* Side Panel */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Templates */}
            <div className="bg-white rounded-lg shadow-material p-6">
              <h3 className="font-medium text-neutral-900 mb-4">Popular Templates</h3>
              <div className="grid grid-cols-1 gap-3">
                {templatesLoading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-16 bg-neutral-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : (
                  (templates as ShedDesign[]).map((template: ShedDesign) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      className="p-4 h-auto text-left justify-start"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div>
                        <div className="font-medium text-sm">{template.name}</div>
                        <div className="text-xs text-neutral-500">
                          {template.length}×{template.width} - {template.templateCategory}
                        </div>
                      </div>
                    </Button>
                  ))
                )}
              </div>
            </div>
            
            {/* Complete Shopping List */}
            <div className="bg-white rounded-lg shadow-material p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-neutral-900">
                  Shopping List - {config.length}×{config.width} {config.roofType.charAt(0).toUpperCase() + config.roofType.slice(1)} Roof Shed
                </h3>
              </div>
              
              {/* Quick Cost Summary */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-medium text-neutral-900">Project Estimate</h4>
                    <p className="text-sm text-neutral-600">{config.length}×{config.width} {config.roofType} roof shed</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      ${calculateMaterials(config, selectedStore).reduce((sum, material) => sum + material.estimatedPrice, 0).toFixed(2)}
                    </div>
                    <p className="text-sm text-neutral-600">materials only</p>
                  </div>
                </div>
                
                {/* Category Subtotals */}
                <div className="space-y-2 mb-3">
                  {(() => {
                    const materials = calculateMaterials(config, selectedStore);
                    const categorizedMaterials = materials.reduce((acc, material) => {
                      if (!acc[material.category]) acc[material.category] = [];
                      acc[material.category].push(material);
                      return acc;
                    }, {} as Record<string, typeof materials>);

                    const categoryTotals = Object.entries(categorizedMaterials).map(([category, items]) => ({
                      category,
                      total: items.reduce((sum, item) => sum + item.estimatedPrice, 0),
                    }));

                    const categoryLabels: Record<string, string> = {
                      lumber: "Lumber & Framing",
                      hardware: "Hardware & Fasteners", 
                      roofing: "Roofing Materials",
                      siding: "Siding & Trim",
                      foundation: "Foundation",
                    };

                    return categoryTotals.map(({ category, total }) => (
                      <div key={category} className="flex justify-between items-center text-sm">
                        <span className="text-neutral-600">{categoryLabels[category] || category}</span>
                        <span className="font-medium">${total.toFixed(2)}</span>
                      </div>
                    ));
                  })()}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="zipCode" className="text-sm font-medium text-neutral-700">ZIP Code:</Label>
                    <Input
                      id="zipCode"
                      type="text"
                      value={zipCode}
                      onChange={(e) => handleZipCodeChange(e.target.value)}
                      placeholder="Enter ZIP"
                      className="w-20 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-neutral-700">Store:</label>
                    <select 
                      value={selectedStore} 
                      onChange={(e) => setSelectedStore(e.target.value)}
                      className="border border-neutral-300 rounded px-3 py-2 text-sm min-w-[200px]"
                    >
                      <option value="home-depot">Home Depot - South Austin (3.2 mi)</option>
                      <option value="lowes">Lowe's - Sunset Valley (4.7 mi)</option>
                      <option value="menards">Menards - Cedar Park (18.3 mi)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <FullShoppingList config={config} selectedStore={selectedStore} zipCode={zipCode} />
            </div>
            
            {/* Store Availability */}
            <StoreAvailability zipCode={zipCode} />
            

          </div>
        </div>
      </div>




    </div>
  );
}
