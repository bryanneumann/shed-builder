import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

interface StoreAvailabilityProps {
  zipCode: string;
}

export default function StoreAvailability({ zipCode }: StoreAvailabilityProps) {
  // Mock store data - in real app this would come from an API
  const stores = [
    {
      name: "Home Depot",
      logo: "HD",
      distance: 2.1,
      availability: 94,
      totalCost: 1698.23,
      color: "bg-orange-500",
    },
    {
      name: "Lowe's",
      logo: "L",
      distance: 3.8,
      availability: 87,
      totalCost: 1742.89,
      color: "bg-blue-600",
    },
    {
      name: "Menards",
      logo: "M", 
      distance: 5.2,
      availability: 91,
      totalCost: 1689.45,
      color: "bg-yellow-600",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-material p-6">
      <h3 className="font-medium text-neutral-900 mb-4">Store Availability</h3>
      <div className="space-y-3">
        {stores.map((store) => (
          <div key={store.name} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
            <div className="flex items-center">
              <div className={`w-8 h-8 ${store.color} rounded-full flex items-center justify-center text-white font-bold text-sm mr-3`}>
                {store.logo}
              </div>
              <div>
                <div className="font-medium text-sm">{store.name}</div>
                <div className="text-xs text-neutral-500">{store.distance} miles away</div>
              </div>
            </div>
            <div className="text-right">
              <Badge 
                variant={store.availability >= 90 ? "default" : "secondary"}
                className={store.availability >= 90 ? "bg-success text-white" : "bg-warning text-white"}
              >
                {store.availability}% In Stock
              </Badge>
              <div className="text-xs text-neutral-500 mt-1">${store.totalCost.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
