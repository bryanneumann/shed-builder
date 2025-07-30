import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import AppHeader from "@/components/app-header";
import Shed3DViewer from "@/components/shed-3d-viewer";
import ConfigurationTabs from "@/components/configuration-tabs";
import CostSummary from "@/components/cost-summary";
import StoreAvailability from "@/components/store-availability";
import MaterialListModal from "@/components/material-list-modal";
import { calculateMaterials } from "@/lib/shed-calculations";
import { generatePlanViewSVG, generateFrontElevationSVG, generateSideElevationSVG, generateCrossSectionSVG } from "@/lib/blueprint-generator";
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
      roofType: template.roofType as "gable" | "gambrel" | "lean-to" | "hip" | "shed" | "saltbox",
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
              <div><strong>Pricing Source:</strong> Home Depot & Lowe's Average (${new Date().toLocaleDateString()})</div>
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
              <p><em>Pricing Source: Estimates based on Home Depot and Lowe's average retail prices for ZIP code ${zipCode} as of ${new Date().toLocaleDateString()}. Actual prices may vary by location, retailer, and current market conditions. Always verify current pricing before purchase.</em></p>
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
