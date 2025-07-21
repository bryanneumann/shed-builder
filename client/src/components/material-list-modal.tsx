import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Printer, Download, Package, Wrench } from "lucide-react";
import type { ShedConfig } from "@shared/schema";
import { calculateMaterials } from "@/lib/shed-calculations";

interface MaterialListModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ShedConfig;
  zipCode: string;
}

export default function MaterialListModal({ isOpen, onClose, config, zipCode }: MaterialListModalProps) {
  const materials = calculateMaterials(config);
  
  // Group materials by category
  const lumberMaterials = materials.filter(m => m.category === "lumber");
  const hardwareMaterials = materials.filter(m => m.category === "hardware");
  const roofingMaterials = materials.filter(m => m.category === "roofing");
  const sidingMaterials = materials.filter(m => m.category === "siding");
  const foundationMaterials = materials.filter(m => m.category === "foundation");

  const totalCost = materials.reduce((sum, material) => sum + material.estimatedPrice, 0);

  const handleOrderFromHomeDepot = () => {
    // Open Home Depot website or API integration
    window.open("https://www.homedepot.com", "_blank");
  };

  const handlePrintList = () => {
    window.print();
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={handleOrderFromHomeDepot} className="font-medium">
              <ExternalLink className="h-4 w-4 mr-2" />
              Order from Home Depot
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
