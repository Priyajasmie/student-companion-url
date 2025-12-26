import React from 'react';
import PomodoroTimer from '@/components/dashboard/PomodoroTimer';

const PomodoroPage: React.FC = () => (
  <div className="max-w-md mx-auto">
    <h1 className="text-2xl font-bold mb-6 text-center">Focus Timer</h1>
    <PomodoroTimer />
  </div>
);

export default PomodoroPage;
