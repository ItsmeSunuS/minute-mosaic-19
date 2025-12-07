import { useState } from 'react';
import { Activity, Category } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateInsights } from '@/utils/aiInsights';
import { Sparkles, Loader2, Brain, Heart, Target, Scale, Lightbulb } from 'lucide-react';

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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!analyzed ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Get personalized insights about your day based on your logged activities.
            </p>
            <Button onClick={handleAnalyze} disabled={loading} className="gap-2">
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
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {insights.map((insight) => {
              const Icon = iconMap[insight.type] || Lightbulb;
              return (
                <div
                  key={insight.id}
                  className="p-3 rounded-lg bg-secondary/50 border border-border/50 animate-fade-in"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{insight.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        <Icon className="h-3 w-3 text-muted-foreground" />
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
              variant="ghost" 
              size="sm" 
              onClick={handleAnalyze} 
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh Insights'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
