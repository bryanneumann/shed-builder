import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import AppHeader from "@/components/app-header";
import Shed3DViewer from "@/components/shed-3d-viewer";
import ConfigurationTabs from "@/components/configuration-tabs";
import CostSummary from "@/components/cost-summary";
import StoreAvailability from "@/components/store-availability";
import MaterialListModal from "@/components/material-list-modal";
import type { ShedConfig, ShedDesign } from "@shared/schema";

export default function ShedDesigner() {
  const { toast } = useToast();

  const [zipCode, setZipCode] = useState("78704");
  const [showMaterialList, setShowMaterialList] = useState(false);
  
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
      roofType: template.roofType as "gable" | "gambrel" | "lean-to",
      foundationType: template.foundationType as "concrete-slab" | "gravel-pad" | "concrete-piers",
      lumberGrade: template.lumberGrade as "pressure-treated" | "douglas-fir" | "southern-pine",
      joistSpacing: template.joistSpacing as 12 | 16 | 24,
      studSize: template.studSize as "2x4" | "2x6",
      wallHeight: template.wallHeight,
      doorCount: template.doorCount,
      windowCount: template.windowCount,
      sidingType: template.sidingType as "plywood" | "vinyl" | "wood" | "metal",
      roofingType: template.roofingType as "asphalt-shingles" | "metal" | "rubber",
    });
    
    toast({
      title: "Template Applied",
      description: `Loaded ${template.name} template configuration.`,
    });
  };

  const handleGenerateShoppingList = () => {
    setShowMaterialList(true);
  };

  const handlePrintPlans = () => {
    window.print();
    toast({
      title: "Printing Plans",
      description: "Opening print dialog for construction plans and material list.",
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
            
            {/* Cost Summary */}
            <CostSummary
              config={config}
              zipCode={zipCode}
              onZipCodeChange={setZipCode}
              onGenerateShoppingList={handleGenerateShoppingList}
              onPrintPlans={handlePrintPlans}
            />
            
            {/* Store Availability */}
            <StoreAvailability zipCode={zipCode} />
            
            {/* Build Guide */}
            <div className="bg-white rounded-lg shadow-material p-6">
              <h3 className="font-medium text-neutral-900 mb-4">Construction Guide</h3>
              <div className="space-y-3">
                {[
                  "Prepare foundation & level site",
                  "Install floor joists & decking", 
                  "Frame walls & install",
                  "Install roof trusses",
                  "Add sheathing & roofing",
                  "Install siding & trim"
                ].map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                      index === 0 
                        ? "bg-success text-white" 
                        : "bg-neutral-300 text-neutral-600"
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`text-sm ${index === 0 ? "text-neutral-900" : "text-neutral-600"}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="mt-4 w-full">
                📚 View Detailed Instructions
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Material List Modal */}
      <MaterialListModal
        isOpen={showMaterialList}
        onClose={() => setShowMaterialList(false)}
        config={config}
        zipCode={zipCode}
      />
    </div>
  );
}
