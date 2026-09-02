import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { MacroGoals } from '@/database';
import { useMacroGoalsForm } from '../hooks/useMacroGoalsForm';
import { Button } from '@/shared/components/Button';
import { MACRO_COLORS, MACRO_LABELS, MACRO_UNITS, MacroKey } from '@/shared/constants/macros';
import { styles } from './MacroGoalsScreen.styles';
import { Colors } from '@/shared/constants/theme';

type FormState = Record<MacroKey, string>;

const MACRO_ORDER: MacroKey[] = ['calories', 'protein', 'carbs', 'fat', 'fiber'];

export function MacroGoalsScreen() {
  const { goals, updateGoals } = useMacroGoalsForm();
  const [form, setForm] = useState<FormState>({
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({
      calories: goals.calories.toString(),
      protein:  goals.protein.toString(),
      carbs:    goals.carbs.toString(),
      fat:      goals.fat.toString(),
      fiber:    goals.fiber.toString(),
    });
  }, [goals]);

  function handleChange(field: MacroKey, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSave() {
    const parsed: MacroGoals = {
      calories: parseFloat(form.calories),
      protein:  parseFloat(form.protein),
      carbs:    parseFloat(form.carbs),
      fat:      parseFloat(form.fat),
      fiber:    parseFloat(form.fiber),
    };

    if (Object.values(parsed).some(v => isNaN(v) || v <= 0)) {
      Alert.alert('Valor inválido', 'Todas as metas devem ser números maiores que zero.');
      return;
    }

    await updateGoals(parsed);
    setSaved(true);
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Defina suas metas diárias. O dashboard exibirá o progresso em relação a cada meta em tempo real.
          </Text>
        </View>

        {MACRO_ORDER.map(macro => (
          <View key={macro} style={styles.fieldCard}>
            <View style={styles.labelRow}>
              <View style={[styles.colorDot, { backgroundColor: MACRO_COLORS[macro] }]} />
              <Text style={styles.label}>
                {MACRO_LABELS[macro]}{' '}
                <Text style={styles.unit}>({MACRO_UNITS[macro]})</Text>
              </Text>
            </View>
            <TextInput
              style={styles.input}
              value={form[macro]}
              onChangeText={v => handleChange(macro, v)}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={Colors.text.muted}
            />
          </View>
        ))}

        <View style={styles.actions}>
          {saved && (
            <View style={styles.savedBadge}>
              <Text style={styles.savedText}>✓  Metas salvas com sucesso</Text>
            </View>
          )}
          <Button title="Salvar Metas" onPress={handleSave} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
