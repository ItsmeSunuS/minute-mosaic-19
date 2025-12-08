import { Activity, Category } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart2 } from 'lucide-react';

interface ActivityChartProps {
  activities: Activity[];
  getCategoryById: (id: string) => Category | undefined;
}

export function ActivityChart({ activities, getCategoryById }: ActivityChartProps) {
  const chartData = activities.slice(0, 8).map(activity => {
    const category = getCategoryById(activity.categoryId);
    return {
      name: activity.name.length > 10 ? activity.name.substring(0, 10) + '...' : activity.name,
      fullName: activity.name,
      duration: activity.duration,
      color: category?.color || 'hsl(var(--muted))',
    };
  });

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
          <div className="p-1.5 rounded-lg bg-warning/10">
            <BarChart2 className="h-4 w-4 text-warning" />
          </div>
          Activity Duration
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[180px] sm:h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={70}
                tick={{ 
                  fontSize: 10, 
                  fill: 'hsl(var(--muted-foreground))',
                  fontFamily: 'Inter, sans-serif',
                }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                formatter={(value: number) => formatTime(value)}
                labelFormatter={(_, payload) => payload[0]?.payload?.fullName || ''}
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
                  marginBottom: '4px',
                }}
              />
              <Bar dataKey="duration" radius={[0, 8, 8, 0]} barSize={20}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    style={{ filter: `drop-shadow(2px 2px 4px ${entry.color}30)` }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
