export interface FoodDatabaseEntry {
  id: string;
  name: string;
  per100g: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export const FOOD_DATABASE: FoodDatabaseEntry[] = [
  { id: 'arroz-branco',     name: 'Arroz branco cozido',       per100g: { calories: 128, protein: 2.5,  carbs: 28.1, fat: 0.2,  fiber: 1.6 } },
  { id: 'feijao-carioca',   name: 'Feijão carioca cozido',     per100g: { calories: 76,  protein: 4.8,  carbs: 13.6, fat: 0.5,  fiber: 8.4 } },
  { id: 'frango-grelhado',  name: 'Frango grelhado (peito)',    per100g: { calories: 159, protein: 32.0, carbs: 0.0,  fat: 3.2,  fiber: 0.0 } },
  { id: 'ovo-cozido',       name: 'Ovo cozido',                per100g: { calories: 155, protein: 13.3, carbs: 1.1,  fat: 10.6, fiber: 0.0 } },
  { id: 'banana',           name: 'Banana prata',              per100g: { calories: 98,  protein: 1.3,  carbs: 23.8, fat: 0.1,  fiber: 1.9 } },
  { id: 'maca',             name: 'Maçã',                      per100g: { calories: 56,  protein: 0.3,  carbs: 14.9, fat: 0.1,  fiber: 1.3 } },
  { id: 'pao-frances',      name: 'Pão francês',               per100g: { calories: 300, protein: 8.0,  carbs: 58.6, fat: 3.1,  fiber: 2.3 } },
  { id: 'leite-integral',   name: 'Leite integral',            per100g: { calories: 61,  protein: 3.2,  carbs: 4.8,  fat: 3.3,  fiber: 0.0 } },
  { id: 'iogurte-natural',  name: 'Iogurte natural integral',  per100g: { calories: 61,  protein: 3.5,  carbs: 4.9,  fat: 3.3,  fiber: 0.0 } },
  { id: 'carne-bovina',     name: 'Carne bovina (patinho)',     per100g: { calories: 219, protein: 21.9, carbs: 0.0,  fat: 14.3, fiber: 0.0 } },
  { id: 'batata-cozida',    name: 'Batata cozida',             per100g: { calories: 87,  protein: 1.9,  carbs: 19.6, fat: 0.1,  fiber: 1.8 } },
  { id: 'aveia',            name: 'Aveia em flocos',           per100g: { calories: 394, protein: 13.9, carbs: 66.6, fat: 8.5,  fiber: 9.1 } },
  { id: 'whey-protein',     name: 'Whey protein (pó)',         per100g: { calories: 380, protein: 75.0, carbs: 8.0,  fat: 5.0,  fiber: 0.0 } },
  { id: 'brocolis',         name: 'Brócolis cozido',           per100g: { calories: 35,  protein: 3.7,  carbs: 4.0,  fat: 0.5,  fiber: 3.0 } },
  { id: 'laranja',          name: 'Laranja',                   per100g: { calories: 47,  protein: 1.0,  carbs: 11.5, fat: 0.1,  fiber: 2.4 } },
  { id: 'queijo-mussarela', name: 'Queijo mussarela',          per100g: { calories: 300, protein: 22.2, carbs: 2.6,  fat: 22.4, fiber: 0.0 } },
  { id: 'atum-lata',        name: 'Atum em lata (ao natural)', per100g: { calories: 119, protein: 26.0, carbs: 0.0,  fat: 1.7,  fiber: 0.0 } },
  { id: 'pasta-amendoim',   name: 'Pasta de amendoim',         per100g: { calories: 614, protein: 25.1, carbs: 20.2, fat: 52.5, fiber: 6.0 } },
  { id: 'salmao',           name: 'Salmão grelhado',           per100g: { calories: 206, protein: 20.5, carbs: 0.0,  fat: 13.6, fiber: 0.0 } },
  { id: 'tomate',           name: 'Tomate',                    per100g: { calories: 18,  protein: 0.9,  carbs: 3.5,  fat: 0.2,  fiber: 1.2 } },
];
