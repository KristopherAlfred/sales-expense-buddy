import type { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Opportunity = Database['public']['Tables']['opportunities']['Row'];
export type Application = Database['public']['Tables']['applications']['Row'];
export type Bookmark = Database['public']['Tables']['bookmarks']['Row'];

export type CareerGoal = Database['public']['Enums']['career_goal'];
export type ApplicationStatus = Database['public']['Enums']['application_status'];
export type OpportunityType = Database['public']['Enums']['opportunity_type'];

export const CAREER_GOAL_LABELS: Record<CareerGoal, string> = {
  acting: '🎭 Acting',
  music: '🎵 Music',
  marketing: '📈 Marketing',
  film: '🎬 Film',
  dance: '💃 Dance',
  writing: '✍️ Writing',
  design: '🎨 Design',
  other: '✨ Other',
};

export const OPPORTUNITY_TYPE_LABELS: Record<OpportunityType, string> = {
  casting_call: 'Casting Call',
  internship: 'Internship',
  gig: 'Gig',
  audition: 'Audition',
  fellowship: 'Fellowship',
  workshop: 'Workshop',
};

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: 'Applied',
  pending: 'Pending',
  interview: 'Interview',
  rejected: 'Rejected',
  accepted: 'Accepted',
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  applied: 'bg-blue-500/20 text-blue-400',
  pending: 'bg-yellow-500/20 text-yellow-400',
  interview: 'bg-purple-500/20 text-purple-400',
  rejected: 'bg-red-500/20 text-red-400',
  accepted: 'bg-green-500/20 text-green-400',
};
