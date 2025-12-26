import React from 'react';
import { usePomodoro } from '@/hooks/usePomodoro';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, SkipForward, Timer, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PomodoroTimerProps {
  compact?: boolean;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ compact = false }) => {
  const {
    isActive,
    isBreak,
    timeLeft,
    sessionsCompleted,
    workDuration,
    breakDuration,
    start,
    pause,
    reset,
    skipBreak,
  } = usePomodoro();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = isBreak ? breakDuration * 60 : workDuration * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  if (compact) {
    return (
      <Card className={cn(
        "overflow-hidden",
        isBreak ? "bg-gradient-to-br from-success/10 to-success/5" : "bg-gradient-to-br from-primary/10 to-primary/5"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isBreak ? "bg-success/20" : "bg-primary/20"
              )}>
                {isBreak ? (
                  <Coffee className={cn("w-5 h-5", isBreak ? "text-success" : "text-primary")} />
                ) : (
                  <Timer className="w-5 h-5 text-primary" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {isBreak ? 'Break Time' : 'Focus Mode'}
                </p>
                <p className="text-2xl font-bold tabular-nums">{formatTime(timeLeft)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant={isActive ? 'secondary' : 'default'}
                onClick={isActive ? pause : start}
              >
                {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button size="icon" variant="outline" onClick={reset}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg font-semibold flex items-center justify-center gap-2">
          <Timer className="w-5 h-5 text-primary" />
          Pomodoro Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Circle */}
        <div className="relative mx-auto w-48 h-48">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              className="stroke-muted"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="8"
            />
            <circle
              className={cn(
                "transition-all duration-1000",
                isBreak ? "stroke-success" : "stroke-primary"
              )}
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.83} 283`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold tabular-nums">{formatTime(timeLeft)}</span>
            <span className="text-sm text-muted-foreground">
              {isBreak ? 'Break' : 'Focus'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          <Button
            size="lg"
            variant={isActive ? 'secondary' : 'gradient'}
            onClick={isActive ? pause : start}
            className="w-32"
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start
              </>
            )}
          </Button>
          <Button size="lg" variant="outline" onClick={reset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
          {isBreak && (
            <Button size="lg" variant="outline" onClick={skipBreak}>
              <SkipForward className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{sessionsCompleted}</p>
            <p className="text-xs text-muted-foreground">Sessions Done</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{workDuration}</p>
            <p className="text-xs text-muted-foreground">Focus (min)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{breakDuration}</p>
            <p className="text-xs text-muted-foreground">Break (min)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroTimer;
