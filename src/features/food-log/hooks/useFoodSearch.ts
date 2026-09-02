import { useState } from 'react';
import { FOOD_DATABASE, FoodDatabaseEntry } from '../data/foodDatabase';

const normalize = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

interface CalculatedMacros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface UseFoodSearchReturn {
  query: string;
  results: FoodDatabaseEntry[];
  selectedFood: FoodDatabaseEntry | null;
  grams: string;
  isDropdownVisible: boolean;
  calculatedMacros: CalculatedMacros | null;
  handleQueryChange: (text: string) => void;
  handleSelectFood: (food: FoodDatabaseEntry) => void;
  handleGramsChange: (text: string) => void;
  handleClear: () => void;
}

export function useFoodSearch(): UseFoodSearchReturn {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodDatabaseEntry[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodDatabaseEntry | null>(null);
  const [grams, setGrams] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  function handleQueryChange(text: string) {
    setQuery(text);
    setSelectedFood(null);
    if (text.trim().length === 0) {
      setResults([]);
      setIsDropdownVisible(false);
      return;
    }
    const needle = normalize(text.trim());
    const filtered = FOOD_DATABASE.filter(f => normalize(f.name).includes(needle));
    setResults(filtered);
    setIsDropdownVisible(true);
  }

  function handleSelectFood(food: FoodDatabaseEntry) {
    setSelectedFood(food);
    setQuery(food.name);
    setIsDropdownVisible(false);
    setGrams('');
  }

  function handleGramsChange(text: string) {
    setGrams(text);
  }

  function handleClear() {
    setQuery('');
    setResults([]);
    setSelectedFood(null);
    setGrams('');
    setIsDropdownVisible(false);
  }

  let calculatedMacros: CalculatedMacros | null = null;
  const g = parseFloat(grams);
  if (selectedFood && grams && !isNaN(g) && g > 0) {
    const ratio = g / 100;
    const p = selectedFood.per100g;
    calculatedMacros = {
      calories: Math.round(p.calories * ratio),
      protein:  Math.round(p.protein  * ratio * 10) / 10,
      carbs:    Math.round(p.carbs    * ratio * 10) / 10,
      fat:      Math.round(p.fat      * ratio * 10) / 10,
      fiber:    Math.round(p.fiber    * ratio * 10) / 10,
    };
  }

  return {
    query,
    results,
    selectedFood,
    grams,
    isDropdownVisible,
    calculatedMacros,
    handleQueryChange,
    handleSelectFood,
    handleGramsChange,
    handleClear,
  };
}
