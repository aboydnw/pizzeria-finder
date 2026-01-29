import { MapContainer, TileLayer } from 'react-leaflet';
import { PizzeriaMarker } from './PizzeriaMarker';
import { usePizzeriaStore } from '../../stores/pizzeriaStore';
import { PORTLAND_CENTER, DEFAULT_ZOOM } from '../../constants';
import 'leaflet/dist/leaflet.css';

export function PizzeriaMap() {
  const { 
    getFilteredPizzerias, 
    getStyleForPizzeria,
    setSelectedPizzeria 
  } = usePizzeriaStore();

  const pizzerias = getFilteredPizzerias();

  const handleViewDetails = (pizzeria: typeof pizzerias[0]) => {
    setSelectedPizzeria(pizzeria);
  };

  return (
    <MapContainer
      center={PORTLAND_CENTER}
      zoom={DEFAULT_ZOOM}
      className="w-full h-full"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {pizzerias.map((pizzeria) => (
        <PizzeriaMarker
          key={pizzeria.id}
          pizzeria={pizzeria}
          style={getStyleForPizzeria(pizzeria)}
          onClick={handleViewDetails}
        />
      ))}
    </MapContainer>
  );
}
