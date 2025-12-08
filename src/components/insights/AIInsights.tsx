import { useState } from 'react';
import { Activity, Category } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateInsights } from '@/utils/aiInsights';
import { Sparkles, Loader2, Brain, Heart, Target, Scale, Lightbulb, Wand2 } from 'lucide-react';

interface AIInsightsProps {
  activities: Activity[];
  categories: Category[];
}

const iconMap: Record<string, any> = {
  productivity: Target,
  health: Heart,
  wellness: Brain,
  balance: Scale,
  tip: Lightbulb,
};

const colorMap: Record<string, string> = {
  productivity: 'from-primary/20 to-primary/5 border-primary/20',
  health: 'from-success/20 to-success/5 border-success/20',
  wellness: 'from-secondary/20 to-secondary/5 border-secondary/20',
  balance: 'from-accent/20 to-accent/5 border-accent/20',
  tip: 'from-warning/20 to-warning/5 border-warning/20',
};

const iconColorMap: Record<string, string> = {
  productivity: 'text-primary bg-primary/10',
  health: 'text-success bg-success/10',
  wellness: 'text-secondary bg-secondary/10',
  balance: 'text-accent bg-accent/10',
  tip: 'text-warning bg-warning/10',
};

export function AIInsights({ activities, categories }: AIInsightsProps) {
  const [insights, setInsights] = useState<ReturnType<typeof generateInsights>>([]);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    // Simulate AI processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    const generatedInsights = generateInsights(activities, categories);
    setInsights(generatedInsights);
    setAnalyzed(true);
    setLoading(false);
  };

  if (activities.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-card overflow-hidden animate-fade-in">
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="text-sm font-display font-semibold flex items-center gap-2">
          <div className="p-1.5 rounded-lg gradient-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {!analyzed ? (
          <div className="text-center py-6">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150" />
              <div className="relative p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20">
                <Wand2 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
              Get personalized insights about your day based on your logged activities.
            </p>
            <Button 
              onClick={handleAnalyze} 
              disabled={loading} 
              className="gap-2 gradient-primary hover:opacity-90 shadow-glow font-display"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze My Day
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {insights.map((insight, index) => {
              const Icon = iconMap[insight.type] || Lightbulb;
              const bgColor = colorMap[insight.type] || colorMap.tip;
              const iconColor = iconColorMap[insight.type] || iconColorMap.tip;
              return (
                <div
                  key={insight.id}
                  className={`p-3 rounded-xl bg-gradient-to-br ${bgColor} border animate-fade-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${iconColor} shrink-0`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-display font-semibold text-sm text-foreground">{insight.title}</h4>
                        <span className="text-lg">{insight.icon}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {insight.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAnalyze} 
              className="w-full mt-3 border-border/50 hover:border-primary/50 font-display"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : '✨ Refresh Insights'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
