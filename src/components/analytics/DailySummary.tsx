import { Activity, Category } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Clock, Hash, TrendingUp, Award } from 'lucide-react';

interface DailySummaryProps {
  activities: Activity[];
  totalMinutes: number;
  remainingMinutes: number;
  getCategoryById: (id: string) => Category | undefined;
}

export function DailySummary({ activities, totalMinutes, remainingMinutes, getCategoryById }: DailySummaryProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  // Calculate category breakdown
  const categoryBreakdown: Record<string, number> = {};
  activities.forEach(activity => {
    categoryBreakdown[activity.categoryId] = (categoryBreakdown[activity.categoryId] || 0) + activity.duration;
  });

  const topCategory = Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1])[0];
  const topCategoryData = topCategory ? getCategoryById(topCategory[0]) : null;

  return (
    <Card className="border-0 shadow-card overflow-hidden animate-fade-in hover-lift">
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="text-sm font-display font-semibold flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          Daily Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-3 w-3 text-primary" />
              <span className="text-xs">Total Time</span>
            </div>
            <p className="text-xl sm:text-2xl font-display font-bold text-foreground">{formatTime(totalMinutes)}</p>
          </div>
          
          <div className="p-3 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/10">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Hash className="h-3 w-3 text-secondary" />
              <span className="text-xs">Activities</span>
            </div>
            <p className="text-xl sm:text-2xl font-display font-bold text-foreground">{activities.length}</p>
          </div>
        </div>

        {topCategoryData && (
          <div className="p-3 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/10">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Award className="h-3 w-3 text-accent" />
              <span className="text-xs">Top Category</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full shadow-sm" 
                  style={{ backgroundColor: topCategoryData.color }}
                />
                <span className="font-display font-semibold text-foreground">{topCategoryData.name}</span>
              </div>
              <span className="text-sm font-medium text-accent">
                {formatTime(topCategory[1])}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
