import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { FoodHistoryScreen } from './FoodHistoryScreen';
import { useFoodHistory } from '../hooks/useFoodHistory';
import { useMacroGoals, DailyHistoryEntry } from '@/database';

jest.mock('../hooks/useFoodHistory');
jest.mock('@/database', () => ({
  useMacroGoals: jest.fn(),
}));
jest.mock('../components/DayHistoryCard', () => {
  const { Text } = require('react-native');
  return {
    DayHistoryCard: ({ day }: { day: DailyHistoryEntry }) => (
      <Text testID="day-card">{day.dayStart.toISOString()}</Text>
    ),
  };
});

const mockUseFoodHistory = useFoodHistory as jest.Mock;
const mockUseMacroGoals = useMacroGoals as jest.Mock;

function makeDay(isoDate: string): DailyHistoryEntry {
  return {
    dayStart: new Date(isoDate),
    totals: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    entries: [],
  };
}

describe('FoodHistoryScreen', () => {
  it('renders exactly 7 DayHistoryCards in the same order as the history array', () => {
    // Deliberately unsorted, to prove the screen does not re-sort (ordering is buildDailyHistory's job).
    const unsortedHistory = [
      makeDay('2026-07-06T00:00:00.000Z'),
      makeDay('2026-07-12T00:00:00.000Z'),
      makeDay('2026-07-08T00:00:00.000Z'),
      makeDay('2026-07-11T00:00:00.000Z'),
      makeDay('2026-07-07T00:00:00.000Z'),
      makeDay('2026-07-10T00:00:00.000Z'),
      makeDay('2026-07-09T00:00:00.000Z'),
    ];

    mockUseFoodHistory.mockReturnValue({ history: unsortedHistory, loading: false });
    mockUseMacroGoals.mockReturnValue({
      goals: { calories: 2000, protein: 150, carbs: 250, fat: 65, fiber: 25 },
    });

    render(<FoodHistoryScreen />);

    const cards = screen.getAllByTestId('day-card');
    expect(cards).toHaveLength(7);
    expect(cards.map((card) => card.props.children)).toEqual(
      unsortedHistory.map((day) => day.dayStart.toISOString()),
    );
  });
});
