import React from 'react';
import ExamCountdown from '@/components/dashboard/ExamCountdown';

const ExamsPage: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <h1 className="text-2xl font-bold mb-6">Exam Countdown</h1>
    <ExamCountdown showAll />
  </div>
);

export default ExamsPage;
