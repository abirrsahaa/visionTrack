export interface GoalDecomposition {
  milestones: {
    title: string;
    target_date?: string; // ISO date string
    sort_order: number;
  }[];
  todos: {
    title: string;
    description?: string;
    scheduled_week: number; // 1-4 relative to start
  }[];
}

export interface DomainSuggestion {
  name: string;
  description: string;
  reasoning: string;
}

export interface DesignBoardPreview {
  design_style: string;
  description: string;
  layout_config: any; // Simplified for now
}
