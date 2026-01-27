import { createClient } from '@supabase/supabase-js';
import type { Pizzeria, PizzaStyle, City } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fetch all pizzerias with their styles
export const getPizzerias = async (): Promise<Pizzeria[]> => {
  const { data, error } = await supabase
    .from('pizzerias')
    .select(`
      *,
      pizzeria_styles (
        id,
        style_id,
        is_primary,
        pizza_styles (*)
      )
    `);

  if (error) {
    console.error('Error fetching pizzerias:', error);
    throw error;
  }

  return data || [];
};

// Fetch all pizza styles
export const getPizzaStyles = async (): Promise<PizzaStyle[]> => {
  const { data, error } = await supabase
    .from('pizza_styles')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching pizza styles:', error);
    throw error;
  }

  return data || [];
};

// Fetch city by slug (for future multi-city support)
export const getCityBySlug = async (slug: string): Promise<City | null> => {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching city:', error);
    return null;
  }

  return data;
};
