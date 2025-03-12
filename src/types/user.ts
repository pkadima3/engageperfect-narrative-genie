
export interface UserProfile {
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt?: string;
  plan_type?: string;
  selected_plan?: string;
  requests_limit?: number;
  requests_used?: number;
  reset_date?: string;
  has_used_trial?: boolean;
  trial_end_date?: string | null;
  trial_pending?: boolean;
}
