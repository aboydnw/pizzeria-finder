import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Pizzeria, PizzaStyle } from '../../types';
import { STYLE_COLORS, DEFAULT_STYLE_COLORS } from '../../constants';

// Create a custom colored marker as SVG data URL
function createColoredIcon(color: string, icon: string): L.DivIcon {
  return L.divIcon({
    className: 'custom-pizza-marker',
    html: `
      <div style="
        position: relative;
        width: 32px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 40C16 40 32 24 32 14C32 6.26801 24.8366 0 16 0C7.16344 0 0 6.26801 0 14C0 24 16 40 16 40Z" fill="${color}"/>
          <circle cx="16" cy="14" r="10" fill="white" fill-opacity="0.25"/>
        </svg>
        <span style="
          position: absolute;
          top: 6px;
          font-size: 14px;
          text-align: center;
          filter: drop-shadow(0 1px 1px rgba(0,0,0,0.3));
        ">${icon}</span>
      </div>
    `,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
}

// Cache for created icons
const iconCache: Record<string, L.DivIcon> = {};

function getIconForStyle(styleSlug?: string): L.DivIcon {
  const slug = styleSlug || 'default';
  
  if (!iconCache[slug]) {
    const colors = styleSlug ? STYLE_COLORS[styleSlug] : null;
    const markerColor = colors?.markerColor || DEFAULT_STYLE_COLORS.markerColor;
    const icon = colors?.icon || DEFAULT_STYLE_COLORS.icon;
    iconCache[slug] = createColoredIcon(markerColor, icon);
  }
  
  return iconCache[slug];
}

interface PizzeriaMarkerProps {
  pizzeria: Pizzeria;
  style?: PizzaStyle;
  onClick?: (pizzeria: Pizzeria) => void;
}

export function PizzeriaMarker({ pizzeria, style, onClick }: PizzeriaMarkerProps) {
  const icon = getIconForStyle(style?.slug);
  const colors = style?.slug ? STYLE_COLORS[style.slug] : null;
  
  return (
    <Marker
      position={[pizzeria.lat, pizzeria.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onClick?.(pizzeria),
      }}
    >
      <Popup>
        <div className="min-w-48">
          <h3 className="font-bold text-base text-gray-900">{pizzeria.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{pizzeria.address}</p>
          {style && (
            <span 
              className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded text-xs font-medium text-white"
              style={{ backgroundColor: colors?.markerColor || DEFAULT_STYLE_COLORS.markerColor }}
            >
              {colors?.icon || DEFAULT_STYLE_COLORS.icon} {style.name}
            </span>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
