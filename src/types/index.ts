// Core application types

export interface City {
  id: string;
  name: string;
  slug: string;
  center_lat: number;
  center_lng: number;
  zoom_level: number;
}

export interface PizzaStyle {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Pizzeria {
  id: string;
  city_id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  hours?: Record<string, string>;
  description?: string;
  image_url?: string;
  google_maps_url?: string;
  created_at?: string;
  updated_at?: string;
  // Joined data
  pizzeria_styles?: PizzeriaStyle[];
}

export interface PizzeriaStyle {
  id: string;
  pizzeria_id: string;
  style_id: string;
  is_primary: boolean;
  pizza_styles?: PizzaStyle;
}

// Pizzeria with style info flattened for easy access
export interface PizzeriaWithStyle extends Pizzeria {
  style?: PizzaStyle;
}
