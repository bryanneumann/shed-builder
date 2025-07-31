import { Button } from "@/components/ui/button";
import { Home, Share2 } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function AppHeader() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white shadow-material sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Home className="text-primary text-2xl cursor-pointer" />
            </Link>
            <Link href="/">
              <h1 className="text-xl font-bold text-neutral-900 cursor-pointer">ShedBuilder Pro</h1>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className={`transition-colors pb-1 ${
                isActive("/") 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-neutral-700 hover:text-primary"
              }`}
            >
              Designer
            </Link>
            <Link 
              href="/templates" 
              className={`transition-colors pb-1 ${
                isActive("/templates") 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-neutral-700 hover:text-primary"
              }`}
            >
              Templates
            </Link>

          </nav>
          
          <div className="flex items-center space-x-4">

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
