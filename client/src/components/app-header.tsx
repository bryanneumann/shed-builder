import { Button } from "@/components/ui/button";
import { Home, Save, Share2 } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="bg-white shadow-material sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Home className="text-primary text-2xl" />
            <h1 className="text-xl font-bold text-neutral-900">ShedBuilder Pro</h1>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-primary border-b-2 border-primary pb-1">Designer</a>
            <a href="#" className="text-neutral-700 hover:text-primary transition-colors">Templates</a>
            <a href="#" className="text-neutral-700 hover:text-primary transition-colors">Materials</a>
            <a href="#" className="text-neutral-700 hover:text-primary transition-colors">Help</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Save className="h-4 w-4" />
            </Button>
            <Button size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
