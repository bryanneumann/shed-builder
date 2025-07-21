import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ShedConfig } from "@shared/schema";
import { calculateFramingDetails } from "@/lib/shed-calculations";

interface ConfigurationTabsProps {
  config: ShedConfig;
  onConfigChange: (updates: Partial<ShedConfig>) => void;
}

export default function ConfigurationTabs({ config, onConfigChange }: ConfigurationTabsProps) {
  const framingDetails = calculateFramingDetails(config);

  return (
    <div className="bg-white rounded-lg shadow-material">
      <Tabs defaultValue="foundation" className="w-full">
        <div className="border-b border-neutral-200">
          <TabsList className="w-full justify-start px-6 bg-transparent">
            <TabsTrigger value="foundation" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Foundation & Framing
            </TabsTrigger>
            <TabsTrigger value="walls" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Walls & Siding
            </TabsTrigger>
            <TabsTrigger value="roofing" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Roofing
            </TabsTrigger>
            <TabsTrigger value="openings" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Doors & Windows
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="p-6">
          <TabsContent value="foundation" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-medium text-neutral-900 mb-3 block">Foundation Type</Label>
                <RadioGroup 
                  value={config.foundationType} 
                  onValueChange={(value) => onConfigChange({ foundationType: value as any })}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="concrete-slab" id="concrete-slab" />
                    <Label htmlFor="concrete-slab" className="text-sm">Concrete Slab (Recommended)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gravel-pad" id="gravel-pad" />
                    <Label htmlFor="gravel-pad" className="text-sm">Gravel Pad</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="concrete-piers" id="concrete-piers" />
                    <Label htmlFor="concrete-piers" className="text-sm">Concrete Piers</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label htmlFor="lumber-grade" className="text-base font-medium text-neutral-900 mb-3 block">Lumber Grade</Label>
                <Select value={config.lumberGrade} onValueChange={(value) => onConfigChange({ lumberGrade: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pressure-treated">Pressure Treated (Recommended)</SelectItem>
                    <SelectItem value="douglas-fir">Douglas Fir</SelectItem>
                    <SelectItem value="southern-pine">Southern Pine</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-neutral-500 mt-1">Pressure treated recommended for sill plates and floor joists</p>
              </div>
              
              <div>
                <Label htmlFor="joist-spacing" className="text-base font-medium text-neutral-900 mb-3 block">Joist Spacing</Label>
                <Select 
                  value={config.joistSpacing.toString()} 
                  onValueChange={(value) => onConfigChange({ joistSpacing: parseInt(value) as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16">16" on center (Standard)</SelectItem>
                    <SelectItem value="12">12" on center (Heavy duty)</SelectItem>
                    <SelectItem value="24">24" on center (Light duty)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="stud-size" className="text-base font-medium text-neutral-900 mb-3 block">Wall Stud Size</Label>
                <Select value={config.studSize} onValueChange={(value) => onConfigChange({ studSize: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2x4">2x4" (Standard)</SelectItem>
                    <SelectItem value="2x6">2x6" (Insulated)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Auto-calculated framing info */}
            <div className="mt-6 p-4 bg-neutral-100 rounded-lg">
              <h4 className="font-medium text-neutral-900 mb-2">Auto-Calculated Framing</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-neutral-600">Floor Joists:</span>
                  <span className="font-medium ml-1">{framingDetails.floorJoists}</span>
                </div>
                <div>
                  <span className="text-neutral-600">Wall Studs:</span>
                  <span className="font-medium ml-1">{framingDetails.wallStuds}</span>
                </div>
                <div>
                  <span className="text-neutral-600">Top Plates:</span>
                  <span className="font-medium ml-1">{framingDetails.topPlates}</span>
                </div>
                <div>
                  <span className="text-neutral-600">Joist Hangers:</span>
                  <span className="font-medium ml-1">{framingDetails.joistHangers}</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="walls" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="siding-type" className="text-base font-medium text-neutral-900 mb-3 block">Siding Type</Label>
                <Select value={config.sidingType} onValueChange={(value) => onConfigChange({ sidingType: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plywood">T1-11 Plywood Siding</SelectItem>
                    <SelectItem value="vinyl">Vinyl Siding</SelectItem>
                    <SelectItem value="wood">Wood Lap Siding</SelectItem>
                    <SelectItem value="metal">Metal Siding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="wall-height" className="text-base font-medium text-neutral-900 mb-3 block">Wall Height (feet)</Label>
                <Input
                  id="wall-height"
                  type="number"
                  min="6"
                  max="12"
                  step="0.5"
                  value={config.wallHeight}
                  onChange={(e) => onConfigChange({ wallHeight: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="roofing" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-medium text-neutral-900 mb-3 block">Roof Type</Label>
                <RadioGroup 
                  value={config.roofType} 
                  onValueChange={(value) => onConfigChange({ roofType: value as any })}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gable" id="gable" />
                    <Label htmlFor="gable" className="text-sm">Gable Roof (Standard)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gambrel" id="gambrel" />
                    <Label htmlFor="gambrel" className="text-sm">Gambrel Roof (Barn Style)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hip" id="hip" />
                    <Label htmlFor="hip" className="text-sm">Hip Roof (Four-Sided)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="shed" id="shed" />
                    <Label htmlFor="shed" className="text-sm">Shed Roof (Modern Single Slope)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lean-to" id="lean-to" />
                    <Label htmlFor="lean-to" className="text-sm">Lean-to Roof (Attached Single Slope)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="saltbox" id="saltbox" />
                    <Label htmlFor="saltbox" className="text-sm">Saltbox Roof (Asymmetrical)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label htmlFor="roofing-type" className="text-base font-medium text-neutral-900 mb-3 block">Roofing Material</Label>
                <Select value={config.roofingType} onValueChange={(value) => onConfigChange({ roofingType: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asphalt-shingles">Asphalt Shingles</SelectItem>
                    <SelectItem value="metal">Metal Roofing</SelectItem>
                    <SelectItem value="rubber">Rubber Membrane</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="openings" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="door-count" className="text-base font-medium text-neutral-900 mb-3 block">Number of Doors</Label>
                <Select 
                  value={config.doorCount.toString()} 
                  onValueChange={(value) => onConfigChange({ doorCount: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No Doors</SelectItem>
                    <SelectItem value="1">1 Door</SelectItem>
                    <SelectItem value="2">2 Doors</SelectItem>
                    <SelectItem value="3">3 Doors</SelectItem>
                    <SelectItem value="4">4 Doors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="window-count" className="text-base font-medium text-neutral-900 mb-3 block">Number of Windows</Label>
                <Select 
                  value={config.windowCount.toString()} 
                  onValueChange={(value) => onConfigChange({ windowCount: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No Windows</SelectItem>
                    <SelectItem value="1">1 Window</SelectItem>
                    <SelectItem value="2">2 Windows</SelectItem>
                    <SelectItem value="3">3 Windows</SelectItem>
                    <SelectItem value="4">4 Windows</SelectItem>
                    <SelectItem value="5">5 Windows</SelectItem>
                    <SelectItem value="6">6 Windows</SelectItem>
                    <SelectItem value="7">7 Windows</SelectItem>
                    <SelectItem value="8">8 Windows</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
