import { useState } from 'react';
import { Activity, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import * as Icons from 'lucide-react';

interface ActivityItemProps {
  activity: Activity;
  category: Category | undefined;
  categories: Category[];
  onUpdate: (id: string, updates: Partial<Activity>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ActivityItem({ activity, category, categories, onUpdate, onDelete }: ActivityItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editName, setEditName] = useState(activity.name);
  const [editDuration, setEditDuration] = useState(activity.duration.toString());
  const [editCategoryId, setEditCategoryId] = useState(activity.categoryId);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  const getCategoryIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className="h-4 w-4" /> : null;
  };

  const handleSave = async () => {
    const durationNum = parseInt(editDuration);
    if (isNaN(durationNum) || durationNum <= 0) {
      toast({ variant: 'destructive', title: 'Invalid duration' });
      return;
    }

    setLoading(true);
    try {
      await onUpdate(activity.id, {
        name: editName.trim(),
        duration: durationNum,
        categoryId: editCategoryId,
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({ variant: 'destructive', title: error.message || 'Failed to update' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(activity.id);
      toast({ title: 'Activity deleted' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Failed to delete' });
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  if (isEditing) {
    return (
      <div className="p-3 rounded-lg border border-primary/50 bg-secondary/30 space-y-2 animate-fade-in">
        <Input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          placeholder="Activity name"
          className="h-8"
        />
        <div className="flex gap-2">
          <Select value={editCategoryId} onValueChange={setEditCategoryId}>
            <SelectTrigger className="h-8 flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    {cat.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={editDuration}
            onChange={(e) => setEditDuration(e.target.value)}
            className="h-8 w-20"
            min="1"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} disabled={loading}>
            <X className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={handleSave} disabled={loading}>
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="group flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-secondary/30 transition-all">
        <div 
          className="w-3 h-3 rounded-full shrink-0" 
          style={{ backgroundColor: category?.color || 'hsl(var(--muted))' }}
        />
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{activity.name}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {category && getCategoryIcon(category.icon)}
            <span>{category?.name || 'Unknown'}</span>
          </div>
        </div>

        <span className="text-sm font-medium text-muted-foreground shrink-0">
          {formatTime(activity.duration)}
        </span>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setIsEditing(true)}>
            <Pencil className="h-3 w-3" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Activity?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{activity.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
