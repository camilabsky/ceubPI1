export type AppPage = 'home' | 'dashboard' | 'explore' | 'tasks' | 'my-tasks' | 'rewards' | 'profile';

export type AdminTaskStatusFilter = 'pending_review' | 'proof_submitted' | 'completed';

export interface AdminNavigationIntent {
  taskStatusFilter?: AdminTaskStatusFilter;
  openCreateTask?: boolean;
  focusTaskId?: number;
  focusRewardHistory?: boolean;
  editGarden?: boolean;
}
