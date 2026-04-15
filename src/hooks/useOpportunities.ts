import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Opportunity, OpportunityType, CareerGoal } from '@/lib/types';

export function useOpportunities(filters?: { type?: OpportunityType; location?: string; career?: CareerGoal }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunities = async () => {
      let query = supabase.from('opportunities').select('*').order('created_at', { ascending: false });
      
      if (filters?.type) query = query.eq('type', filters.type);
      if (filters?.location) query = query.ilike('location', `%${filters.location}%`);
      if (filters?.career) query = query.contains('career_categories', [filters.career]);
      
      const { data } = await query;
      setOpportunities(data ?? []);
      setLoading(false);
    };

    fetchOpportunities();
  }, [filters?.type, filters?.location, filters?.career]);

  return { opportunities, loading };
}
