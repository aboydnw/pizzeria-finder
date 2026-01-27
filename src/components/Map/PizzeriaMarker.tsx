import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Pizzeria, PizzaStyle } from '../../types';

// Custom pizza marker icon
const pizzaIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface PizzeriaMarkerProps {
  pizzeria: Pizzeria;
  style?: PizzaStyle;
  onClick?: (pizzeria: Pizzeria) => void;
}

export function PizzeriaMarker({ pizzeria, style, onClick }: PizzeriaMarkerProps) {
  return (
    <Marker
      position={[pizzeria.lat, pizzeria.lng]}
      icon={pizzaIcon}
      eventHandlers={{
        click: () => onClick?.(pizzeria),
      }}
    >
      <Popup>
        <div className="min-w-48">
          <h3 className="font-bold text-base text-gray-900">{pizzeria.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{pizzeria.address}</p>
          {style && (
            <span className="inline-block mt-2 px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">
              {style.name}
            </span>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
