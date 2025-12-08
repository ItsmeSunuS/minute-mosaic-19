import { Activity, Category } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PieChartIcon } from 'lucide-react';

interface TimeDistributionChartProps {
  activities: Activity[];
  getCategoryById: (id: string) => Category | undefined;
}

export function TimeDistributionChart({ activities, getCategoryById }: TimeDistributionChartProps) {
  // Aggregate by category
  const categoryData: Record<string, { name: string; minutes: number; color: string }> = {};
  
  activities.forEach(activity => {
    const category = getCategoryById(activity.categoryId);
    if (!categoryData[activity.categoryId]) {
      categoryData[activity.categoryId] = {
        name: category?.name || 'Unknown',
        minutes: 0,
        color: category?.color || 'hsl(var(--muted))',
      };
    }
    categoryData[activity.categoryId].minutes += activity.duration;
  });

  const chartData = Object.values(categoryData).map(item => ({
    name: item.name,
    value: item.minutes,
    color: item.color,
  }));

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  if (chartData.length === 0) return null;

  return (
    <Card className="border-0 shadow-card overflow-hidden animate-fade-in hover-lift">
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="text-sm font-display font-semibold flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent/10">
            <PieChartIcon className="h-4 w-4 text-accent" />
          </div>
          Time Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[220px] sm:h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {chartData.map((entry, index) => (
                  <filter key={`shadow-${index}`} id={`shadow-${index}`}>
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                  </filter>
                ))}
              </defs>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={2}
                stroke="hsl(var(--card))"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    style={{ filter: `drop-shadow(0 2px 4px ${entry.color}40)` }}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatTime(value)}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px hsl(var(--foreground) / 0.1)',
                  padding: '8px 12px',
                }}
                labelStyle={{
                  fontWeight: 600,
                  fontFamily: 'Space Grotesk, sans-serif',
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '16px' }}
                formatter={(value) => (
                  <span className="text-xs sm:text-sm text-foreground font-medium">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
