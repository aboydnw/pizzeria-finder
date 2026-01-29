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

  // Count pizzerias per style and filter out styles with no pizzerias
  const stylesWithCount = pizzaStyles
    .map(style => {
      const count = pizzerias.filter(p => {
        const pizzeriaStyle = p.pizzeria_styles?.[0];
        return pizzeriaStyle?.style_id === style.id;
      }).length;
      return { ...style, count };
    })
    .filter(style => style.count > 0);

  return (
    <div 
      className="absolute top-4 right-4 sm:top-6 sm:right-6"
      style={{ zIndex: Z_INDEX.overlay }}
    >
      {/* Compact legend container */}
      <div className="bg-gray-900/85 backdrop-blur-md rounded-xl shadow-xl border border-gray-700/50 w-44">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700/50">
          <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">Legend</span>
          <span className="text-gray-500 text-xs">
            {activeStyleFilter ? filteredCount : totalCount}
          </span>
        </div>

        {/* Style list */}
        <div className="py-1.5">
          {/* All option */}
          <button
            onClick={() => setStyleFilter(null)}
            className={`w-full px-3 py-1.5 flex items-center gap-2 text-left transition-colors ${
              activeStyleFilter === null
                ? 'bg-orange-500/20 text-orange-300'
                : 'text-gray-300 hover:bg-gray-800/50'
            }`}
          >
            <span className="text-sm">🍕</span>
            <span className="text-xs font-medium flex-1">All Styles</span>
            <span className="text-xs text-gray-500">{totalCount}</span>
          </button>

          {/* Style buttons */}
          {stylesWithCount.map((style) => {
            const colors = getColors(style.slug);
            const isActive = activeStyleFilter === style.slug;

            return (
              <div key={style.id} className="relative group">
                <button
                  onClick={() => setStyleFilter(isActive ? null : style.slug)}
                  className={`w-full px-3 py-1.5 flex items-center gap-2 text-left transition-colors ${
                    isActive
                      ? `bg-gray-700/60 text-white`
                      : 'text-gray-300 hover:bg-gray-800/50'
                  }`}
                >
                  <span 
                    className="w-4 h-4 rounded-full flex items-center justify-center text-xs"
                    style={{ backgroundColor: colors.markerColor }}
                  >
                    {colors.icon}
                  </span>
                  <span className="text-xs font-medium flex-1 truncate">{style.name}</span>
                  <span className="text-xs text-gray-500">{style.count}</span>
                </button>
                
                {style.description && (
                  <Tooltip content={style.description}>
                    <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-help">
                      ⓘ
                    </span>
                  </Tooltip>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
