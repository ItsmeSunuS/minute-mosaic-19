import { MAX_MINUTES_PER_DAY } from '@/types';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface DayProgressProps {
  totalMinutes: number;
}

export function DayProgress({ totalMinutes }: DayProgressProps) {
  const percentage = (totalMinutes / MAX_MINUTES_PER_DAY) * 100;
  const remainingMinutes = MAX_MINUTES_PER_DAY - totalMinutes;
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Daily Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Progress value={percentage} className="h-3" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Logged: <span className="font-medium text-foreground">{formatTime(totalMinutes)}</span>
            </span>
            <span className="text-muted-foreground">
              Remaining: <span className="font-medium text-foreground">{formatTime(remainingMinutes)}</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {percentage.toFixed(1)}% of your day tracked
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
