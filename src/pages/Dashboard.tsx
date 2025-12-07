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
import { Clock, CalendarIcon, LogOut, Plus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  
  const { activities, loading, totalMinutes, remainingMinutes, addActivity, updateActivity, deleteActivity } = useActivities(selectedDate);
  const { categories, addCategory, deleteCategory, getCategoryById } = useCategories();

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const handleAddActivity = async (data: { name: string; categoryId: string; duration: number }) => {
    await addActivity(data);
    setShowActivityForm(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary">
                <Clock className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">TimeTrack AI</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">{format(selectedDate, 'PPP')}</span>
                    <span className="sm:hidden">{format(selectedDate, 'MMM d')}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Button variant="ghost" size="icon" onClick={() => setShowCategoryManager(true)}>
                <Settings className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Progress Bar */}
        <DayProgress totalMinutes={totalMinutes} />

        {/* Add Activity Button */}
        <div className="flex justify-end">
          <Button onClick={() => setShowActivityForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Activity
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : activities.length === 0 ? (
          <EmptyState onAddActivity={() => setShowActivityForm(true)} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Activities */}
            <div className="lg:col-span-1 space-y-6">
              <ActivityList
                activities={activities}
                categories={categories}
                getCategoryById={getCategoryById}
                onUpdate={updateActivity}
                onDelete={deleteActivity}
              />
            </div>

            {/* Middle Column - Charts */}
            <div className="lg:col-span-1 space-y-6">
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
            <div className="lg:col-span-1 space-y-6">
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
