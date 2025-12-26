import React, { useState, useEffect } from 'react';
import { useExams, Exam } from '@/hooks/useExams';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, GraduationCap, Trash2, Calendar } from 'lucide-react';
import ExamDialog from './ExamDialog';
import { cn } from '@/lib/utils';

interface ExamCountdownProps {
  showAll?: boolean;
  maxItems?: number;
}

const ExamCountdown: React.FC<ExamCountdownProps> = ({ showAll = false, maxItems = 3 }) => {
  const { exams, isLoading, deleteExam } = useExams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const upcomingExams = exams
    .filter(exam => new Date(exam.exam_date) > now)
    .sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime());

  const displayExams = showAll ? upcomingExams : upcomingExams.slice(0, maxItems);

  const getCountdown = (examDate: string) => {
    const diff = new Date(examDate).getTime() - now.getTime();
    
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 3) return 'from-destructive/20 to-destructive/5 border-destructive/30';
    if (days <= 7) return 'from-warning/20 to-warning/5 border-warning/30';
    return 'from-primary/20 to-primary/5 border-primary/30';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-24 bg-muted rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            Exam Countdown
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add Exam
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {displayExams.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No upcoming exams. Add one to track!</p>
            </div>
          ) : (
            displayExams.map((exam, index) => {
              const countdown = getCountdown(exam.exam_date);
              return (
                <div
                  key={exam.id}
                  className={cn(
                    "p-4 rounded-xl border bg-gradient-to-r transition-all duration-200 hover:shadow-md animate-fade-in",
                    getUrgencyColor(countdown.days)
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{exam.exam_name}</h3>
                      <Badge variant="secondary" className="mt-1">
                        {exam.subject}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => deleteExam.mutate(exam.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { label: 'Days', value: countdown.days },
                      { label: 'Hours', value: countdown.hours },
                      { label: 'Mins', value: countdown.minutes },
                      { label: 'Secs', value: countdown.seconds },
                    ].map((item) => (
                      <div key={item.label} className="bg-background/50 rounded-lg p-2">
                        <div className="text-xl font-bold tabular-nums">{item.value}</div>
                        <div className="text-xs text-muted-foreground">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <ExamDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
};

export default ExamCountdown;
