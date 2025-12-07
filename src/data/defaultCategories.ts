import { Category } from '@/types';

export const defaultCategories: Category[] = [
  {
    id: 'work',
    name: 'Work',
    color: 'hsl(var(--category-work))',
    icon: 'Briefcase',
    isCustom: false,
  },
  {
    id: 'sleep',
    name: 'Sleep',
    color: 'hsl(var(--category-sleep))',
    icon: 'Moon',
    isCustom: false,
  },
  {
    id: 'exercise',
    name: 'Exercise',
    color: 'hsl(var(--category-exercise))',
    icon: 'Dumbbell',
    isCustom: false,
  },
  {
    id: 'study',
    name: 'Study',
    color: 'hsl(var(--category-study))',
    icon: 'BookOpen',
    isCustom: false,
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    color: 'hsl(var(--category-entertainment))',
    icon: 'Tv',
    isCustom: false,
  },
  {
    id: 'personal',
    name: 'Personal',
    color: 'hsl(var(--category-personal))',
    icon: 'User',
    isCustom: false,
  },
  {
    id: 'meals',
    name: 'Meals',
    color: 'hsl(var(--category-meals))',
    icon: 'UtensilsCrossed',
    isCustom: false,
  },
  {
    id: 'commute',
    name: 'Commute',
    color: 'hsl(var(--category-commute))',
    icon: 'Car',
    isCustom: false,
  },
];

export const categoryColors = [
  'hsl(217, 91%, 50%)',   // Blue
  'hsl(262, 83%, 58%)',   // Purple
  'hsl(142, 76%, 36%)',   // Green
  'hsl(38, 92%, 50%)',    // Yellow
  'hsl(340, 82%, 52%)',   // Pink
  'hsl(173, 80%, 40%)',   // Teal
  'hsl(25, 95%, 53%)',    // Orange
  'hsl(210, 20%, 50%)',   // Gray
  'hsl(0, 72%, 51%)',     // Red
  'hsl(280, 87%, 50%)',   // Violet
];

export const categoryIcons = [
  'Briefcase', 'Moon', 'Dumbbell', 'BookOpen', 'Tv', 'User', 
  'UtensilsCrossed', 'Car', 'Heart', 'Music', 'Gamepad2', 
  'Coffee', 'Plane', 'ShoppingBag', 'Palette', 'Code'
];
