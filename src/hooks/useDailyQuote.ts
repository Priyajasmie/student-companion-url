import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DailyQuote {
  id: string;
  quote: string;
  author: string;
  category: string | null;
}

export const useDailyQuote = () => {
  const { data: quote, isLoading } = useQuery({
    queryKey: ['daily-quote', new Date().toDateString()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_quotes')
        .select('*')
        .limit(1);
      
      if (error) throw error;
      
      // Get a quote based on the day of the year for variety
      const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
      );
      
      const { data: allQuotes } = await supabase.from('daily_quotes').select('*');
      if (allQuotes && allQuotes.length > 0) {
        const index = dayOfYear % allQuotes.length;
        return allQuotes[index] as DailyQuote;
      }
      
      return data?.[0] as DailyQuote | null;
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  return { quote, isLoading };
};
