import { usePizzeriaStore } from './stores/pizzeriaStore';
import { useLoadPizzerias } from './hooks/useLoadPizzerias';
import { PizzeriaMap } from './components/Map';
import { PizzeriaCard } from './components/Pizzeria';
import { StyleFilter } from './components/Filter';

function App() {
  const { isLoading, error } = useLoadPizzerias();
  const { selectedPizzeria, setSelectedPizzeria, getStyleForPizzeria } = usePizzeriaStore();

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍕</div>
          <div className="text-xl">Loading pizzerias...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-400 mb-2">Error loading data</div>
          <div className="text-gray-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <PizzeriaMap />
      <StyleFilter />
      
      {selectedPizzeria && (
        <PizzeriaCard
          pizzeria={selectedPizzeria}
          style={getStyleForPizzeria(selectedPizzeria)}
          onClose={() => setSelectedPizzeria(null)}
        />
      )}
    </div>
  );
}

export default App;
