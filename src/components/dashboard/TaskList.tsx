import React, { useState } from 'react';
import { useStudyTasks, StudyTask } from '@/hooks/useStudyTasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Clock, 
  Bell, 
  BellOff,
  Trash2,
  Edit,
  MoreVertical 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import TaskDialog from './TaskDialog';
import { cn } from '@/lib/utils';

interface TaskListProps {
  showAll?: boolean;
  maxItems?: number;
}

const TaskList: React.FC<TaskListProps> = ({ showAll = false, maxItems = 5 }) => {
  const { tasks, isLoading, updateTask, deleteTask } = useStudyTasks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<StudyTask | null>(null);

  const displayTasks = showAll ? tasks : tasks.slice(0, maxItems);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleToggleComplete = (task: StudyTask) => {
    updateTask.mutate({ id: task.id, is_completed: !task.is_completed });
  };

  const handleToggleAlarm = (task: StudyTask) => {
    updateTask.mutate({ id: task.id, alarm_enabled: !task.alarm_enabled });
  };

  const handleEdit = (task: StudyTask) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTask.mutate(id);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingTask(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded-lg" />
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
          <CardTitle className="text-lg font-semibold">Study Tasks</CardTitle>
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add Task
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {displayTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No tasks yet. Add your first study task!</p>
            </div>
          ) : (
            displayTasks.map((task, index) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border bg-card transition-all duration-200 hover:shadow-md animate-fade-in",
                  task.is_completed && "opacity-60"
                )}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Checkbox
                  checked={task.is_completed}
                  onCheckedChange={() => handleToggleComplete(task)}
                  className="shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "font-medium truncate",
                      task.is_completed && "line-through"
                    )}>
                      {task.subject_name}
                    </span>
                    <Badge variant="outline" className={cn("text-xs", getPriorityColor(task.priority))}>
                      {task.priority}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>
                      {format(new Date(task.start_time), 'MMM d, h:mm a')} - 
                      {format(new Date(task.end_time), 'h:mm a')}
                    </span>
                    {task.alarm_enabled && (
                      <Bell className="w-3 h-3 text-primary" />
                    )}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleToggleAlarm(task)}>
                      {task.alarm_enabled ? (
                        <><BellOff className="w-4 h-4 mr-2" /> Disable Alarm</>
                      ) : (
                        <><Bell className="w-4 h-4 mr-2" /> Enable Alarm</>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(task)}>
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(task.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        editTask={editingTask}
      />
    </>
  );
};

export default TaskList;
