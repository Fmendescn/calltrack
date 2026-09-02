import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useFoodLog } from '../hooks/useFoodLog';
import { useFoodSearch } from '../hooks/useFoodSearch';
import { Button } from '@/shared/components/Button';
import { MACRO_COLORS, MacroKey, MACRO_LABELS, MACRO_UNITS } from '@/shared/constants/macros';
import { styles } from './AddFoodScreen.styles';
import { Colors } from '@/shared/constants/theme';

interface FormState {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
}

const INITIAL_FORM: FormState = {
  name: '',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
  fiber: '',
};

const MACRO_FIELDS: { key: Exclude<keyof FormState, 'name'>; macro: MacroKey }[] = [
  { key: 'calories', macro: 'calories' },
  { key: 'protein',  macro: 'protein'  },
  { key: 'carbs',    macro: 'carbs'    },
  { key: 'fat',      macro: 'fat'      },
  { key: 'fiber',    macro: 'fiber'    },
];

export function AddFoodScreen() {
  const [mode, setMode] = useState<'search' | 'manual'>('search');
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const { addEntry } = useFoodLog();
  const {
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
  } = useFoodSearch();

  function handleChange(field: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    if (mode === 'search') {
      if (!selectedFood) {
        Alert.alert('Selecione um alimento', 'Busque e selecione um alimento da lista ou use a entrada manual.');
        return;
      }
      const g = parseFloat(grams);
      if (!grams || isNaN(g) || g <= 0) {
        Alert.alert('Quantidade inválida', 'Informe a quantidade em gramas.');
        return;
      }
      const macros = calculatedMacros!;
      addEntry({
        name: selectedFood.name,
        calories: macros.calories,
        protein:  macros.protein,
        carbs:    macros.carbs,
        fat:      macros.fat,
        fiber:    macros.fiber,
      });
      handleClear();
      router.replace('/');
      return;
    }

    // Manual mode
    if (!form.name.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o nome do alimento.');
      return;
    }

    const calories = parseFloat(form.calories) || 0;
    const protein  = parseFloat(form.protein)  || 0;
    const carbs    = parseFloat(form.carbs)    || 0;
    const fat      = parseFloat(form.fat)      || 0;
    const fiber    = parseFloat(form.fiber)    || 0;

    if ([calories, protein, carbs, fat, fiber].some(v => v < 0)) {
      Alert.alert('Valor inválido', 'Os valores devem ser maiores ou iguais a zero.');
      return;
    }

    addEntry({ name: form.name.trim(), calories, protein, carbs, fat, fiber });
    setForm(INITIAL_FORM);
    router.replace('/');
  }

  function switchToSearch() {
    setMode('search');
    setForm(INITIAL_FORM);
  }

  function switchToManual() {
    setMode('manual');
    handleClear();
    setForm(INITIAL_FORM);
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
        {/* Mode toggle */}
        <View style={styles.modeToggleRow}>
          <TouchableOpacity style={styles.modeToggleButton} onPress={switchToSearch} activeOpacity={0.7}>
            <Text style={[styles.modeToggleText, mode === 'search' && styles.modeToggleActive]}>
              Buscar
            </Text>
          </TouchableOpacity>
          <Text style={styles.modeToggleSeparator}>|</Text>
          <TouchableOpacity style={styles.modeToggleButton} onPress={switchToManual} activeOpacity={0.7}>
            <Text style={[styles.modeToggleText, mode === 'manual' && styles.modeToggleActive]}>
              Manual
            </Text>
          </TouchableOpacity>
        </View>

        {mode === 'search' ? (
          <>
            <Text style={styles.sectionTitle}>Buscar alimento</Text>

            {/* Search input + dropdown */}
            <View style={styles.searchWrapper}>
              <TextInput
                style={[styles.input, query.length > 0 && styles.searchInputActive]}
                value={query}
                onChangeText={handleQueryChange}
                placeholder="Digite o nome do alimento..."
                placeholderTextColor={Colors.text.muted}
                autoCorrect={false}
                autoCapitalize="none"
              />
              {isDropdownVisible && (
                <ScrollView
                  style={styles.dropdown}
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled
                >
                  {results.length === 0 ? (
                    <Text style={styles.dropdownEmptyText}>Nenhum alimento encontrado</Text>
                  ) : (
                    results.map((food, index) => (
                      <TouchableOpacity
                        key={food.id}
                        style={[
                          styles.dropdownItem,
                          index === results.length - 1 && styles.dropdownItemLast,
                        ]}
                        onPress={() => handleSelectFood(food)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.dropdownItemText}>{food.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              )}
            </View>

            {/* After food selection */}
            {selectedFood && (
              <>
                <View style={styles.selectedBanner}>
                  <Text style={styles.selectedBannerText} numberOfLines={1}>
                    {selectedFood.name}
                  </Text>
                  <TouchableOpacity onPress={handleClear} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                    <Text style={styles.selectedBannerClear}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Quantidade (g)</Text>
                  <TextInput
                    style={styles.input}
                    value={grams}
                    onChangeText={handleGramsChange}
                    placeholder="Ex: 150"
                    placeholderTextColor={Colors.text.muted}
                    keyboardType="numeric"
                  />
                </View>

                {calculatedMacros && (
                  <View style={styles.macroPreview}>
                    <View style={styles.macroPreviewChip}>
                      <Text style={[styles.macroPreviewText, styles.macroPreviewCalText]}>
                        {calculatedMacros.calories} kcal
                      </Text>
                    </View>
                    <View style={styles.macroPreviewChip}>
                      <Text style={styles.macroPreviewText}>P {calculatedMacros.protein}g</Text>
                    </View>
                    <View style={styles.macroPreviewChip}>
                      <Text style={styles.macroPreviewText}>C {calculatedMacros.carbs}g</Text>
                    </View>
                    <View style={styles.macroPreviewChip}>
                      <Text style={styles.macroPreviewText}>G {calculatedMacros.fat}g</Text>
                    </View>
                    <View style={styles.macroPreviewChip}>
                      <Text style={styles.macroPreviewText}>F {calculatedMacros.fiber}g</Text>
                    </View>
                  </View>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Informações</Text>
            <Field
              label="Nome do alimento"
              value={form.name}
              onChangeText={v => handleChange('name', v)}
              placeholder="Ex: Frango grelhado"
              required
            />

            <Text style={styles.sectionTitle}>Macronutrientes</Text>
            <View style={styles.macroGrid}>
              {MACRO_FIELDS.map(({ key, macro }) => (
                <View key={key} style={styles.macroField}>
                  <View style={styles.macroLabelRow}>
                    <View style={[styles.macroDot, { backgroundColor: MACRO_COLORS[macro] }]} />
                    <Text style={styles.label}>
                      {MACRO_LABELS[macro]} ({MACRO_UNITS[macro]})
                    </Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={form[key]}
                    onChangeText={v => handleChange(key, v)}
                    placeholder="0"
                    placeholderTextColor={Colors.text.muted}
                    keyboardType="numeric"
                  />
                </View>
              ))}
            </View>
          </>
        )}

        <View style={styles.actions}>
          <Button title="Salvar alimento" onPress={handleSave} />
          <Button
            title="Limpar"
            onPress={() => {
              if (mode === 'search') handleClear();
              else setForm(INITIAL_FORM);
            }}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}

function Field({ label, value, onChangeText, placeholder, required }: FieldProps) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>
        {label}{required ? ' *' : ''}
      </Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.text.muted}
      />
    </View>
  );
}
