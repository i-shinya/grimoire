export interface Favorite {
  categories: FavoriteCategory[];
}

export interface FavoriteCategory {
  id: number;
  label: string;
  children: CategoryChild[];
}
export interface CategoryChild {
  id: number;
  label: string;
  value: string;
}
