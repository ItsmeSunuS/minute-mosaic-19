import { Activity, Category } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityItem } from './ActivityItem';
import { List, Layers } from 'lucide-react';

interface ActivityListProps {
  activities: Activity[];
  categories: Category[];
  getCategoryById: (id: string) => Category | undefined;
  onUpdate: (id: string, updates: Partial<Activity>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ActivityList({ activities, categories, getCategoryById, onUpdate, onDelete }: ActivityListProps) {
  return (
    <Card className="border-0 shadow-card overflow-hidden animate-fade-in">
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="text-sm font-display font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-secondary/10">
              <List className="h-4 w-4 text-secondary" />
            </div>
            Activities
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary/10 text-secondary">
            <Layers className="h-3 w-3" />
            <span className="text-xs font-medium">{activities.length}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-2 max-h-[500px] overflow-y-auto">
        {activities.map((activity, index) => (
          <div 
            key={activity.id} 
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ActivityItem
              activity={activity}
              category={getCategoryById(activity.categoryId)}
              categories={categories}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
