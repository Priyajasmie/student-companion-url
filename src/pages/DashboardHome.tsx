import React from 'react';
import { useStudyTasks } from '@/hooks/useStudyTasks';
import { useNotifications } from '@/hooks/useNotifications';
import QuoteCard from '@/components/dashboard/QuoteCard';
import StatsCards from '@/components/dashboard/StatsCards';
import TaskList from '@/components/dashboard/TaskList';
import ExamCountdown from '@/components/dashboard/ExamCountdown';
import PomodoroTimer from '@/components/dashboard/PomodoroTimer';

const DashboardHome: React.FC = () => {
  const { tasks } = useStudyTasks();
  useNotifications(tasks);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">Ready to study? Here's your overview.</p>
      </div>

      <QuoteCard />
      <StatsCards />

      <div className="grid lg:grid-cols-2 gap-6">
        <TaskList maxItems={5} />
        <div className="space-y-6">
          <PomodoroTimer compact />
          <ExamCountdown maxItems={2} />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
