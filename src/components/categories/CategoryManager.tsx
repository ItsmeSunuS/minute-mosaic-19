import { useState } from 'react';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { categoryIcons } from '@/data/defaultCategories';
import { Plus, Trash2, Tag } from 'lucide-react';
import * as Icons from 'lucide-react';

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (name: string, icon: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onClose: () => void;
}

export function CategoryManager({ categories, onAddCategory, onDeleteCategory, onClose }: CategoryManagerProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Tag');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const customCategories = categories.filter(c => c.isCustom);
  const defaultCategories = categories.filter(c => !c.isCustom);

  const getCategoryIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className="h-4 w-4" /> : <Tag className="h-4 w-4" />;
  };

  const handleAdd = async () => {
    if (!name.trim()) {
      toast({ variant: 'destructive', title: 'Please enter a category name' });
      return;
    }

    const exists = categories.some(c => c.name.toLowerCase() === name.trim().toLowerCase());
    if (exists) {
      toast({ variant: 'destructive', title: 'Category already exists' });
      return;
    }

    setLoading(true);
    try {
      await onAddCategory(name.trim(), icon);
      setName('');
      setIcon('Tag');
      toast({ title: 'Category added!' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to add category' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await onDeleteCategory(id);
      toast({ title: 'Category deleted' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to delete category' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Manage Categories
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add new category */}
          <div className="space-y-3">
            <Label>Add Custom Category</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1"
              />
              <Select value={icon} onValueChange={setIcon}>
                <SelectTrigger className="w-24">
                  <SelectValue>
                    {getCategoryIcon(icon)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categoryIcons.map((iconName) => (
                    <SelectItem key={iconName} value={iconName}>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(iconName)}
                        <span className="text-xs">{iconName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAdd} disabled={loading}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Custom categories */}
          {customCategories.length > 0 && (
            <div className="space-y-2">
              <Label className="text-muted-foreground">Custom Categories</Label>
              {customCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-secondary/50"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {getCategoryIcon(category.icon)}
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive"
                    onClick={() => handleDelete(category.id)}
                    disabled={loading}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Separator />

          {/* Default categories */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Default Categories</Label>
            <div className="grid grid-cols-2 gap-2">
              {defaultCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  {getCategoryIcon(category.icon)}
                  <span className="text-sm">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
