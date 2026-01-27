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
export const STYLE_COLORS: Record<string, { bg: string; active: string; text: string }> = {
  neapolitan: { bg: 'bg-red-900/40', active: 'bg-red-600', text: 'text-red-200' },
  'new-york': { bg: 'bg-amber-900/40', active: 'bg-amber-600', text: 'text-amber-200' },
  sicilian: { bg: 'bg-green-900/40', active: 'bg-green-600', text: 'text-green-200' },
  'portland-style': { bg: 'bg-purple-900/40', active: 'bg-purple-600', text: 'text-purple-200' },
};

export const DEFAULT_STYLE_COLORS = { 
  bg: 'bg-gray-700/60', 
  active: 'bg-orange-500', 
  text: 'text-gray-200' 
};
