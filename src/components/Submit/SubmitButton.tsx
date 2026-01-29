import { Z_INDEX } from '../../constants';

interface SubmitButtonProps {
  onClick: () => void;
}

export function SubmitButton({ onClick }: SubmitButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-semibold text-sm group"
      style={{ zIndex: Z_INDEX.overlay }}
      aria-label="Add a pizzeria"
    >
      <span className="text-lg group-hover:rotate-90 transition-transform duration-200">+</span>
      <span className="hidden sm:inline">Add Pizzeria</span>
      <span className="sm:hidden">Add</span>
    </button>
  );
}
