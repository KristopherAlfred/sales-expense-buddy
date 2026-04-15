import { motion } from 'framer-motion';
import { MapPin, Calendar, Bookmark, BookmarkCheck, Briefcase, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Opportunity } from '@/lib/types';
import { OPPORTUNITY_TYPE_LABELS, CAREER_GOAL_LABELS } from '@/lib/types';

interface Props {
  opportunity: Opportunity;
  isBookmarked: boolean;
  hasApplied: boolean;
  onApply: () => void;
  onToggleBookmark: () => void;
  matchScore?: number;
}

export default function OpportunityCard({ opportunity, isBookmarked, hasApplied, onApply, onToggleBookmark, matchScore }: Props) {
  const daysUntilDeadline = opportunity.deadline
    ? Math.ceil((new Date(opportunity.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 hover:border-primary/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-xs font-medium">
              {OPPORTUNITY_TYPE_LABELS[opportunity.type]}
            </Badge>
            {opportunity.is_featured && (
              <Badge className="text-xs bg-primary/20 text-primary border-0">
                <Sparkles className="w-3 h-3 mr-1" /> Featured
              </Badge>
            )}
            {matchScore !== undefined && matchScore > 0 && (
              <Badge className="text-xs bg-green-500/20 text-green-400 border-0">
                {matchScore}% match
              </Badge>
            )}
          </div>
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
            {opportunity.title}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <Briefcase className="w-3.5 h-3.5" /> {opportunity.company}
          </p>
        </div>
        <button
          onClick={onToggleBookmark}
          className="text-muted-foreground hover:text-primary transition-colors p-1"
        >
          {isBookmarked ? <BookmarkCheck className="w-5 h-5 text-primary" /> : <Bookmark className="w-5 h-5" />}
        </button>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {opportunity.ai_summary || opportunity.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {opportunity.career_categories.map(cat => (
          <span key={cat} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
            {CAREER_GOAL_LABELS[cat]}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {opportunity.location}
          </span>
          {daysUntilDeadline !== null && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {daysUntilDeadline > 0 ? `${daysUntilDeadline}d left` : 'Expired'}
            </span>
          )}
        </div>
        <Button
          size="sm"
          onClick={onApply}
          disabled={hasApplied}
          variant={hasApplied ? 'secondary' : 'default'}
        >
          {hasApplied ? 'Applied' : 'Apply'}
        </Button>
      </div>
    </motion.div>
  );
}
