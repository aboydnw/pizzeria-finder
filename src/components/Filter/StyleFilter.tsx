import { usePizzeriaStore } from '../../stores/pizzeriaStore';
import { STYLE_COLORS, DEFAULT_STYLE_COLORS, Z_INDEX } from '../../constants';
import { Tooltip } from '../ui/Tooltip';

export function StyleFilter() {
  const { 
    pizzaStyles, 
    activeStyleFilter, 
    setStyleFilter,
    pizzerias,
    getFilteredPizzerias,
  } = usePizzeriaStore();

  const filteredCount = getFilteredPizzerias().length;
  const totalCount = pizzerias.length;

  const getColors = (slug: string) => STYLE_COLORS[slug] || DEFAULT_STYLE_COLORS;

  return (
    <div 
      className="absolute top-0 left-0 right-0 pt-[env(safe-area-inset-top)]"
      style={{ zIndex: Z_INDEX.overlay }}
    >
      {/* Filter container with glassmorphism */}
      <div className="mx-2 mt-2 sm:mx-4 sm:mt-4 bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700/50">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <h2 className="text-white font-semibold text-sm">Filter by Style</h2>
          <span className="text-gray-400 text-xs">
            {activeStyleFilter ? `${filteredCount} of ${totalCount}` : `${totalCount} pizzerias`}
          </span>
        </div>

        {/* Horizontally scrollable filter buttons */}
        <div className="overflow-x-auto scrollbar-hide pb-3 px-3">
          <div className="flex gap-2 min-w-max">
            {/* All button */}
            <button
              onClick={() => setStyleFilter(null)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap touch-manipulation ${
                activeStyleFilter === null
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-gray-700/60 text-gray-300 active:bg-gray-600/60'
              }`}
            >
              All
            </button>

            {/* Style buttons */}
            {pizzaStyles.map((style) => {
              const colors = getColors(style.slug);
              const isActive = activeStyleFilter === style.slug;

              return (
                <div key={style.id} className="flex items-center gap-1">
                  <button
                    onClick={() => setStyleFilter(isActive ? null : style.slug)}
                    className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap touch-manipulation ${
                      isActive
                        ? `${colors.active} text-white shadow-lg`
                        : `${colors.bg} ${colors.text} active:opacity-70`
                    }`}
                  >
                    {style.name}
                  </button>
                  {style.description && (
                    <Tooltip content={style.description}>
                      <span className="text-gray-400 hover:text-white text-sm">ℹ️</span>
                    </Tooltip>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
