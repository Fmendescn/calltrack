import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Colors } from '@/shared/constants/theme';
import { styles } from './Button.styles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

export function Button({ title, onPress, variant = 'primary', disabled, loading }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant], (disabled || loading) && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? Colors.text.inverse : Colors.primary}
          size="small"
        />
      ) : (
        <Text style={[styles.text, variant === 'secondary' && styles.textSecondary]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
