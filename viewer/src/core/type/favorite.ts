export interface FavoritePrompt {
  categories: PromptCategory[];
}

export interface PromptCategory {
  id: number;
  label: string;
  children: CategoryChild[];
}
export interface CategoryChild {
  id: number;
  label: string;
  value: string;
}
