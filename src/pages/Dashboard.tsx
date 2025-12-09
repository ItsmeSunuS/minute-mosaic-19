import { useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useActivities } from '@/hooks/useActivities';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DayProgress } from '@/components/analytics/DayProgress';
import { DailySummary } from '@/components/analytics/DailySummary';
import { TimeDistributionChart } from '@/components/analytics/TimeDistributionChart';
import { ActivityChart } from '@/components/analytics/ActivityChart';
import { ActivityForm } from '@/components/activities/ActivityForm';
import { ActivityList } from '@/components/activities/ActivityList';
import { CategoryManager } from '@/components/categories/CategoryManager';
import { AIInsights } from '@/components/insights/AIInsights';
import { EmptyState } from '@/components/analytics/EmptyState';
import { Clock, CalendarIcon, LogOut, Plus, Settings, Sparkles, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import analyticsIllustration from '@/assets/analytics-illustration.png';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  
  const { activities, loading, totalMinutes, remainingMinutes, addActivity, updateActivity, deleteActivity } = useActivities(selectedDate);
  const { categories, addCategory, deleteCategory, getCategoryById } = useCategories();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleAddActivity = async (data: { name: string; categoryId: string; duration: number }) => {
    await addActivity(data);
    setShowActivityForm(false);
  };

  // Get display name (first name or username)
  const getDisplayName = () => {
    if (user?.displayName) {
      return user.displayName.split(' ')[0]; // Get first name
    }
    if (user?.email) {
      return user.email.split('@')[0]; // Get username from email
    }
    return 'there';
  };

  // Check if user has good progress (logged more than 60% of the day)
  const hasGoodProgress = totalMinutes > 864; // 60% of 1440

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl gradient-primary shadow-glow">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-display font-bold gradient-text">Track Your Time With Me ✨</h1>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span className="truncate max-w-[120px] sm:max-w-[200px]">{getDisplayName()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className={cn("justify-start text-left font-normal border-border/50 hover:border-primary/50 transition-colors")}>
                    <CalendarIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                    <span className="hidden sm:inline text-sm">{format(selectedDate, 'PPP')}</span>
                    <span className="sm:hidden text-xs">{format(selectedDate, 'MMM d')}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto" align="end">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              <Button variant="ghost" size="icon" onClick={() => setShowCategoryManager(true)} className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-primary/10">
                <Settings className="h-4 w-4 text-muted-foreground" />
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout} 
                className="h-8 sm:h-9 px-2 sm:px-3 hover:bg-destructive/10 hover:text-destructive flex items-center gap-1.5 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Message */}
      <div className="container mx-auto px-4 pt-4 sm:pt-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <img 
                src={analyticsIllustration} 
                alt="Analytics" 
                className="w-16 h-16 object-contain rounded-xl"
              />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                Hi {getDisplayName()}! 👋
                {hasGoodProgress && <span className="ml-2">👏🎉</span>}
              </h2>
              <p className="text-sm text-muted-foreground">
                {hasGoodProgress 
                  ? "Amazing progress today! You're doing great! 🌟" 
                  : "Welcome back! Ready to track your day?"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative container mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Progress Bar */}
        <DayProgress totalMinutes={totalMinutes} />

        {/* Add Activity Button */}
        <div className="flex justify-end">
          <Button 
            onClick={() => setShowActivityForm(true)} 
            className="gap-2 gradient-primary hover:opacity-90 shadow-glow hover:shadow-glow-lg transition-all duration-300 font-display hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Activity</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground animate-pulse">Loading your activities...</p>
          </div>
        ) : activities.length === 0 ? (
          <EmptyState onAddActivity={() => setShowActivityForm(true)} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Activities */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6 order-2 lg:order-1">
              <ActivityList
                activities={activities}
                categories={categories}
                getCategoryById={getCategoryById}
                onUpdate={updateActivity}
                onDelete={deleteActivity}
              />
            </div>

            {/* Middle Column - Charts */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6 order-1 lg:order-2">
              <DailySummary
                activities={activities}
                totalMinutes={totalMinutes}
                remainingMinutes={remainingMinutes}
                getCategoryById={getCategoryById}
              />
              <TimeDistributionChart
                activities={activities}
                getCategoryById={getCategoryById}
              />
            </div>

            {/* Right Column - Activity Chart & Insights */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6 order-3">
              <ActivityChart
                activities={activities}
                getCategoryById={getCategoryById}
              />
              <AIInsights activities={activities} categories={categories} />
            </div>
          </div>
        )}
      </main>

      {/* Activity Form Dialog */}
      {showActivityForm && (
        <ActivityForm
          categories={categories}
          remainingMinutes={remainingMinutes}
          onSubmit={handleAddActivity}
          onClose={() => setShowActivityForm(false)}
        />
      )}

      {/* Category Manager Dialog */}
      {showCategoryManager && (
        <CategoryManager
          categories={categories}
          onAddCategory={addCategory}
          onDeleteCategory={deleteCategory}
          onClose={() => setShowCategoryManager(false)}
        />
      )}
    </div>
  );
}