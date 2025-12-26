import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PomodoroState {
  isActive: boolean;
  isBreak: boolean;
  timeLeft: number;
  sessionsCompleted: number;
  workDuration: number;
  breakDuration: number;
}

export const usePomodoro = () => {
  const { user } = useAuth();
  const [state, setState] = useState<PomodoroState>({
    isActive: false,
    isBreak: false,
    timeLeft: 25 * 60,
    sessionsCompleted: 0,
    workDuration: 25,
    breakDuration: 5,
  });

  // Load saved session on mount
  useEffect(() => {
    const loadSession = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('pomodoro_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setState(prev => ({
          ...prev,
          sessionsCompleted: data.sessions_completed,
          workDuration: data.duration_minutes,
          breakDuration: data.break_minutes,
        }));
      }
    };

    loadSession();
  }, [user]);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.isActive && state.timeLeft > 0) {
      interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    } else if (state.isActive && state.timeLeft === 0) {
      // Timer completed
      if (state.isBreak) {
        // Break finished, start new work session
        toast.success('Break over! Time to focus!');
        setState(prev => ({
          ...prev,
          isBreak: false,
          timeLeft: prev.workDuration * 60,
          isActive: false,
        }));
      } else {
        // Work session finished
        toast.success('Great job! Take a break!');
        const newSessionsCompleted = state.sessionsCompleted + 1;
        setState(prev => ({
          ...prev,
          isBreak: true,
          timeLeft: prev.breakDuration * 60,
          sessionsCompleted: newSessionsCompleted,
          isActive: false,
        }));
        // Save to database
        saveSession(newSessionsCompleted);
      }
      
      // Play notification sound
      playNotificationSound();
    }

    return () => clearInterval(interval);
  }, [state.isActive, state.timeLeft, state.isBreak]);

  const saveSession = async (sessionsCompleted: number) => {
    if (!user) return;

    await supabase
      .from('pomodoro_sessions')
      .upsert({
        user_id: user.id,
        sessions_completed: sessionsCompleted,
        duration_minutes: state.workDuration,
        break_minutes: state.breakDuration,
        is_active: false,
      });
  };

  const playNotificationSound = () => {
    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio not available');
    }
  };

  const start = useCallback(() => {
    setState(prev => ({ ...prev, isActive: true }));
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isActive: false }));
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false,
      isBreak: false,
      timeLeft: prev.workDuration * 60,
    }));
  }, []);

  const skipBreak = useCallback(() => {
    setState(prev => ({
      ...prev,
      isBreak: false,
      timeLeft: prev.workDuration * 60,
      isActive: false,
    }));
  }, []);

  const setDurations = useCallback((work: number, breakTime: number) => {
    setState(prev => ({
      ...prev,
      workDuration: work,
      breakDuration: breakTime,
      timeLeft: prev.isBreak ? breakTime * 60 : work * 60,
    }));
  }, []);

  return {
    ...state,
    start,
    pause,
    reset,
    skipBreak,
    setDurations,
  };
};
