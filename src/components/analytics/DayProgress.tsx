import { MAX_MINUTES_PER_DAY } from '@/types';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Zap, Target } from 'lucide-react';

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

  const getProgressColor = () => {
    if (percentage >= 90) return 'bg-success';
    if (percentage >= 50) return 'bg-primary';
    return 'bg-secondary';
  };

  return (
    <Card className="border-0 shadow-card overflow-hidden animate-fade-in">
      <div className="gradient-primary p-1">
        <CardContent className="bg-card rounded-t-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl gradient-primary shadow-glow">
                <Clock className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">Daily Progress</h3>
                <p className="text-xs text-muted-foreground">Track your 24-hour journey</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                percentage >= 90 
                  ? 'bg-success/10 text-success' 
                  : percentage >= 50 
                    ? 'bg-primary/10 text-primary' 
                    : 'bg-secondary/10 text-secondary'
              }`}>
                {percentage.toFixed(0)}% Complete
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative mb-4">
            <div className="h-4 sm:h-5 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${getProgressColor()} transition-all duration-500 ease-out rounded-full relative`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/10">
              <Zap className="h-4 w-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Logged</div>
                <div className="font-display font-semibold text-foreground text-sm sm:text-base">{formatTime(totalMinutes)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/5 border border-secondary/10">
              <Target className="h-4 w-4 text-secondary" />
              <div>
                <div className="text-xs text-muted-foreground">Remaining</div>
                <div className="font-display font-semibold text-foreground text-sm sm:text-base">{formatTime(remainingMinutes)}</div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 p-3 rounded-xl bg-accent/5 border border-accent/10">
              <Clock className="h-4 w-4 text-accent" />
              <div>
                <div className="text-xs text-muted-foreground">Total Day</div>
                <div className="font-display font-semibold text-foreground">{formatTime(MAX_MINUTES_PER_DAY)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
