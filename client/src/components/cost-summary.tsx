import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { MapPin, ShoppingCart, Printer } from "lucide-react";
import type { ShedConfig } from "@shared/schema";
import { calculateMaterials } from "@/lib/shed-calculations";

interface CostSummaryProps {
  config: ShedConfig;
  zipCode: string;
  onZipCodeChange: (zipCode: string) => void;
  onGenerateShoppingList: () => void;
  onPrintPlans: () => void;
}

export default function CostSummary({ 
  config, 
  zipCode, 
  onZipCodeChange, 
  onGenerateShoppingList,
  onPrintPlans 
}: CostSummaryProps) {
  const materials = calculateMaterials(config);
  
  // Group materials by category
  const categorizedMaterials = materials.reduce((acc, material) => {
    if (!acc[material.category]) {
      acc[material.category] = [];
    }
    acc[material.category].push(material);
    return acc;
  }, {} as Record<string, typeof materials>);

  // Calculate category totals
  const categoryTotals = Object.entries(categorizedMaterials).map(([category, items]) => ({
    category,
    total: items.reduce((sum, item) => sum + item.estimatedPrice, 0),
  }));

  const totalCost = categoryTotals.reduce((sum, cat) => sum + cat.total, 0);

  const categoryLabels: Record<string, string> = {
    lumber: "Lumber & Framing",
    hardware: "Hardware & Fasteners",
    roofing: "Roofing Materials",
    siding: "Siding & Trim",
    foundation: "Foundation",
  };

  return (
    <div className="bg-white rounded-lg shadow-material p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-neutral-900">Cost Estimate</h3>
        <div className="flex items-center text-sm text-neutral-600">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{zipCode}</span>
          <Button 
            variant="link" 
            size="sm" 
            className="h-auto p-0 ml-2 text-primary"
            onClick={() => {
              const newZip = prompt("Enter your ZIP code:", zipCode);
              if (newZip) onZipCodeChange(newZip);
            }}
          >
            Change
          </Button>
        </div>
      </div>
      
      <div className="space-y-3">
        {categoryTotals.map(({ category, total }) => (
          <div key={category} className="flex justify-between items-center">
            <span className="text-neutral-600">{categoryLabels[category] || category}</span>
            <span className="font-medium">${total.toFixed(2)}</span>
          </div>
        ))}
        
        <hr className="my-3" />
        
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total Materials</span>
          <span className="text-primary">${totalCost.toFixed(2)}</span>
        </div>
        
        <div className="text-xs text-neutral-500">
          * Estimated prices from Home Depot & Lowe's in your area. Prices updated daily.
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <Button 
          className="w-full" 
          onClick={onGenerateShoppingList}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Generate Shopping List
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onPrintPlans}
        >
          <Printer className="h-4 w-4 mr-2" />
          Print Plans & List
        </Button>
      </div>
    </div>
  );
}
