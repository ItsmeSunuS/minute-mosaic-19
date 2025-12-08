import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Plus, Sparkles, Calendar, TrendingUp, Zap } from 'lucide-react';

interface EmptyStateProps {
  onAddActivity: () => void;
}

export function EmptyState({ onAddActivity }: EmptyStateProps) {
  return (
    <div className="animate-fade-in">
      <Card className="border-0 shadow-card overflow-hidden">
        <CardContent className="p-0">
          {/* Colorful Header Section */}
          <div className="gradient-primary p-8 sm:p-12 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
            <div className="absolute bottom-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            
            {/* Floating Icons */}
            <div className="absolute top-6 right-8 opacity-30 animate-bounce-soft">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <div className="absolute bottom-8 left-8 opacity-30 animate-bounce-soft" style={{ animationDelay: '0.5s' }}>
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            
            <div className="relative flex flex-col items-center text-center">
              {/* Main Icon */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-150" />
                <div className="relative p-5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                  <Clock className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
                </div>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-3">
                No Activities Logged Yet
              </h2>
              <p className="text-white/80 max-w-md text-sm sm:text-base">
                Start your productivity journey today! Track how you spend your time and unlock powerful insights.
              </p>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="p-6 sm:p-8 bg-card">
            {/* Stats Preview */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
              <div className="text-center p-3 sm:p-4 rounded-xl bg-primary/10 border border-primary/20">
                <div className="text-xl sm:text-2xl font-bold text-primary font-display">1440</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">Minutes Available</div>
              </div>
              <div className="text-center p-3 sm:p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                <div className="text-xl sm:text-2xl font-bold text-secondary font-display">24</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">Hours to Track</div>
              </div>
              <div className="text-center p-3 sm:p-4 rounded-xl bg-accent/10 border border-accent/20">
                <div className="text-xl sm:text-2xl font-bold text-accent font-display">∞</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">Possibilities</div>
              </div>
            </div>
            
            {/* CTA Button */}
            <Button 
              onClick={onAddActivity} 
              size="lg" 
              className="w-full gradient-primary hover:opacity-90 transition-all duration-300 gap-2 text-base sm:text-lg py-5 sm:py-6 rounded-xl shadow-glow hover:shadow-glow-lg font-display"
            >
              <Plus className="h-5 w-5" />
              Start Logging Your Day
            </Button>
            
            {/* Features Hint */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">AI Insights</div>
                  <div className="text-xs text-muted-foreground">Get smart recommendations</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Zap className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">Quick Entry</div>
                  <div className="text-xs text-muted-foreground">Log activities in seconds</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
