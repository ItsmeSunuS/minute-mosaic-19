import { Activity, Category } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Clock, Hash, TrendingUp } from 'lucide-react';

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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          Daily Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="text-xs">Total Time</span>
            </div>
            <p className="text-xl font-semibold">{formatTime(totalMinutes)}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Hash className="h-3 w-3" />
              <span className="text-xs">Activities</span>
            </div>
            <p className="text-xl font-semibold">{activities.length}</p>
          </div>
        </div>

        {topCategoryData && (
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-3 w-3" />
              <span className="text-xs">Top Category</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: topCategoryData.color }}
              />
              <span className="font-medium">{topCategoryData.name}</span>
              <span className="text-sm text-muted-foreground">
                ({formatTime(topCategory[1])})
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
