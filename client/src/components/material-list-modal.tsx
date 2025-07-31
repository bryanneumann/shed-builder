import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Printer, Download, Package, Wrench } from "lucide-react";
import { useState } from "react";
import type { ShedConfig } from "@shared/schema";
import { calculateMaterials } from "@/lib/shed-calculations";

interface MaterialListModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ShedConfig;
  zipCode: string;
}

export default function MaterialListModal({ isOpen, onClose, config, zipCode }: MaterialListModalProps) {
  const [selectedStore, setSelectedStore] = useState<string>("home-depot");
  const materials = calculateMaterials(config, selectedStore);
  
  // Group materials by category
  const lumberMaterials = materials.filter(m => m.category === "lumber");
  const hardwareMaterials = materials.filter(m => m.category === "hardware");
  const roofingMaterials = materials.filter(m => m.category === "roofing");
  const sidingMaterials = materials.filter(m => m.category === "siding");
  const foundationMaterials = materials.filter(m => m.category === "foundation");

  const totalCost = materials.reduce((sum, material) => sum + material.estimatedPrice, 0);

  // Store location data with sample locations
  const getStoreLocations = (zipCode: string) => {
    // This would normally be an API call, but we'll use sample data based on common zip codes
    const storesByZip: Record<string, any> = {
      "78704": { // Austin, TX
        "home-depot": { name: "Home Depot", url: "https://www.homedepot.com", skuPrefix: "HD", town: "South Austin", distance: 3.2 },
        "lowes": { name: "Lowe's", url: "https://www.lowes.com", skuPrefix: "LW", town: "Sunset Valley", distance: 4.7 },
        "menards": { name: "Menards", url: "https://www.menards.com", skuPrefix: "MN", town: "Cedar Park", distance: 18.3 }
      },
      "60601": { // Chicago, IL
        "home-depot": { name: "Home Depot", url: "https://www.homedepot.com", skuPrefix: "HD", town: "Downtown Chicago", distance: 2.1 },
        "lowes": { name: "Lowe's", url: "https://www.lowes.com", skuPrefix: "LW", town: "Lincoln Park", distance: 3.8 },
        "menards": { name: "Menards", url: "https://www.menards.com", skuPrefix: "MN", town: "Schaumburg", distance: 28.4 }
      },
      "30309": { // Atlanta, GA
        "home-depot": { name: "Home Depot", url: "https://www.homedepot.com", skuPrefix: "HD", town: "Midtown Atlanta", distance: 1.9 },
        "lowes": { name: "Lowe's", url: "https://www.lowes.com", skuPrefix: "LW", town: "Buckhead", distance: 4.2 },
        "menards": { name: "Menards", url: "https://www.menards.com", skuPrefix: "MN", town: "Not Available", distance: null }
      }
    };

    // Default fallback for other zip codes
    const defaultStores = {
      "home-depot": { name: "Home Depot", url: "https://www.homedepot.com", skuPrefix: "HD", town: "Local Store", distance: 5.2 },
      "lowes": { name: "Lowe's", url: "https://www.lowes.com", skuPrefix: "LW", town: "Local Store", distance: 6.8 },
      "menards": { name: "Menards", url: "https://www.menards.com", skuPrefix: "MN", town: "Regional Store", distance: 15.4 }
    };

    return storesByZip[zipCode] || defaultStores;
  };

  const stores = getStoreLocations(zipCode);

  const handleOrderFromStore = () => {
    window.open(stores[selectedStore as keyof typeof stores].url, "_blank");
  };

  const handlePrintList = () => {
    const selectedStoreName = stores[selectedStore as keyof typeof stores].name;
    
    // Create a temporary print window with just the material list
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Shopping List - ${config.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
            h1 { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
            h2 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background: #f5f5f5; font-weight: bold; }
            tr:nth-child(even) { background: #f9f9f9; }
            .total { font-size: 16px; font-weight: bold; text-align: right; margin-top: 20px; }
            .project-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Shopping List - ${selectedStoreName}</h1>
          <div class="project-info">
            <div><strong>Project:</strong> ${config.name}</div>
            <div><strong>Dimensions:</strong> ${config.length}' × ${config.width}' × ${config.wallHeight}'</div>
            <div><strong>Roof Type:</strong> ${config.roofType.charAt(0).toUpperCase() + config.roofType.slice(1)}</div>
            <div><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
            <div><strong>Store:</strong> ${selectedStoreName}</div>
            <div><strong>Location:</strong> ${zipCode}</div>
          </div>
      `);

      // Add lumber materials
      if (lumberMaterials.length > 0) {
        printWindow.document.write('<h2>Lumber & Wood Products</h2><table><tr><th>Item</th><th>Quantity</th><th>Unit</th><th>Est. Price</th><th>Total</th></tr>');
        lumberMaterials.forEach(material => {
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
        printWindow.document.write('</table>');
      }

      // Add hardware materials
      if (hardwareMaterials.length > 0) {
        printWindow.document.write('<h2>Hardware & Fasteners</h2><table><tr><th>Item</th><th>Quantity</th><th>Unit</th><th>Est. Price</th><th>Total</th></tr>');
        hardwareMaterials.forEach(material => {
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
        printWindow.document.write('</table>');
      }

      // Add roofing materials
      if (roofingMaterials.length > 0) {
        printWindow.document.write('<h2>Roofing Materials</h2><table><tr><th>Item</th><th>Quantity</th><th>Unit</th><th>Est. Price</th><th>Total</th></tr>');
        roofingMaterials.forEach(material => {
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
        printWindow.document.write('</table>');
      }

      // Add siding materials
      if (sidingMaterials.length > 0) {
        printWindow.document.write('<h2>Siding & Trim</h2><table><tr><th>Item</th><th>Quantity</th><th>Unit</th><th>Est. Price</th><th>Total</th></tr>');
        sidingMaterials.forEach(material => {
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
        printWindow.document.write('</table>');
      }

      // Add foundation materials
      if (foundationMaterials.length > 0) {
        printWindow.document.write('<h2>Foundation Materials</h2><table><tr><th>Item</th><th>Quantity</th><th>Unit</th><th>Est. Price</th><th>Total</th></tr>');
        foundationMaterials.forEach(material => {
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
        printWindow.document.write('</table>');
      }

      printWindow.document.write(`
          <div class="total">Total Estimated Cost: $${totalCost.toFixed(2)}</div>
          <p style="font-size: 10px; color: #666; font-style: italic; margin-top: 20px;">
            Pricing estimates based on average retail prices. Please verify current pricing and availability at ${selectedStoreName} before purchase.
          </p>
        </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  const handlePrintComplete = () => {
    const selectedStoreName = stores[selectedStore as keyof typeof stores].name;
    
    // Create comprehensive print document with shopping list and plans
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Complete Shed Building Package - ${config.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
            h1 { text-align: center; border-bottom: 3px solid #000; padding-bottom: 10px; margin-bottom: 30px; }
            h2 { color: #333; border-bottom: 2px solid #ccc; padding-bottom: 8px; margin-top: 30px; page-break-before: always; }
            h3 { color: #555; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background: #f5f5f5; font-weight: bold; }
            tr:nth-child(even) { background: #f9f9f9; }
            .total { font-size: 16px; font-weight: bold; text-align: right; margin-top: 20px; }
            .project-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; background: #f8f9fa; padding: 15px; border: 1px solid #ddd; }
            .blueprint-section { margin-top: 40px; text-align: center; }
            .blueprint-views { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
            .blueprint-view { border: 2px solid #333; padding: 15px; background: white; }
            .view-title { font-weight: bold; margin-bottom: 10px; text-decoration: underline; }
            .dimension-note { font-size: 10px; color: #666; margin-top: 10px; }
            .page-break { page-break-before: always; }
            @media print {
              body { margin: 0; }
              .page-break { page-break-before: always; }
            }
          </style>
        </head>
        <body>
          <h1>Complete Shed Building Package</h1>
          
          <!-- Project Overview -->
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
            <div><strong>Total Estimated Cost:</strong> $${totalCost.toFixed(2)}</div>
          </div>

          <!-- Shopping List Section -->
          <h2>Shopping List - ${selectedStoreName}</h2>
      `);

      // Add lumber materials
      if (lumberMaterials.length > 0) {
        printWindow.document.write('<h3>Lumber & Wood Products</h3><table><tr><th>Item</th><th>Quantity</th><th>Unit</th><th>Unit Price</th><th>Total Price</th></tr>');
        lumberMaterials.forEach(material => {
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
        printWindow.document.write('</table>');
      }

      // Add hardware materials
      if (hardwareMaterials.length > 0) {
        printWindow.document.write('<h3>Hardware & Fasteners</h3><table><tr><th>Item</th><th>Quantity</th><th>Unit</th><th>Unit Price</th><th>Total Price</th></tr>');
        hardwareMaterials.forEach(material => {
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
        printWindow.document.write('</table>');
      }

      // Add roofing materials
      if (roofingMaterials.length > 0) {
        printWindow.document.write('<h3>Roofing Materials</h3><table><tr><th>Item</th><th>Quantity</th><th>Unit</th><th>Unit Price</th><th>Total Price</th></tr>');
        roofingMaterials.forEach(material => {
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
        printWindow.document.write('</table>');
      }

      // Add siding materials
      if (sidingMaterials.length > 0) {
        printWindow.document.write('<h3>Siding & Trim</h3><table><tr><th>Item</th><th>Quantity</th><th>Unit</th><th>Unit Price</th><th>Total Price</th></tr>');
        sidingMaterials.forEach(material => {
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
        printWindow.document.write('</table>');
      }

      // Add foundation materials
      if (foundationMaterials.length > 0) {
        printWindow.document.write('<h3>Foundation Materials</h3><table><tr><th>Item</th><th>Quantity</th><th>Unit</th><th>Unit Price</th><th>Total Price</th></tr>');
        foundationMaterials.forEach(material => {
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
        printWindow.document.write('</table>');
      }

      // Add total cost summary
      printWindow.document.write(`
        <div class="total">Total Material Cost: $${totalCost.toFixed(2)}</div>
        
        <!-- Blueprint Plans Section -->
        <div class="page-break">
          <h2>Construction Plans & Blueprints</h2>
          
          <div class="blueprint-section">
            <h3>Architectural Views</h3>
            <div class="blueprint-views">
              <div class="blueprint-view">
                <div class="view-title">Plan View (Top Down)</div>
                <div style="height: 200px; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; background: #f8f9fa;">
                  ${config.length}' × ${config.width}' Floor Plan<br/>
                  ${config.foundationType.charAt(0).toUpperCase() + config.foundationType.slice(1)} Foundation<br/>
                  Floor Plan Layout
                </div>
                <div class="dimension-note">Scale: 1/4" = 1' • Overall dimensions: ${config.length}' × ${config.width}'</div>
              </div>
              
              <div class="blueprint-view">
                <div class="view-title">Front Elevation</div>
                <div style="height: 200px; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; background: #f8f9fa;">
                  ${config.roofType.charAt(0).toUpperCase() + config.roofType.slice(1)} Roof<br/>
                  ${config.wallHeight}' Wall Height<br/>
                  ${config.sidingType.charAt(0).toUpperCase() + config.sidingType.slice(1)} Siding
                </div>
                <div class="dimension-note">Scale: 1/4" = 1' • Wall height: ${config.wallHeight}' • Width: ${config.width}'</div>
              </div>
              
              <div class="blueprint-view">
                <div class="view-title">Side Elevation</div>
                <div style="height: 200px; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; background: #f8f9fa;">
                  ${config.roofType.charAt(0).toUpperCase() + config.roofType.slice(1)} Roof Profile<br/>
                  ${config.wallHeight}' Wall Height<br/>
                  ${config.length}' Length
                </div>
                <div class="dimension-note">Scale: 1/4" = 1' • Length: ${config.length}' • Wall height: ${config.wallHeight}'</div>
              </div>
              
              <div class="blueprint-view">
                <div class="view-title">Cross Section</div>
                <div style="height: 200px; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; background: #f8f9fa;">
                  Interior View<br/>
                  Floor Joists • Wall Studs<br/>
                  Roof Structure
                </div>
                <div class="dimension-note">Scale: 1/4" = 1' • Interior height: ${config.wallHeight}' • Construction details</div>
              </div>
            </div>
          </div>
          
          <h3>Construction Specifications</h3>
          <table>
            <tr><th>Component</th><th>Specification</th><th>Notes</th></tr>
            <tr><td>Foundation</td><td>${config.foundationType.charAt(0).toUpperCase() + config.foundationType.slice(1)}</td><td>Level and square foundation required</td></tr>
            <tr><td>Floor Framing</td><td>2x8 joists @ 16" O.C.</td><td>Pressure treated lumber recommended</td></tr>
            <tr><td>Wall Framing</td><td>2x4 studs @ 16" O.C.</td><td>Include corner bracing as required</td></tr>
            <tr><td>Roof Framing</td><td>${config.roofType.charAt(0).toUpperCase() + config.roofType.slice(1)} style</td><td>2x6 rafters @ 24" O.C.</td></tr>
            <tr><td>Siding</td><td>${config.sidingType.charAt(0).toUpperCase() + config.sidingType.slice(1)}</td><td>Install per manufacturer specifications</td></tr>
            <tr><td>Roofing</td><td>Architectural shingles</td><td>Install proper underlayment</td></tr>
          </table>
          
          <div style="margin-top: 30px; font-size: 10px; color: #666; border-top: 1px solid #ccc; padding-top: 15px;">
            <p><strong>Important Notes:</strong></p>
            <ul>
              <li>Verify all local building codes and permit requirements before construction</li>
              <li>All lumber should be properly graded and suitable for structural use</li>
              <li>Foundation must be level, square, and properly sized</li>
              <li>Follow manufacturer installation instructions for all materials</li>
              <li>Pricing estimates are subject to market fluctuations and store availability</li>
            </ul>
          </div>
        </div>
      `);
      
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Shopping List - {config.length}×{config.width} {config.roofType.charAt(0).toUpperCase() + config.roofType.slice(1)} Roof Shed
          </DialogTitle>
        </DialogHeader>
        
        {/* Store Selection - Prominent at top */}
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-neutral-700">Select Your Store:</label>
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Choose a store" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home-depot">
                  Home Depot - {stores["home-depot"].town} 
                  {stores["home-depot"].distance ? ` (${stores["home-depot"].distance} mi)` : " (Not Available)"}
                </SelectItem>
                <SelectItem value="lowes">
                  Lowe's - {stores["lowes"].town} 
                  {stores["lowes"].distance ? ` (${stores["lowes"].distance} mi)` : " (Not Available)"}
                </SelectItem>
                <SelectItem value="menards">
                  Menards - {stores["menards"].town} 
                  {stores["menards"].distance ? ` (${stores["menards"].distance} mi)` : " (Not Available)"}
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-neutral-600">
              {stores[selectedStore as keyof typeof stores].distance ? (
                <>Pricing for {stores[selectedStore as keyof typeof stores].name} in {stores[selectedStore as keyof typeof stores].town} 
                ({stores[selectedStore as keyof typeof stores].distance} miles away)</>
              ) : (
                <>{stores[selectedStore as keyof typeof stores].name} not available in your area</>
              )}
            </div>
          </div>
        </div>
        
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleOrderFromStore} className="font-medium">
              <ExternalLink className="h-4 w-4 mr-2" />
              Order from {stores[selectedStore as keyof typeof stores].name}
            </Button>
            <Button onClick={handlePrintComplete} className="font-medium">
              <Printer className="h-4 w-4 mr-2" />
              Print Complete Package
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
