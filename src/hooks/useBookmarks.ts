import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useBookmarks(userId: string | undefined) {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    const { data } = await supabase
      .from('bookmarks')
      .select('opportunity_id')
      .eq('user_id', userId);
    setBookmarkedIds(new Set((data ?? []).map(b => b.opportunity_id)));
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchBookmarks(); }, [fetchBookmarks]);

  const toggle = async (opportunityId: string) => {
    if (!userId) return;
    if (bookmarkedIds.has(opportunityId)) {
      await supabase.from('bookmarks').delete().eq('user_id', userId).eq('opportunity_id', opportunityId);
    } else {
      await supabase.from('bookmarks').insert({ user_id: userId, opportunity_id: opportunityId });
    }
    await fetchBookmarks();
  };

  return { bookmarkedIds, loading, toggle, isBookmarked: (id: string) => bookmarkedIds.has(id) };
}
