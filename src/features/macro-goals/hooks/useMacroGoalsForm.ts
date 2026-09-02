import { useMacroGoals } from '@/database';

export function useMacroGoalsForm() {
  const { goals, updateGoals } = useMacroGoals();
  return { goals, updateGoals };
}
