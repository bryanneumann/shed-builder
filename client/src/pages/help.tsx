import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/app-header";
import { 
  HelpCircle, 
  BookOpen, 
  Video, 
  MessageSquare, 
  Download,
  Ruler,
  Hammer,
  Home,
  AlertCircle
} from "lucide-react";

export default function Help() {
  const helpCategories = [
    {
      title: "Getting Started",
      icon: <BookOpen className="h-6 w-6" />,
      articles: [
        { title: "How to Design Your First Shed", difficulty: "Beginner", time: "5 min" },
        { title: "Understanding Foundation Types", difficulty: "Beginner", time: "3 min" },
        { title: "Choosing the Right Size", difficulty: "Beginner", time: "4 min" },
        { title: "Material Selection Guide", difficulty: "Intermediate", time: "8 min" },
      ]
    },
    {
      title: "Construction Guides",
      icon: <Hammer className="h-6 w-6" />,
      articles: [
        { title: "Foundation Preparation", difficulty: "Intermediate", time: "15 min" },
        { title: "Framing Your Shed", difficulty: "Advanced", time: "20 min" },
        { title: "Installing Siding", difficulty: "Intermediate", time: "12 min" },
        { title: "Roof Installation", difficulty: "Advanced", time: "25 min" },
      ]
    },
    {
      title: "Using the Designer",
      icon: <Ruler className="h-6 w-6" />,
      articles: [
        { title: "Blueprint View Explained", difficulty: "Beginner", time: "3 min" },
        { title: "Configuration Tabs Guide", difficulty: "Beginner", time: "5 min" },
        { title: "Material Cost Calculator", difficulty: "Beginner", time: "4 min" },
        { title: "Sharing Your Design", difficulty: "Beginner", time: "2 min" },
      ]
    },
    {
      title: "Video Tutorials",
      icon: <Video className="h-6 w-6" />,
      articles: [
        { title: "Complete Shed Build (Part 1: Foundation)", difficulty: "All Levels", time: "18 min" },
        { title: "Complete Shed Build (Part 2: Framing)", difficulty: "All Levels", time: "22 min" },
        { title: "Complete Shed Build (Part 3: Roofing)", difficulty: "All Levels", time: "16 min" },
        { title: "Tool Requirements and Safety", difficulty: "All Levels", time: "12 min" },
      ]
    }
  ];

  const quickTips = [
    {
      icon: <Home className="h-5 w-5 text-blue-500" />,
      title: "Check Local Building Codes",
      description: "Many areas require permits for sheds over 120 sq ft or 10 feet tall."
    },
    {
      icon: <Ruler className="h-5 w-5 text-green-500" />,
      title: "Measure Twice, Cut Once",
      description: "Always double-check measurements before making cuts or purchases."
    },
    {
      icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
      title: "Foundation is Critical",
      description: "A level, solid foundation prevents most structural problems later."
    },
    {
      icon: <Download className="h-5 w-5 text-purple-500" />,
      title: "Print Your Plans",
      description: "Having physical copies on-site helps prevent mistakes during construction."
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      case 'All Levels': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Help & Support</h1>
          <p className="text-neutral-600">Everything you need to design and build your perfect shed</p>
        </div>

        {/* Quick Tips */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Quick Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickTips.map((tip, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {tip.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-900 text-sm">{tip.title}</h3>
                      <p className="text-xs text-neutral-600 mt-1">{tip.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {helpCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="text-primary">
                    {category.icon}
                  </div>
                  <CardTitle>{category.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.articles.map((article, articleIndex) => (
                    <div 
                      key={articleIndex} 
                      className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 cursor-pointer transition-colors"
                    >
                      <div>
                        <div className="font-medium text-neutral-900 text-sm">{article.title}</div>
                        <div className="text-xs text-neutral-600">{article.time} read</div>
                      </div>
                      <Badge className={getDifficultyColor(article.difficulty)}>
                        {article.difficulty}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Still Need Help?</h2>
              <p className="text-neutral-600 mb-6">
                Our construction experts are here to help with your shed building questions
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Live Chat
                </Button>
                <Button>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}