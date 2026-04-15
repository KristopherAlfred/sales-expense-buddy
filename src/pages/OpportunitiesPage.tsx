import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useApplications } from '@/hooks/useApplications';
import { useBookmarks } from '@/hooks/useBookmarks';
import OpportunityCard from '@/components/OpportunityCard';
import { OPPORTUNITY_TYPE_LABELS, CAREER_GOAL_LABELS } from '@/lib/types';
import type { OpportunityType, CareerGoal } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function OpportunitiesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [careerFilter, setCareerFilter] = useState<string>('all');

  const { opportunities, loading } = useOpportunities(
    typeFilter !== 'all' || careerFilter !== 'all'
      ? {
          type: typeFilter !== 'all' ? typeFilter as OpportunityType : undefined,
          career: careerFilter !== 'all' ? careerFilter as CareerGoal : undefined,
        }
      : undefined
  );
  const { apply, hasApplied } = useApplications(user?.id);
  const { isBookmarked, toggle } = useBookmarks(user?.id);

  const filtered = search
    ? opportunities.filter(o =>
        o.title.toLowerCase().includes(search.toLowerCase()) ||
        o.company.toLowerCase().includes(search.toLowerCase()) ||
        o.location.toLowerCase().includes(search.toLowerCase())
      )
    : opportunities;

  const handleApply = async (oppId: string) => {
    const { error } = await apply(oppId);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Applied!', description: 'Your application has been submitted.' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Opportunities</h1>
        <p className="text-muted-foreground mt-1">Discover casting calls, gigs, and internships</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search opportunities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full md:w-48 bg-secondary/50 border-border/50">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(OPPORTUNITY_TYPE_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={careerFilter} onValueChange={setCareerFilter}>
          <SelectTrigger className="w-full md:w-48 bg-secondary/50 border-border/50">
            <SelectValue placeholder="Career" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Careers</SelectItem>
            {Object.entries(CAREER_GOAL_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass rounded-2xl p-6 animate-pulse h-48" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No opportunities found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(opp => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              isBookmarked={isBookmarked(opp.id)}
              hasApplied={hasApplied(opp.id)}
              onApply={() => handleApply(opp.id)}
              onToggleBookmark={() => toggle(opp.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
