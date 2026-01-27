import { create } from 'zustand';
import type { Pizzeria, PizzaStyle } from '../types';

interface PizzeriaStore {
  // Data
  pizzerias: Pizzeria[];
  pizzaStyles: PizzaStyle[];
  selectedPizzeria: Pizzeria | null;
  activeStyleFilter: string | null; // style slug or null for "all"
  isLoading: boolean;
  error: string | null;

  // Actions
  setPizzerias: (pizzerias: Pizzeria[]) => void;
  setPizzaStyles: (styles: PizzaStyle[]) => void;
  setSelectedPizzeria: (pizzeria: Pizzeria | null) => void;
  setStyleFilter: (styleSlug: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed (as getter functions)
  getFilteredPizzerias: () => Pizzeria[];
  getStyleForPizzeria: (pizzeria: Pizzeria) => PizzaStyle | undefined;
}

export const usePizzeriaStore = create<PizzeriaStore>((set, get) => ({
  // Initial state
  pizzerias: [],
  pizzaStyles: [],
  selectedPizzeria: null,
  activeStyleFilter: null,
  isLoading: false,
  error: null,

  // Actions
  setPizzerias: (pizzerias) => set({ pizzerias }),
  setPizzaStyles: (pizzaStyles) => set({ pizzaStyles }),
  setSelectedPizzeria: (selectedPizzeria) => set({ selectedPizzeria }),
  setStyleFilter: (activeStyleFilter) => set({ activeStyleFilter }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Computed
  getFilteredPizzerias: () => {
    const { pizzerias, activeStyleFilter, pizzaStyles } = get();
    
    if (!activeStyleFilter) {
      return pizzerias;
    }

    // Find the style ID for the selected slug
    const selectedStyle = pizzaStyles.find(s => s.slug === activeStyleFilter);
    if (!selectedStyle) {
      return pizzerias;
    }

    // Filter pizzerias by style
    return pizzerias.filter(pizzeria => {
      const pizzeriaStyle = pizzeria.pizzeria_styles?.[0];
      return pizzeriaStyle?.style_id === selectedStyle.id;
    });
  },

  getStyleForPizzeria: (pizzeria) => {
    const pizzeriaStyle = pizzeria.pizzeria_styles?.[0];
    if (!pizzeriaStyle?.pizza_styles) {
      return undefined;
    }
    return pizzeriaStyle.pizza_styles;
  },
}));
