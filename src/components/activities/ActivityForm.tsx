import { useState } from 'react';
import { Category, MAX_MINUTES_PER_DAY } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import * as Icons from 'lucide-react';

interface ActivityFormProps {
  categories: Category[];
  remainingMinutes: number;
  onSubmit: (data: { name: string; categoryId: string; duration: number }) => Promise<void>;
  onClose: () => void;
}

export function ActivityForm({ categories, remainingMinutes, onSubmit, onClose }: ActivityFormProps) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const durationNum = parseInt(duration);
    
    if (!name.trim()) {
      toast({ variant: 'destructive', title: 'Please enter an activity name' });
      return;
    }
    
    if (!categoryId) {
      toast({ variant: 'destructive', title: 'Please select a category' });
      return;
    }
    
    if (isNaN(durationNum) || durationNum <= 0) {
      toast({ variant: 'destructive', title: 'Please enter a valid duration' });
      return;
    }
    
    if (durationNum > remainingMinutes) {
      toast({ 
        variant: 'destructive', 
        title: 'Duration exceeds remaining time',
        description: `You only have ${remainingMinutes} minutes left today.`
      });
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ name: name.trim(), categoryId, duration: durationNum });
      toast({ title: 'Activity added successfully!' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: error.message || 'Failed to add activity' });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className="h-4 w-4" /> : null;
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Activity</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Activity Name</Label>
            <Input
              id="name"
              placeholder="e.g., Morning meeting"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      {getCategoryIcon(category.icon)}
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              placeholder="e.g., 60"
              min="1"
              max={remainingMinutes}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {remainingMinutes} minutes remaining today (max: {MAX_MINUTES_PER_DAY})
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Activity'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
