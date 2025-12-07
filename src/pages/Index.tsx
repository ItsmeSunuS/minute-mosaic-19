import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight, BarChart3, Sparkles, Shield } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-primary shadow-lg shadow-primary/20">
              <Clock className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Track Your Time with
            <span className="text-primary block mt-2">AI-Powered Insights</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Log your daily activities, visualize how you spend your 1440 minutes, 
            and get personalized insights to optimize your productivity and well-being.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="gap-2 px-8">
              <Link to="/auth">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
          <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
            <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Visual Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Beautiful charts showing how you spend your time across different categories.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
            <div className="p-3 rounded-lg bg-accent/10 w-fit mb-4">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">AI Insights</h3>
            <p className="text-sm text-muted-foreground">
              Get personalized recommendations based on your daily activity patterns.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
            <div className="p-3 rounded-lg bg-success/10 w-fit mb-4">
              <Shield className="h-6 w-6 text-success" />
            </div>
            <h3 className="font-semibold mb-2">1440 Minute Limit</h3>
            <p className="text-sm text-muted-foreground">
              Never exceed your daily limit with automatic validation and tracking.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-20">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          TimeTrack AI — Make every minute count
        </div>
      </footer>
    </div>
  );
};

export default Index;
