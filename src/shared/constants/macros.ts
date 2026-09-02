export type MacroKey = 'calories' | 'protein' | 'carbs' | 'fat' | 'fiber';

export const DAILY_GOALS: Record<MacroKey, number> = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 65,
  fiber: 25,
};

export const MACRO_LABELS: Record<MacroKey, string> = {
  calories: 'Calorias',
  protein: 'Proteína',
  carbs: 'Carboidratos',
  fat: 'Gordura',
  fiber: 'Fibra',
};

export const MACRO_UNITS: Record<MacroKey, string> = {
  calories: 'kcal',
  protein: 'g',
  carbs: 'g',
  fat: 'g',
  fiber: 'g',
};

export const MACRO_COLORS: Record<MacroKey, string> = {
  calories: '#F59E0B',
  protein: '#34D399',
  carbs: '#FB7185',
  fat: '#A78BFA',
  fiber: '#38BDF8',
};
