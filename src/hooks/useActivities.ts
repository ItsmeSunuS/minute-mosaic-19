import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Activity, MAX_MINUTES_PER_DAY } from '@/types';
import { format } from 'date-fns';

export function useActivities(selectedDate: Date) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const dateString = format(selectedDate, 'yyyy-MM-dd');

  useEffect(() => {
    if (!user) {
      setActivities([]);
      setLoading(false);
      return;
    }

    const activitiesRef = collection(db, 'users', user.uid, 'dates', dateString, 'activities');
    const q = query(activitiesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activitiesData: Activity[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Activity[];
      
      setActivities(activitiesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, dateString]);

  const totalMinutes = activities.reduce((sum, a) => sum + a.duration, 0);
  const remainingMinutes = MAX_MINUTES_PER_DAY - totalMinutes;

  const addActivity = useCallback(async (activity: Omit<Activity, 'id' | 'createdAt'>) => {
    if (!user) return;

    if (totalMinutes + activity.duration > MAX_MINUTES_PER_DAY) {
      throw new Error(`Cannot exceed ${MAX_MINUTES_PER_DAY} minutes per day`);
    }

    const activityRef = doc(collection(db, 'users', user.uid, 'dates', dateString, 'activities'));
    await setDoc(activityRef, {
      ...activity,
      createdAt: new Date(),
    });
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

    const activityRef = doc(db, 'users', user.uid, 'dates', dateString, 'activities', id);
    await setDoc(activityRef, { ...currentActivity, ...updates }, { merge: true });
  }, [user, dateString, activities, totalMinutes]);

  const deleteActivity = useCallback(async (id: string) => {
    if (!user) return;

    const activityRef = doc(db, 'users', user.uid, 'dates', dateString, 'activities', id);
    await deleteDoc(activityRef);
  }, [user, dateString]);

  return {
    activities,
    loading,
    totalMinutes,
    remainingMinutes,
    addActivity,
    updateActivity,
    deleteActivity,
  };
}
