import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useStudyTasks } from '@/hooks/useStudyTasks';
import { useExams } from '@/hooks/useExams';
import { usePomodoro } from '@/hooks/usePomodoro';
import { BookOpen, GraduationCap, Timer, CheckCircle } from 'lucide-react';

const StatsCards: React.FC = () => {
  const { tasks } = useStudyTasks();
  const { exams } = useExams();
  const { sessionsCompleted } = usePomodoro();

  const todayTasks = tasks.filter(task => {
    const today = new Date();
    const taskDate = new Date(task.start_time);
    return taskDate.toDateString() === today.toDateString();
  });

  const completedTasks = tasks.filter(task => task.is_completed).length;
  
  const upcomingExams = exams.filter(exam => {
    const examDate = new Date(exam.exam_date);
    return examDate > new Date();
  });

  const stats = [
    {
      label: "Today's Tasks",
      value: todayTasks.length,
      icon: BookOpen,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Completed',
      value: completedTasks,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Upcoming Exams',
      value: upcomingExams.length,
      icon: GraduationCap,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Focus Sessions',
      value: sessionsCompleted,
      icon: Timer,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={stat.label} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
