import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Profile, CareerGoal } from '@/lib/types';

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [userId]);

  const updateProfile = async (updates: { full_name?: string; career_goal?: CareerGoal; bio?: string }) => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    if (data) setProfile(data);
    return { error };
  };

  return { profile, loading, updateProfile };
}
