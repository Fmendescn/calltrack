import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { FoodEntryItem } from './FoodEntryItem';
import { FoodEntry } from '@/database';

const entry: FoodEntry = {
  id: 1,
  name: 'Banana',
  calories: 105,
  protein: 1.3,
  carbs: 27,
  fat: 0.3,
  fiber: 3.1,
  createdAt: '2026-07-12T10:00:00.000Z',
};

describe('FoodEntryItem', () => {
  it('renders the delete button when onDelete is provided', () => {
    render(<FoodEntryItem entry={entry} onDelete={() => {}} />);

    expect(screen.getByText('✕')).toBeTruthy();
  });

  it('omits the delete button when onDelete is absent', () => {
    render(<FoodEntryItem entry={entry} />);

    expect(screen.queryByText('✕')).toBeNull();
  });
});
