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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <PieChartIcon className="h-4 w-4 text-primary" />
          Time Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatTime(value)}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend 
                formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
