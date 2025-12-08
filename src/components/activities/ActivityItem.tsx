import { useState } from 'react';
import { Activity, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Check, X, Clock } from 'lucide-react';
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
    return Icon ? <Icon className="h-3.5 w-3.5" /> : null;
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
      <div className="p-4 rounded-xl border-2 border-primary/30 bg-primary/5 space-y-3 animate-scale-in">
        <Input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          placeholder="Activity name"
          className="h-9 border-border/50 focus:border-primary"
        />
        <div className="flex gap-2">
          <Select value={editCategoryId} onValueChange={setEditCategoryId}>
            <SelectTrigger className="h-9 flex-1 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
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
            className="h-9 w-24 border-border/50"
            min="1"
            placeholder="min"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} disabled={loading} className="hover:bg-destructive/10 hover:text-destructive">
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={loading} className="gradient-primary hover:opacity-90">
            <Check className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="group flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-card bg-card transition-all duration-200 hover-lift">
        <div 
          className="w-4 h-4 rounded-full shrink-0 shadow-sm ring-2 ring-white" 
          style={{ backgroundColor: category?.color || 'hsl(var(--muted))' }}
        />
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground truncate">{activity.name}</p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            {category && (
              <span style={{ color: category.color }}>
                {getCategoryIcon(category.icon)}
              </span>
            )}
            <span>{category?.name || 'Unknown'}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50 shrink-0">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">
            {formatTime(activity.duration)}
          </span>
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-primary/10 hover:text-primary" onClick={() => setIsEditing(true)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="border-0 shadow-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Delete Activity?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "<span className="font-medium text-foreground">{activity.name}</span>". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border/50">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
