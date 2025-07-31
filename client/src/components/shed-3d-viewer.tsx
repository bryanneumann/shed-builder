import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { generatePlanViewSVG, generateFrontElevationSVG, generateSideElevationSVG, generateCrossSectionSVG } from "@/lib/blueprint-generator";
import { Expand } from "lucide-react";
import type { ShedConfig } from '@shared/schema';

interface Shed3DViewerProps {
  config: ShedConfig;
}

export default function Shed3DViewer({ config }: Shed3DViewerProps) {
  return (
    <div className="bg-white rounded-lg border-2 border-neutral-200 p-4 space-y-6">
      <h3 className="text-lg font-medium text-neutral-900 mb-4 text-center">Blueprint Plans with 2x4 Framing Layout</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Plan View */}
        <div className="border border-neutral-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-neutral-800">PLAN VIEW</h4>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Expand className="h-4 w-4 mr-1" />
                  Enlarge
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Plan View - {config.length}' × {config.width}' Shed</DialogTitle>
                </DialogHeader>
                <div 
                  className="w-full bg-white border rounded p-4"
                  dangerouslySetInnerHTML={{ __html: generatePlanViewSVG(config) }}
                />
              </DialogContent>
            </Dialog>
          </div>
          <div 
            className="w-full bg-white border rounded p-2 cursor-pointer hover:shadow-lg transition-shadow"
            dangerouslySetInnerHTML={{ __html: generatePlanViewSVG(config) }}
          />
        </div>

        {/* Front Elevation */}
        <div className="border border-neutral-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-neutral-800">FRONT ELEVATION</h4>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Expand className="h-4 w-4 mr-1" />
                  Enlarge
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Front Elevation - {config.length}' × {config.wallHeight}' Wall</DialogTitle>
                </DialogHeader>
                <div 
                  className="w-full bg-white border rounded p-4"
                  dangerouslySetInnerHTML={{ __html: generateFrontElevationSVG(config) }}
                />
              </DialogContent>
            </Dialog>
          </div>
          <div 
            className="w-full bg-white border rounded p-2 cursor-pointer hover:shadow-lg transition-shadow"
            dangerouslySetInnerHTML={{ __html: generateFrontElevationSVG(config) }}
          />
        </div>

        {/* Side Elevation */}
        <div className="border border-neutral-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-neutral-800">SIDE ELEVATION</h4>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Expand className="h-4 w-4 mr-1" />
                  Enlarge
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Side Elevation - {config.width}' × {config.wallHeight}' End Wall</DialogTitle>
                </DialogHeader>
                <div 
                  className="w-full bg-white border rounded p-4"
                  dangerouslySetInnerHTML={{ __html: generateSideElevationSVG(config) }}
                />
              </DialogContent>
            </Dialog>
          </div>
          <div 
            className="w-full bg-white border rounded p-2 cursor-pointer hover:shadow-lg transition-shadow"
            dangerouslySetInnerHTML={{ __html: generateSideElevationSVG(config) }}
          />
        </div>

        {/* Cross Section */}
        <div className="border border-neutral-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-neutral-800">CROSS SECTION</h4>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Expand className="h-4 w-4 mr-1" />
                  Enlarge
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Cross Section - {config.width}' Span Structure</DialogTitle>
                </DialogHeader>
                <div 
                  className="w-full bg-white border rounded p-4"
                  dangerouslySetInnerHTML={{ __html: generateCrossSectionSVG(config) }}
                />
              </DialogContent>
            </Dialog>
          </div>
          <div 
            className="w-full bg-white border rounded p-2 cursor-pointer hover:shadow-lg transition-shadow"
            dangerouslySetInnerHTML={{ __html: generateCrossSectionSVG(config) }}
          />
        </div>
      </div>
    </div>
  );
}