import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { DayHistoryCard } from './DayHistoryCard';
import { DailyHistoryEntry, FoodEntry, MacroGoals } from '@/database';
import { Colors } from '@/shared/constants/theme';

const goals: MacroGoals = { calories: 2000, protein: 150, carbs: 250, fat: 65, fiber: 25 };

function makeEntry(id: number, overrides: Partial<FoodEntry> = {}): FoodEntry {
  return {
    id,
    name: `Food ${id}`,
    calories: 100,
    protein: 5,
    carbs: 10,
    fat: 2,
    fiber: 1,
    createdAt: '2026-07-10T10:00:00.000Z',
    ...overrides,
  };
}

function makeDay(overrides: Partial<DailyHistoryEntry> = {}): DailyHistoryEntry {
  return {
    dayStart: new Date(2026, 6, 10, 0, 0, 0, 0),
    totals: { calories: 800, protein: 30, carbs: 60, fat: 20, fiber: 5 },
    entries: [makeEntry(1), makeEntry(2)],
    ...overrides,
  };
}

describe('DayHistoryCard', () => {
  it('renders totals for a day with entries', () => {
    render(<DayHistoryCard day={makeDay()} goals={goals} />);

    expect(screen.getByText('800 kcal')).toBeTruthy();
    expect(screen.getByText('40%')).toBeTruthy();
    expect(screen.getByText('1200 kcal restantes')).toBeTruthy();
    expect(screen.getByText('Proteína: 30.0g')).toBeTruthy();
    expect(screen.getByText('Carboidratos: 60.0g')).toBeTruthy();
    expect(screen.getByText('Gordura: 20.0g')).toBeTruthy();
    expect(screen.getByText('Fibra: 5.0g')).toBeTruthy();
  });

  it('renders the empty-day state for a day with zero entries', () => {
    const emptyDay = makeDay({
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
      entries: [],
    });

    render(<DayHistoryCard day={emptyDay} goals={goals} />);

    expect(screen.getByText('Nenhum alimento registrado')).toBeTruthy();
  });

  it('expands to reveal food entries on tap and collapses on a second tap', () => {
    render(<DayHistoryCard day={makeDay()} goals={goals} />);

    expect(screen.queryByText('Food 1')).toBeNull();
    expect(screen.queryByText('Food 2')).toBeNull();

    fireEvent.press(screen.getByTestId('day-history-header'));

    expect(screen.getByText('Food 1')).toBeTruthy();
    expect(screen.getByText('Food 2')).toBeTruthy();
    expect(screen.queryByText('✕')).toBeNull();

    fireEvent.press(screen.getByTestId('day-history-header'));

    expect(screen.queryByText('Food 1')).toBeNull();
    expect(screen.queryByText('Food 2')).toBeNull();
  });

  it('visually distinguishes a day exceeding the goal from one that does not', () => {
    const exceededDay = makeDay({ totals: { calories: 2500, protein: 30, carbs: 60, fat: 20, fiber: 5 } });
    const withinGoalDay = makeDay({ totals: { calories: 1000, protein: 30, carbs: 60, fat: 20, fiber: 5 } });

    const { unmount } = render(<DayHistoryCard day={exceededDay} goals={goals} />);
    expect(screen.getByTestId('calorie-percentage')).toHaveStyle({ color: Colors.danger });
    unmount();

    render(<DayHistoryCard day={withinGoalDay} goals={goals} />);
    expect(screen.getByTestId('calorie-percentage')).not.toHaveStyle({ color: Colors.danger });
  });

  it('renders 0% instead of crashing when goals.calories is 0', () => {
    const zeroGoal: MacroGoals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    const zeroDay = makeDay({
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
      entries: [],
    });

    render(<DayHistoryCard day={zeroDay} goals={zeroGoal} />);

    expect(screen.getByTestId('calorie-percentage')).toHaveTextContent('0%');
  });
});
