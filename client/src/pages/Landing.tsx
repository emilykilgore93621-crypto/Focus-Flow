import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Zap, Layout, GraduationCap, Briefcase } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    window.location.href = "/"; // Redirect to dashboard if logged in
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="px-6 py-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto">
        <div className="font-display font-bold text-2xl text-primary flex items-center gap-2">
          <Zap className="h-6 w-6" /> FocusForward
        </div>
        <Link href="/api/login">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            Sign In
          </Button>
        </Link>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Designed for ADHD Minds
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight text-foreground">
              Master Your Focus, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                Own Your Future
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              Transitioning to college or the workforce? We provide the structure, tools, and resources you need to stay organized and succeed—without the overwhelm.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/api/login">
                <Button size="lg" className="text-lg px-8 py-6 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:translate-y-[-2px] transition-all">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <div className="flex gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> Free Forever
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> No Credit Card
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            {/* Using Unsplash for hero image - abstract calming productivity */}
            {/* Productivity desk setup minimal clean */}
            <img 
              src="https://pixabay.com/get/gfcbb54b0a55edbc6401c8cf33db7faa27ce89e2a19b9ea93e569f37c46a56e64449092f5c2c3cf206522787dfa7ebae81b6522c356cee6f9e6992d95a303a805_1280.jpg"
              alt="Calm workspace" 
              className="relative rounded-3xl shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Layout} 
            title="Visual Organization" 
            desc="Kanban-style boards and clear lists help you visualize tasks without getting overwhelmed by details."
          />
          <FeatureCard 
            icon={GraduationCap} 
            title="College Ready" 
            desc="Study tips, application trackers, and dorm checklists designed specifically for neurodivergent students."
          />
          <FeatureCard 
            icon={Briefcase} 
            title="Career Prep" 
            desc="Ace your interviews with our question bank and organize your job search effectively."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
