import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AppHeader from "@/components/app-header";
import { useToast } from "@/hooks/use-toast";
import type { ShedDesign } from "@shared/schema";

export default function Templates() {
  const { toast } = useToast();

  const { data: templates = [], isLoading } = useQuery<ShedDesign[]>({
    queryKey: ["/api/templates"],
  });

  const handleUseTemplate = (template: ShedDesign) => {
    // Navigate to designer with template
    const params = new URLSearchParams({
      template: template.id.toString()
    });
    window.location.href = `/?${params.toString()}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'storage': return 'bg-green-100 text-green-800';
      case 'workshop': return 'bg-purple-100 text-purple-800';
      case 'garage': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Shed Templates</h1>
          <p className="text-neutral-600">Choose from pre-designed shed templates or start with a basic configuration</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-white rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {templates.map((template: ShedDesign) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge className={getCategoryColor(template.templateCategory || 'basic')}>
                      {template.templateCategory || 'basic'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-neutral-600">Size:</span>
                        <span className="font-medium ml-1">{template.length}' × {template.width}'</span>
                      </div>
                      <div>
                        <span className="text-neutral-600">Height:</span>
                        <span className="font-medium ml-1">{template.height}'</span>
                      </div>
                      <div>
                        <span className="text-neutral-600">Roof:</span>
                        <span className="font-medium ml-1 capitalize">{template.roofType}</span>
                      </div>
                      <div>
                        <span className="text-neutral-600">Foundation:</span>
                        <span className="font-medium ml-1 capitalize">{template.foundationType.replace('-', ' ')}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm text-neutral-600">
                      <span>{template.doorCount} Door{template.doorCount !== 1 ? 's' : ''}</span>
                      <span>{template.windowCount} Window{template.windowCount !== 1 ? 's' : ''}</span>
                    </div>

                    <div className="pt-2">
                      <Button 
                        onClick={() => handleUseTemplate(template)}
                        className="w-full"
                        size="sm"
                      >
                        Use This Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Need a Custom Design?</h2>
          <p className="text-neutral-600 mb-6">Start from scratch with our shed designer tool</p>
          <Button onClick={() => window.location.href = '/'} size="lg">
            Open Shed Designer
          </Button>
        </div>
      </div>
    </div>
  );
}