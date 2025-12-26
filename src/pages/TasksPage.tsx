import React from 'react';
import TaskList from '@/components/dashboard/TaskList';

const TasksPage: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <h1 className="text-2xl font-bold mb-6">Study Tasks</h1>
    <TaskList showAll />
  </div>
);

export default TasksPage;
