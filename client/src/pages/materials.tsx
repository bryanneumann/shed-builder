import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import AppHeader from "@/components/app-header";
import { Search, MapPin } from "lucide-react";

export default function Materials() {
  const [zipCode, setZipCode] = useState("78704");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");

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

  // Sample material data - in a real app this would come from the database
  const materials = [
    {
      name: "2x4x8 Pressure Treated Lumber",
      category: "lumber",
      homeDepotPrice: 4.98,
      lowesPrice: 5.12,
      menarisPrice: 4.89,
      unit: "each",
      inStock: true,
    },
    {
      name: "2x6x8 Pressure Treated Lumber", 
      category: "lumber",
      homeDepotPrice: 8.47,
      lowesPrice: 8.29,
      menarisPrice: 8.15,
      unit: "each",
      inStock: true,
    },
    {
      name: "3/4\" Plywood Sheathing 4x8",
      category: "sheathing",
      homeDepotPrice: 42.98,
      lowesPrice: 44.25,
      menarisPrice: 41.50,
      unit: "sheet",
      inStock: true,
    },
    {
      name: "Asphalt Shingles - 3-Tab",
      category: "roofing",
      homeDepotPrice: 31.98,
      lowesPrice: 33.15,
      menarisPrice: 29.99,
      unit: "bundle",
      inStock: false,
    },
    {
      name: "Joist Hangers 2x8",
      category: "hardware",
      homeDepotPrice: 1.78,
      lowesPrice: 1.89,
      menarisPrice: 1.65,
      unit: "each",
      inStock: true,
    },
    {
      name: "Concrete Mix 80lb",
      category: "foundation",
      homeDepotPrice: 4.48,
      lowesPrice: 4.25,
      menarisPrice: 4.35,
      unit: "bag",
      inStock: true,
    },
  ];

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === "all" || material.category === category;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'lumber': return 'bg-amber-100 text-amber-800';
      case 'sheathing': return 'bg-blue-100 text-blue-800';
      case 'roofing': return 'bg-red-100 text-red-800';
      case 'hardware': return 'bg-gray-100 text-gray-800';
      case 'foundation': return 'bg-stone-100 text-stone-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getLowestPrice = (material: any) => {
    return Math.min(material.homeDepotPrice, material.lowesPrice, material.menarisPrice);
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Materials & Pricing</h1>
          <p className="text-neutral-600">Compare prices from Home Depot, Lowe's, and Menards</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-material p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search" className="block text-sm font-medium text-neutral-700 mb-2">
                Search Materials
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search for lumber, hardware, etc..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-2">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="lumber">Lumber</SelectItem>
                  <SelectItem value="sheathing">Sheathing</SelectItem>
                  <SelectItem value="roofing">Roofing</SelectItem>
                  <SelectItem value="hardware">Hardware</SelectItem>
                  <SelectItem value="foundation">Foundation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="zipcode" className="block text-sm font-medium text-neutral-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Zip Code
              </Label>
              <Input
                id="zipcode"
                type="text"
                placeholder="78704"
                value={zipCode}
                onChange={(e) => handleZipCodeChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMaterials.map((material, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{material.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className={getCategoryColor(material.category)}>
                      {material.category}
                    </Badge>
                    {!material.inStock && (
                      <Badge variant="destructive">Out of Stock</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-orange-600">Home Depot</div>
                      <div className="text-lg font-bold">${material.homeDepotPrice}</div>
                      <div className="text-xs text-neutral-500">per {material.unit}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-600">Lowe's</div>
                      <div className="text-lg font-bold">${material.lowesPrice}</div>
                      <div className="text-xs text-neutral-500">per {material.unit}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-red-600">Menards</div>
                      <div className="text-lg font-bold">${material.menarisPrice}</div>
                      <div className="text-xs text-neutral-500">per {material.unit}</div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="text-center">
                      <span className="text-sm font-medium text-green-600">
                        Best Price: ${getLowestPrice(material)} per {material.unit}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-500">No materials found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}