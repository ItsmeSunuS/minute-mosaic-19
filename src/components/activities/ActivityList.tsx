import { Activity, Category } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityItem } from './ActivityItem';
import { List } from 'lucide-react';

interface ActivityListProps {
  activities: Activity[];
  categories: Category[];
  getCategoryById: (id: string) => Category | undefined;
  onUpdate: (id: string, updates: Partial<Activity>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ActivityList({ activities, categories, getCategoryById, onUpdate, onDelete }: ActivityListProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <List className="h-4 w-4 text-primary" />
          Activities ({activities.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
        {activities.map((activity) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            category={getCategoryById(activity.categoryId)}
            categories={categories}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </CardContent>
    </Card>
  );
}
