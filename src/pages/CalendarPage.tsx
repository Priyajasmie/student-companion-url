import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon } from 'lucide-react';

const CalendarPage: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <h1 className="text-2xl font-bold mb-6">Calendar</h1>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          Study Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center py-12 text-muted-foreground">
        <p>Calendar view coming soon! Check your tasks and exams pages for now.</p>
      </CardContent>
    </Card>
  </div>
);

export default CalendarPage;
