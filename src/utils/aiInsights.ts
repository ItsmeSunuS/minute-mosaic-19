import { Activity, AIInsight, Category, MAX_MINUTES_PER_DAY } from '@/types';

interface CategorySummary {
  categoryId: string;
  categoryName: string;
  totalMinutes: number;
  percentage: number;
}

export function generateInsights(
  activities: Activity[],
  categories: Category[]
): AIInsight[] {
  if (activities.length === 0) return [];

  const insights: AIInsight[] = [];
  const totalMinutes = activities.reduce((sum, a) => sum + a.duration, 0);
  
  // Calculate category summaries
  const categorySummaries: CategorySummary[] = [];
  const categoryMinutes: Record<string, number> = {};
  
  activities.forEach(activity => {
    categoryMinutes[activity.categoryId] = (categoryMinutes[activity.categoryId] || 0) + activity.duration;
  });

  Object.entries(categoryMinutes).forEach(([categoryId, minutes]) => {
    const category = categories.find(c => c.id === categoryId);
    categorySummaries.push({
      categoryId,
      categoryName: category?.name || 'Unknown',
      totalMinutes: minutes,
      percentage: (minutes / totalMinutes) * 100,
    });
  });

  categorySummaries.sort((a, b) => b.totalMinutes - a.totalMinutes);

  // Sleep analysis
  const sleepMinutes = categoryMinutes['sleep'] || 0;
  const sleepHours = sleepMinutes / 60;
  
  if (sleepHours < 6) {
    insights.push({
      id: 'sleep-low',
      type: 'health',
      icon: '😴',
      title: 'Sleep Alert',
      message: `You logged ${sleepHours.toFixed(1)} hours of sleep. Adults typically need 7-9 hours. Consider prioritizing rest for better productivity and health.`,
    });
  } else if (sleepHours >= 7 && sleepHours <= 9) {
    insights.push({
      id: 'sleep-good',
      type: 'health',
      icon: '✨',
      title: 'Great Sleep!',
      message: `${sleepHours.toFixed(1)} hours of sleep is ideal! Quality rest supports cognitive function and overall well-being.`,
    });
  } else if (sleepHours > 9) {
    insights.push({
      id: 'sleep-high',
      type: 'health',
      icon: '💤',
      title: 'Extended Rest',
      message: `You logged ${sleepHours.toFixed(1)} hours of sleep. While occasional long sleep is fine, consistently sleeping over 9 hours may indicate other factors worth exploring.`,
    });
  }

  // Work-life balance
  const workMinutes = categoryMinutes['work'] || 0;
  const workHours = workMinutes / 60;
  const personalMinutes = (categoryMinutes['entertainment'] || 0) + 
                          (categoryMinutes['personal'] || 0);
  const personalHours = personalMinutes / 60;

  if (workHours > 10) {
    insights.push({
      id: 'work-high',
      type: 'balance',
      icon: '⚠️',
      title: 'Heavy Workload',
      message: `${workHours.toFixed(1)} hours of work is significant. Remember to schedule breaks and personal time to prevent burnout.`,
    });
  } else if (workHours >= 6 && workHours <= 9) {
    insights.push({
      id: 'work-balanced',
      type: 'productivity',
      icon: '💼',
      title: 'Productive Day',
      message: `${workHours.toFixed(1)} hours of focused work is a healthy amount. Great job maintaining productivity!`,
    });
  }

  // Exercise check
  const exerciseMinutes = categoryMinutes['exercise'] || 0;
  
  if (exerciseMinutes === 0) {
    insights.push({
      id: 'exercise-zero',
      type: 'wellness',
      icon: '🏃',
      title: 'Movement Opportunity',
      message: 'No exercise logged today. Even 15-30 minutes of physical activity can boost energy, mood, and focus.',
    });
  } else if (exerciseMinutes >= 30) {
    insights.push({
      id: 'exercise-good',
      type: 'wellness',
      icon: '💪',
      title: 'Active Day!',
      message: `Great job with ${exerciseMinutes} minutes of exercise! Regular physical activity supports both physical and mental health.`,
    });
  }

  // Screen time / Entertainment balance
  const entertainmentMinutes = categoryMinutes['entertainment'] || 0;
  const entertainmentHours = entertainmentMinutes / 60;

  if (entertainmentHours > 4) {
    insights.push({
      id: 'entertainment-high',
      type: 'balance',
      icon: '📺',
      title: 'Screen Time Check',
      message: `${entertainmentHours.toFixed(1)} hours of entertainment. Consider balancing with other activities for variety.`,
    });
  }

  // Study/Learning recognition
  const studyMinutes = categoryMinutes['study'] || 0;
  if (studyMinutes > 0) {
    insights.push({
      id: 'study-positive',
      type: 'productivity',
      icon: '📚',
      title: 'Learning Investment',
      message: `${studyMinutes} minutes dedicated to learning! Continuous education is key to personal and professional growth.`,
    });
  }

  // Daily completion insight
  const loggedPercentage = (totalMinutes / MAX_MINUTES_PER_DAY) * 100;
  
  if (loggedPercentage < 50) {
    insights.push({
      id: 'tracking-incomplete',
      type: 'tip',
      icon: '📝',
      title: 'Tracking Tip',
      message: `You've logged ${loggedPercentage.toFixed(0)}% of your day. Try to log more activities for better insights and patterns.`,
    });
  } else if (loggedPercentage >= 80) {
    insights.push({
      id: 'tracking-complete',
      type: 'tip',
      icon: '🎯',
      title: 'Excellent Tracking!',
      message: `${loggedPercentage.toFixed(0)}% of your day is logged. This comprehensive tracking gives you great visibility into your time usage.`,
    });
  }

  // Top activity insight
  if (categorySummaries.length > 0) {
    const topCategory = categorySummaries[0];
    insights.push({
      id: 'top-activity',
      type: 'productivity',
      icon: '📊',
      title: 'Time Leader',
      message: `${topCategory.categoryName} was your top time investment at ${(topCategory.totalMinutes / 60).toFixed(1)} hours (${topCategory.percentage.toFixed(0)}% of logged time).`,
    });
  }

  return insights;
}
