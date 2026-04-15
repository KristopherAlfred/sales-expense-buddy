import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, MessageSquare, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useApplications';
import { supabase } from '@/integrations/supabase/client';
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/types';
import type { ApplicationStatus, Opportunity } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function TrackerPage() {
  const { user } = useAuth();
  const { applications, loading, updateStatus, updateNotes } = useApplications(user?.id);
  const { toast } = useToast();
  const [opportunityMap, setOpportunityMap] = useState<Record<string, Opportunity>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});

  // Fetch opportunity details for applications
  useEffect(() => {
    if (applications.length === 0) return;
    const ids = applications.map(a => a.opportunity_id);
    supabase
      .from('opportunities')
      .select('*')
      .in('id', ids)
      .then(({ data }) => {
        if (data) {
          const map: Record<string, Opportunity> = {};
          data.forEach(o => { map[o.id] = o; });
          setOpportunityMap(map);
        }
      });
  }, [applications]);

  const handleStatusChange = async (appId: string, status: string) => {
    const { error } = await updateStatus(appId, status as ApplicationStatus);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
  };

  const handleSaveNotes = async (appId: string) => {
    const { error } = await updateNotes(appId, editingNotes[appId] ?? '');
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Notes saved' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Application Tracker</h1>
        <p className="text-muted-foreground mt-1">Manage and track your applications</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass rounded-2xl p-6 animate-pulse h-24" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No applications yet</p>
          <p className="text-sm mt-1">Browse opportunities and start applying!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map(app => {
            const opp = opportunityMap[app.opportunity_id];
            const isExpanded = expandedId === app.id;

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-2xl overflow-hidden"
              >
                <div
                  className="p-5 flex items-center justify-between cursor-pointer"
                  onClick={() => {
                    setExpandedId(isExpanded ? null : app.id);
                    if (!isExpanded && !(app.id in editingNotes)) {
                      setEditingNotes(prev => ({ ...prev, [app.id]: app.notes ?? '' }));
                    }
                  }}
                >
                  <div className="flex-1">
                    <p className="font-semibold">{opp?.title ?? 'Loading...'}</p>
                    <p className="text-sm text-muted-foreground">{opp?.company}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`${STATUS_COLORS[app.status]} border-0 text-xs`}>
                      {STATUS_LABELS[app.status]}
                    </Badge>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-5 pb-5 space-y-4 border-t border-border/50"
                  >
                    <div className="pt-4 grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Status</label>
                        <Select value={app.status} onValueChange={(v) => handleStatusChange(app.id, v)}>
                          <SelectTrigger className="bg-secondary/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(STATUS_LABELS).map(([k, v]) => (
                              <SelectItem key={k} value={k}>{v}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Applied</label>
                        <p className="text-sm py-2">
                          {new Date(app.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" /> Notes
                      </label>
                      <Textarea
                        value={editingNotes[app.id] ?? ''}
                        onChange={e => setEditingNotes(prev => ({ ...prev, [app.id]: e.target.value }))}
                        placeholder="Add personal notes about this application..."
                        className="bg-secondary/50 border-border/50 min-h-[80px]"
                      />
                      <Button size="sm" className="mt-2" onClick={() => handleSaveNotes(app.id)}>
                        Save Notes
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
