import { useState, useEffect, useCallback } from 'react';
import { firebaseApi } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Activity, MAX_MINUTES_PER_DAY } from '@/types';
import { format } from 'date-fns';

export function useActivities(selectedDate: Date) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const dateString = format(selectedDate, 'yyyy-MM-dd');

  const fetchActivities = useCallback(async () => {
    if (!user) {
      setActivities([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await firebaseApi.get<Record<string, Omit<Activity, 'id'>>>(`activities/${user.uid}/${dateString}`);
      
      if (data) {
        const activitiesArray: Activity[] = Object.entries(data).map(([id, activity]) => ({
          id,
          ...activity,
        }));
        // Sort by createdAt descending
        activitiesArray.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setActivities(activitiesArray);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivities([]);
    }
    setLoading(false);
  }, [user, dateString]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const totalMinutes = activities.reduce((sum, a) => sum + a.duration, 0);
  const remainingMinutes = MAX_MINUTES_PER_DAY - totalMinutes;

  const addActivity = useCallback(async (activity: Omit<Activity, 'id' | 'createdAt'>) => {
    if (!user) return;

    if (totalMinutes + activity.duration > MAX_MINUTES_PER_DAY) {
      throw new Error(`Cannot exceed ${MAX_MINUTES_PER_DAY} minutes per day`);
    }

    const newActivity = {
      ...activity,
      createdAt: new Date().toISOString(),
    };

    const result = await firebaseApi.post(`activities/${user.uid}/${dateString}`, newActivity);
    
    setActivities(prev => [{
      id: result.name,
      ...newActivity,
    }, ...prev]);
  }, [user, dateString, totalMinutes]);

  const updateActivity = useCallback(async (id: string, updates: Partial<Activity>) => {
    if (!user) return;

    const currentActivity = activities.find(a => a.id === id);
    if (!currentActivity) return;

    const newDuration = updates.duration ?? currentActivity.duration;
    const otherActivitiesTotal = totalMinutes - currentActivity.duration;

    if (otherActivitiesTotal + newDuration > MAX_MINUTES_PER_DAY) {
      throw new Error(`Cannot exceed ${MAX_MINUTES_PER_DAY} minutes per day`);
    }

    await firebaseApi.patch(`activities/${user.uid}/${dateString}/${id}`, updates);
    
    setActivities(prev => prev.map(a => 
      a.id === id ? { ...a, ...updates } : a
    ));
  }, [user, dateString, activities, totalMinutes]);

  const deleteActivity = useCallback(async (id: string) => {
    if (!user) return;

    await firebaseApi.delete(`activities/${user.uid}/${dateString}/${id}`);
    
    setActivities(prev => prev.filter(a => a.id !== id));
  }, [user, dateString]);

  return {
    activities,
    loading,
    totalMinutes,
    remainingMinutes,
    addActivity,
    updateActivity,
    deleteActivity,
    refetch: fetchActivities,
  };
}
