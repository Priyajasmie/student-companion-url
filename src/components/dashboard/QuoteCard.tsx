import React from 'react';
import { useDailyQuote } from '@/hooks/useDailyQuote';
import { Card, CardContent } from '@/components/ui/card';
import { Quote, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const QuoteCard: React.FC = () => {
  const { quote, isLoading } = useDailyQuote();

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (!quote) return null;

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-primary/10 shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-2">
              <Quote className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
              <p className="text-sm md:text-base font-medium leading-relaxed">
                {quote.quote}
              </p>
            </div>
            <p className="text-sm text-muted-foreground text-right">
              — {quote.author}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteCard;
