import { useState, useMemo } from 'react';
import { Category, MAX_MINUTES_PER_DAY } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import * as Icons from 'lucide-react';
import { Clock, Sparkles } from 'lucide-react';

interface ActivityFormProps {
  categories: Category[];
  remainingMinutes: number;
  onSubmit: (data: { name: string; categoryId: string; duration: number }) => Promise<void>;
  onClose: () => void;
}

// Activity suggestions based on category
const activitySuggestions: Record<string, string[]> = {
  Work: ['Morning meeting', 'Project planning', 'Code review', 'Client call', 'Email management', 'Documentation'],
  Sleep: ['Night sleep', 'Power nap', 'Rest'],
  Exercise: ['Morning jog', 'Gym workout', 'Yoga session', 'Stretching', 'Walking', 'Cycling'],
  Study: ['Reading', 'Online course', 'Research', 'Practice problems', 'Language learning'],
  Entertainment: ['Watching movie', 'Gaming', 'Social media', 'YouTube', 'Music'],
  Personal: ['Self-care', 'Meditation', 'Journaling', 'Planning', 'Phone calls'],
  Meals: ['Breakfast', 'Lunch', 'Dinner', 'Snack break', 'Coffee break'],
  Commute: ['Morning commute', 'Evening commute', 'Travel'],
};

export function ActivityForm({ categories, remainingMinutes, onSubmit, onClose }: ActivityFormProps) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [timeUnit, setTimeUnit] = useState<'minutes' | 'hours'>('minutes');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Get suggestions based on selected category
  const suggestions = useMemo(() => {
    const selectedCategory = categories.find(c => c.id === categoryId);
    if (selectedCategory) {
      return activitySuggestions[selectedCategory.name] || [];
    }
    return [];
  }, [categoryId, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let durationNum: number;
    
    if (timeUnit === 'hours') {
      const hoursNum = parseFloat(hours) || 0;
      const minsNum = parseInt(minutes) || 0;
      durationNum = Math.round(hoursNum * 60) + minsNum;
    } else {
      durationNum = parseInt(minutes) || 0;
    }
    
    if (!name.trim()) {
      toast({ variant: 'destructive', title: 'Please enter an activity name' });
      return;
    }
    
    if (!categoryId) {
      toast({ variant: 'destructive', title: 'Please select a category' });
      return;
    }
    
    if (durationNum <= 0) {
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
      toast({ title: '✨ Activity added successfully!' });
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

  const formatRemainingTime = () => {
    const hrs = Math.floor(remainingMinutes / 60);
    const mins = remainingMinutes % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m remaining`;
    }
    return `${mins} minutes remaining`;
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg gradient-primary">
              <Clock className="h-4 w-4 text-primary-foreground" />
            </div>
            Add Activity
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Activity Name</Label>
            <Input
              id="name"
              placeholder="e.g., Morning meeting"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-border/50 focus:border-primary transition-colors"
              autoFocus
            />
            
            {/* Activity Suggestions */}
            {suggestions.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <Sparkles className="h-3 w-3 text-accent" />
                  <span>Suggestions:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.slice(0, 6).map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setName(suggestion)}
                      className="px-2.5 py-1 text-xs rounded-full bg-accent/10 text-accent hover:bg-accent/20 border border-accent/20 hover:border-accent/40 transition-all duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="border-border/50 focus:border-primary transition-colors">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50">
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

          <div className="space-y-3">
            <Label>Duration</Label>
            
            {/* Time Unit Toggle */}
            <RadioGroup 
              value={timeUnit} 
              onValueChange={(v) => setTimeUnit(v as 'minutes' | 'hours')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="minutes" id="minutes" className="border-primary text-primary" />
                <Label htmlFor="minutes" className="text-sm cursor-pointer">Minutes only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hours" id="hours" className="border-primary text-primary" />
                <Label htmlFor="hours" className="text-sm cursor-pointer">Hours & Minutes</Label>
              </div>
            </RadioGroup>

            {timeUnit === 'minutes' ? (
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="e.g., 60"
                  min="1"
                  max={remainingMinutes}
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="border-border/50 focus:border-primary transition-colors"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatRemainingTime()}</span>
                  <span>Max: {MAX_MINUTES_PER_DAY} min/day</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Hours</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      min="0"
                      max="24"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      className="border-border/50 focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Minutes</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      min="0"
                      max="59"
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                      className="border-border/50 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatRemainingTime()}</span>
                  <span>Max: 24 hours/day</span>
                </div>
              </div>
            )}

            {/* Quick Duration Buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[15, 30, 45, 60, 90, 120].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => {
                    if (timeUnit === 'minutes') {
                      setMinutes(String(mins));
                    } else {
                      const h = Math.floor(mins / 60);
                      const m = mins % 60;
                      setHours(String(h));
                      setMinutes(String(m));
                    }
                  }}
                  className="px-3 py-1.5 text-xs rounded-lg bg-muted/50 hover:bg-primary/10 hover:text-primary border border-border/30 hover:border-primary/30 transition-all duration-200"
                >
                  {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} className="border-border/50 hover:bg-muted/50">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="gradient-primary hover:opacity-90 shadow-glow transition-all duration-300"
            >
              {loading ? 'Adding...' : 'Add Activity ✨'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}