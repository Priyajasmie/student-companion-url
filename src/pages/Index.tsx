import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle, Timer, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative container mx-auto px-4 py-16 min-h-screen flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl gradient-primary shadow-glow">
              <BookOpen className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Student Study Companion
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            Your personal study partner. Plan tasks, track exams, stay focused, and achieve your academic goals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="xl" variant="gradient">
              <Link to="/auth">Get Started Free</Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {[
              { icon: CheckCircle, title: 'Study Planner', desc: 'Organize tasks with priorities' },
              { icon: GraduationCap, title: 'Exam Countdown', desc: 'Never miss an exam date' },
              { icon: Timer, title: 'Focus Timer', desc: 'Pomodoro technique built-in' },
              { icon: BookOpen, title: 'Daily Motivation', desc: 'Inspiring quotes daily' },
            ].map((feature, i) => (
              <div key={i} className="p-4 rounded-xl bg-card/50 border animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <feature.icon className="w-8 h-8 text-primary mb-2" />
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
