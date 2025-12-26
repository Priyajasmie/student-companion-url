import { useEffect, useCallback, useRef } from 'react';
import { StudyTask } from './useStudyTasks';
import { toast } from 'sonner';

export const useNotifications = (tasks: StudyTask[]) => {
  const notifiedTasks = useRef<Set<string>>(new Set());

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }, []);

  const sendNotification = useCallback((title: string, body: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'study-reminder',
        requireInteraction: true,
      });
    }
    
    // Also show toast
    toast.info(title, { description: body });
  }, []);

  const checkAlarms = useCallback(() => {
    const now = new Date();
    
    tasks.forEach((task) => {
      if (!task.alarm_enabled || task.is_completed) return;
      if (notifiedTasks.current.has(task.id)) return;

      const startTime = new Date(task.start_time);
      const timeDiff = startTime.getTime() - now.getTime();
      
      // Notify 5 minutes before
      if (timeDiff > 0 && timeDiff <= 5 * 60 * 1000) {
        notifiedTasks.current.add(task.id);
        sendNotification(
          `📚 Upcoming: ${task.subject_name}`,
          `Starting in ${Math.ceil(timeDiff / 60000)} minutes`
        );
      }
      
      // Notify at start time
      if (timeDiff <= 0 && timeDiff > -60000) {
        notifiedTasks.current.add(task.id);
        sendNotification(
          `🔔 Time to Study: ${task.subject_name}`,
          `Your study session is starting now!`
        );
      }
    });
  }, [tasks, sendNotification]);

  // Check alarms every minute
  useEffect(() => {
    requestPermission();
    
    const interval = setInterval(checkAlarms, 30000);
    checkAlarms(); // Check immediately
    
    return () => clearInterval(interval);
  }, [checkAlarms, requestPermission]);

  return { requestPermission, sendNotification };
};
