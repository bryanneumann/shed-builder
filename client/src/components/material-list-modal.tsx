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
  const materials = calculateMaterials(config);
  
  // Group materials by category
  const lumberMaterials = materials.filter(m => m.category === "lumber");
  const hardwareMaterials = materials.filter(m => m.category === "hardware");
  const roofingMaterials = materials.filter(m => m.category === "roofing");
  const sidingMaterials = materials.filter(m => m.category === "siding");
  const foundationMaterials = materials.filter(m => m.category === "foundation");

  const totalCost = materials.reduce((sum, material) => sum + material.estimatedPrice, 0);

  const stores = {
    "home-depot": { name: "Home Depot", url: "https://www.homedepot.com" },
    "lowes": { name: "Lowe's", url: "https://www.lowes.com" },
    "menards": { name: "Menards", url: "https://www.menards.com" }
  };

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

  const handleExportPDF = () => {
    // PDF export functionality would go here
    console.log("Export to PDF");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Shopping List - {config.length}×{config.width} {config.roofType.charAt(0).toUpperCase() + config.roofType.slice(1)} Roof Shed
          </DialogTitle>
        </DialogHeader>
        
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
                  <MaterialItem key={index} material={material} />
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
                  <MaterialItem key={index} material={material} />
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
                  <MaterialItem key={index} material={material} />
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
                  <MaterialItem key={index} material={material} />
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
                  <MaterialItem key={index} material={material} />
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
          
          <div className="space-y-4">
            {/* Store Selection */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Select Store:</label>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Choose a store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home-depot">Home Depot</SelectItem>
                  <SelectItem value="lowes">Lowe's</SelectItem>
                  <SelectItem value="menards">Menards</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button onClick={handleOrderFromStore} className="font-medium">
                <ExternalLink className="h-4 w-4 mr-2" />
                Order from {stores[selectedStore as keyof typeof stores].name}
              </Button>
              <Button variant="outline" onClick={handlePrintList}>
                <Printer className="h-4 w-4 mr-2" />
                Print Shopping List
              </Button>
              <Button variant="outline" onClick={handleExportPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export to PDF
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MaterialItem({ material }: { material: any }) {
  // Mock stock status - in real app this would come from API
  const inStock = Math.random() > 0.2; // 80% chance of being in stock
  const stockCount = Math.floor(Math.random() * 50) + 5;
  const isLimitedStock = stockCount < 10;

  return (
    <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
      <div className="flex-1">
        <div className="font-medium text-sm">{material.name}</div>
        <div className="text-xs text-neutral-500">SKU: HD{Math.floor(Math.random() * 900000) + 100000} • Home Depot</div>
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
