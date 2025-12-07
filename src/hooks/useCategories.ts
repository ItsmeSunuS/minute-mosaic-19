import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Category } from '@/types';
import { defaultCategories, categoryColors } from '@/data/defaultCategories';

export function useCategories() {
  const { user } = useAuth();
  const [customCategories, setCustomCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCustomCategories([]);
      setLoading(false);
      return;
    }

    const categoriesRef = collection(db, 'users', user.uid, 'categories');
    
    const unsubscribe = onSnapshot(categoriesRef, (snapshot) => {
      const categoriesData: Category[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];
      
      setCustomCategories(categoriesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const allCategories = [...defaultCategories, ...customCategories];

  const addCategory = useCallback(async (name: string, icon: string) => {
    if (!user) return;

    const colorIndex = customCategories.length % categoryColors.length;
    const categoryRef = doc(collection(db, 'users', user.uid, 'categories'));
    
    await setDoc(categoryRef, {
      name,
      icon,
      color: categoryColors[colorIndex],
      isCustom: true,
    });
  }, [user, customCategories.length]);

  const deleteCategory = useCallback(async (id: string) => {
    if (!user) return;

    const categoryRef = doc(db, 'users', user.uid, 'categories', id);
    await deleteDoc(categoryRef);
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
  };
}
