export interface RecipeItem {
  id: string;
  text: string;
  timestamp: number;
}

export interface Recipe {
  id: string;
  title: string;
  items: RecipeItem[];
  createdAt: string; // ISO date string
  verifiedByIsmet: boolean;
  verifiedAt?: string;
}

export type AppScreen = 'home' | 'create-title' | 'create-items' | 'ismet-review' | 'recipe-book';
