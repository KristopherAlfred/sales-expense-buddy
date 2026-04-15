import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Application, ApplicationStatus } from '@/lib/types';

export function useApplications(userId: string | undefined) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    const { data } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    setApplications(data ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const apply = async (opportunityId: string) => {
    if (!userId) return { error: new Error('Not authenticated') };
    const { error } = await supabase.from('applications').insert({
      user_id: userId,
      opportunity_id: opportunityId,
    });
    if (!error) await fetchApplications();
    return { error };
  };

  const updateStatus = async (applicationId: string, status: ApplicationStatus) => {
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId);
    if (!error) await fetchApplications();
    return { error };
  };

  const updateNotes = async (applicationId: string, notes: string) => {
    const { error } = await supabase
      .from('applications')
      .update({ notes })
      .eq('id', applicationId);
    if (!error) await fetchApplications();
    return { error };
  };

  const hasApplied = (opportunityId: string) => {
    return applications.some(a => a.opportunity_id === opportunityId);
  };

  return { applications, loading, apply, updateStatus, updateNotes, hasApplied };
}
