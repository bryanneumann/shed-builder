import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

interface StoreAvailabilityProps {
  zipCode: string;
}

export default function StoreAvailability({ zipCode }: StoreAvailabilityProps) {
  // Store location data based on zip code
  const getStoreData = (zipCode: string) => {
    const storesByZip: Record<string, any[]> = {
      "78704": [ // Austin, TX
        {
          name: "Home Depot",
          logo: "HD",
          town: "South Austin",
          distance: 3.2,
          availability: 94,
          totalCost: 1698.23,
          color: "bg-orange-500",
        },
        {
          name: "Lowe's",
          logo: "L",
          town: "Sunset Valley",
          distance: 4.7,
          availability: 87,
          totalCost: 1612.89,
          color: "bg-blue-600",
        },
        {
          name: "Menards",
          logo: "M", 
          town: "Cedar Park",
          distance: 18.3,
          availability: 91,
          totalCost: 1567.45,
          color: "bg-yellow-600",
        },
      ],
      "60601": [ // Chicago, IL
        {
          name: "Home Depot",
          logo: "HD",
          town: "Downtown Chicago",
          distance: 2.1,
          availability: 96,
          totalCost: 1698.23,
          color: "bg-orange-500",
        },
        {
          name: "Lowe's",
          logo: "L",
          town: "Lincoln Park",
          distance: 3.8,
          availability: 89,
          totalCost: 1612.89,
          color: "bg-blue-600",
        },
        {
          name: "Menards",
          logo: "M", 
          town: "Schaumburg",
          distance: 28.4,
          availability: 93,
          totalCost: 1567.45,
          color: "bg-yellow-600",
        },
      ],
      "30309": [ // Atlanta, GA
        {
          name: "Home Depot",
          logo: "HD",
          town: "Midtown Atlanta",
          distance: 1.9,
          availability: 92,
          totalCost: 1698.23,
          color: "bg-orange-500",
        },
        {
          name: "Lowe's",
          logo: "L",
          town: "Buckhead",
          distance: 4.2,
          availability: 88,
          totalCost: 1612.89,
          color: "bg-blue-600",
        },
      ]
    };

    // Default fallback for other zip codes
    const defaultStores = [
      {
        name: "Home Depot",
        logo: "HD",
        town: "Local Store",
        distance: 5.2,
        availability: 94,
        totalCost: 1698.23,
        color: "bg-orange-500",
      },
      {
        name: "Lowe's",
        logo: "L",
        town: "Local Store",
        distance: 6.8,
        availability: 87,
        totalCost: 1612.89,
        color: "bg-blue-600",
      },
      {
        name: "Menards",
        logo: "M", 
        town: "Regional Store",
        distance: 15.4,
        availability: 91,
        totalCost: 1567.45,
        color: "bg-yellow-600",
      },
    ];

    return storesByZip[zipCode] || defaultStores;
  };

  const stores = getStoreData(zipCode);

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
                <div className="text-xs text-neutral-500">{store.town} • {store.distance} miles</div>
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
