import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Exam {
  id: string;
  user_id: string;
  exam_name: string;
  subject: string;
  exam_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useExams = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: exams = [], isLoading } = useQuery({
    queryKey: ['exams', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('user_id', user.id)
        .order('exam_date', { ascending: true });
      
      if (error) throw error;
      return data as Exam[];
    },
    enabled: !!user,
  });

  const createExam = useMutation({
    mutationFn: async (exam: Omit<Exam, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('exams')
        .insert({ ...exam, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams', user?.id] });
      toast.success('Exam added successfully!');
    },
    onError: (error) => {
      toast.error('Failed to add exam: ' + error.message);
    },
  });

  const updateExam = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Exam> & { id: string }) => {
      const { data, error } = await supabase
        .from('exams')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams', user?.id] });
      toast.success('Exam updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update exam: ' + error.message);
    },
  });

  const deleteExam = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams', user?.id] });
      toast.success('Exam deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete exam: ' + error.message);
    },
  });

  return {
    exams,
    isLoading,
    createExam,
    updateExam,
    deleteExam,
  };
};
