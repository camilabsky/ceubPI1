export type AppPage = 'home' | 'explore' | 'tasks' | 'rewards' | 'profile';

export type AdminTaskStatusFilter = 'available' | 'in_progress' | 'pending_review' | 'proof_submitted' | 'proof_pending' | 'completed';

export interface AdminNavigationIntent {
  taskStatusFilter?: AdminTaskStatusFilter;
  openCreateTask?: boolean;
  focusTaskId?: number;
  focusRewardHistory?: boolean;
  editGarden?: boolean;
}
