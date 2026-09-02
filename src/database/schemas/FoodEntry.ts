export interface FoodEntry {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  createdAt: string;
}

export type NewFoodEntry = Omit<FoodEntry, 'id' | 'createdAt'>;
