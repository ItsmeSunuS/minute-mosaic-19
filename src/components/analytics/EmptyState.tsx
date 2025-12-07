import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Plus, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onAddActivity: () => void;
}

export function EmptyState({ onAddActivity }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="p-4 rounded-full bg-primary/10 mb-6">
          <Clock className="h-12 w-12 text-primary" />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">No Activities Logged</h3>
        <p className="text-muted-foreground text-center max-w-sm mb-6">
          Start tracking your time to get insights into how you spend your day. 
          You have 1440 minutes to log.
        </p>

        <Button onClick={onAddActivity} size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          Log Your First Activity
        </Button>

        <div className="flex items-center gap-2 mt-8 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          <span>AI insights unlock after logging activities</span>
        </div>
      </CardContent>
    </Card>
  );
}
