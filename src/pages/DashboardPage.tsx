import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Calendar, Sparkles, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useApplications } from '@/hooks/useApplications';
import { useBookmarks } from '@/hooks/useBookmarks';
import OpportunityCard from '@/components/OpportunityCard';
import { CAREER_GOAL_LABELS } from '@/lib/types';
import type { Opportunity } from '@/lib/types';

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5"
    >
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const { opportunities } = useOpportunities();
  const { applications, apply, hasApplied } = useApplications(user?.id);
  const { isBookmarked, toggle } = useBookmarks(user?.id);

  // Simple career matching: opportunities that include user's career goal
  const topMatches = useMemo(() => {
    if (!profile?.career_goal) return opportunities.slice(0, 4).map(opp => ({ opp, match: 0 }));
    const scored = opportunities.map(opp => {
      const match = opp.career_categories.includes(profile.career_goal) ? 90 : 30;
      return { opp, match };
    });
    scored.sort((a, b) => b.match - a.match);
    return scored.slice(0, 4);
  }, [opportunities, profile?.career_goal]);

  const upcomingDeadlines = useMemo(() => {
    return opportunities
      .filter(o => o.deadline && new Date(o.deadline) > new Date())
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
      .slice(0, 3);
  }, [opportunities]);

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          {profile?.career_goal ? `Tracking opportunities in ${CAREER_GOAL_LABELS[profile.career_goal]}` : 'Set your career goal to get personalized matches'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={ClipboardList} label="Applications" value={applications.length} color="bg-blue-500/20 text-blue-400" />
        <StatCard icon={Calendar} label="Upcoming Deadlines" value={upcomingDeadlines.length} color="bg-orange-500/20 text-orange-400" />
        <StatCard icon={Sparkles} label="Top Matches" value={topMatches.length} color="bg-purple-500/20 text-purple-400" />
        <StatCard icon={TrendingUp} label="Opportunities" value={opportunities.length} color="bg-green-500/20 text-green-400" />
      </div>

      {/* Top Matches */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> Top Matches for You
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {topMatches.map(({ opp, match }) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              isBookmarked={isBookmarked(opp.id)}
              hasApplied={hasApplied(opp.id)}
              onApply={() => apply(opp.id)}
              onToggleBookmark={() => toggle(opp.id)}
              matchScore={match}
            />
          ))}
        </div>
      </div>

      {/* Upcoming Deadlines */}
      {upcomingDeadlines.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-400" /> Upcoming Deadlines
          </h2>
          <div className="space-y-3">
            {upcomingDeadlines.map(opp => (
              <div key={opp.id} className="glass rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{opp.title}</p>
                  <p className="text-sm text-muted-foreground">{opp.company}</p>
                </div>
                <span className="text-sm text-orange-400 font-medium">
                  {new Date(opp.deadline!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
