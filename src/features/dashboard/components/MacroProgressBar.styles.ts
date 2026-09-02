import { StyleSheet } from 'react-native';
import { Colors } from '@/shared/constants/theme';

export const styles = StyleSheet.create({
  track: {
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
});
