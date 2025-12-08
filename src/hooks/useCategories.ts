import { useState, useEffect, useCallback } from 'react';
import { firebaseApi } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Category } from '@/types';
import { defaultCategories, categoryColors } from '@/data/defaultCategories';

export function useCategories() {
  const { user } = useAuth();
  const [customCategories, setCustomCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    if (!user) {
      setCustomCategories([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await firebaseApi.get<Record<string, Omit<Category, 'id'>>>(`categories/${user.uid}`);
      
      if (data) {
        const categoriesArray: Category[] = Object.entries(data).map(([id, category]) => ({
          id,
          ...category,
        }));
        setCustomCategories(categoriesArray);
      } else {
        setCustomCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCustomCategories([]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const allCategories = [...defaultCategories, ...customCategories];

  const addCategory = useCallback(async (name: string, icon: string) => {
    if (!user) return;

    const colorIndex = customCategories.length % categoryColors.length;
    const newCategory = {
      name,
      icon,
      color: categoryColors[colorIndex],
      isCustom: true,
    };

    const result = await firebaseApi.post(`categories/${user.uid}`, newCategory);
    
    setCustomCategories(prev => [...prev, {
      id: result.name,
      ...newCategory,
    }]);
  }, [user, customCategories.length]);

  const deleteCategory = useCallback(async (id: string) => {
    if (!user) return;

    await firebaseApi.delete(`categories/${user.uid}/${id}`);
    
    setCustomCategories(prev => prev.filter(c => c.id !== id));
  }, [user]);

  const getCategoryById = useCallback((id: string) => {
    return allCategories.find(c => c.id === id);
  }, [allCategories]);

  return {
    categories: allCategories,
    customCategories,
    loading,
    addCategory,
    deleteCategory,
    getCategoryById,
    refetch: fetchCategories,
  };
}
