import { useState } from 'react';
import { usePizzeriaStore } from './stores/pizzeriaStore';
import { useLoadPizzerias } from './hooks/useLoadPizzerias';
import { PizzeriaMap } from './components/Map';
import { PizzeriaCard } from './components/Pizzeria';
import { StyleFilter } from './components/Filter';
import { SubmitButton, SubmitForm } from './components/Submit';
import type { Pizzeria, PizzaStyle } from './types';

function App() {
  const { isLoading, error } = useLoadPizzerias();
  const { selectedPizzeria, setSelectedPizzeria, getStyleForPizzeria } = usePizzeriaStore();
  const [isSubmitFormOpen, setIsSubmitFormOpen] = useState(false);
  const [editPizzeria, setEditPizzeria] = useState<Pizzeria | null>(null);
  const [editStyle, setEditStyle] = useState<PizzaStyle | null>(null);

  // Handler for opening edit form
  const handleEdit = (pizzeria: Pizzeria, style?: PizzaStyle) => {
    setEditPizzeria(pizzeria);
    setEditStyle(style || null);
    setSelectedPizzeria(null); // Close the details panel
    setIsSubmitFormOpen(true);
  };

  // Handler for closing the form
  const handleCloseForm = () => {
    setIsSubmitFormOpen(false);
    setEditPizzeria(null);
    setEditStyle(null);
  };

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

  const selectedStyle = selectedPizzeria ? getStyleForPizzeria(selectedPizzeria) : undefined;

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <PizzeriaMap />
      <StyleFilter />
      
      {/* Add Pizzeria Button */}
      <SubmitButton onClick={() => setIsSubmitFormOpen(true)} />
      
      {/* Submit/Edit Form Modal */}
      <SubmitForm 
        isOpen={isSubmitFormOpen} 
        onClose={handleCloseForm}
        editPizzeria={editPizzeria}
        editStyle={editStyle}
      />
      
      {selectedPizzeria && (
        <PizzeriaCard
          pizzeria={selectedPizzeria}
          style={selectedStyle}
          onClose={() => setSelectedPizzeria(null)}
          onEdit={() => handleEdit(selectedPizzeria, selectedStyle)}
        />
      )}
    </div>
  );
}

export default App;
