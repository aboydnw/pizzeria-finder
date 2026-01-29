// App-wide constants

/** Portland, OR center coordinates */
export const PORTLAND_CENTER: [number, number] = [45.5152, -122.6784];

/** Default map zoom level */
export const DEFAULT_ZOOM = 12;

/** Z-index layers for proper stacking */
export const Z_INDEX = {
  map: 0,
  overlay: 1000,
  modal: 1100,
} as const;

/** Style colors for filter buttons - keyed by style slug */
export const STYLE_COLORS: Record<string, { 
  bg: string; 
  active: string; 
  text: string;
  markerColor: string;
  icon: string;
}> = {
  neapolitan: { 
    bg: 'bg-red-900/40', 
    active: 'bg-red-600', 
    text: 'text-red-200',
    markerColor: '#dc2626', // red-600
    icon: '🔥' // wood-fired association
  },
  'new-york': { 
    bg: 'bg-amber-900/40', 
    active: 'bg-amber-600', 
    text: 'text-amber-200',
    markerColor: '#d97706', // amber-600
    icon: '🗽' // NYC
  },
  sicilian: { 
    bg: 'bg-green-900/40', 
    active: 'bg-green-600', 
    text: 'text-green-200',
    markerColor: '#16a34a', // green-600
    icon: '🟩' // square pan shape
  },
  'portland-style': { 
    bg: 'bg-purple-900/40', 
    active: 'bg-purple-600', 
    text: 'text-purple-200',
    markerColor: '#9333ea', // purple-600
    icon: '🌲' // Pacific Northwest
  },
  'deep-dish-detroit': {
    bg: 'bg-blue-900/40',
    active: 'bg-blue-600',
    text: 'text-blue-200',
    markerColor: '#2563eb', // blue-600
    icon: '🏭' // industrial city
  },
  chicago: {
    bg: 'bg-cyan-900/40',
    active: 'bg-cyan-600',
    text: 'text-cyan-200',
    markerColor: '#0891b2', // cyan-600
    icon: '🥧' // deep dish
  },
  'new-haven': {
    bg: 'bg-rose-900/40',
    active: 'bg-rose-600',
    text: 'text-rose-200',
    markerColor: '#e11d48', // rose-600
    icon: '🔥' // charred crust
  },
  fusion: {
    bg: 'bg-fuchsia-900/40',
    active: 'bg-fuchsia-600',
    text: 'text-fuchsia-200',
    markerColor: '#c026d3', // fuchsia-600
    icon: '✨' // creative/fusion
  },
};

export const DEFAULT_STYLE_COLORS = { 
  bg: 'bg-gray-700/60', 
  active: 'bg-orange-500', 
  text: 'text-gray-200',
  markerColor: '#f97316', // orange-500
  icon: '🍕'
};
