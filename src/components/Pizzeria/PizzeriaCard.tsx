import type { Pizzeria, PizzaStyle } from '../../types';
import { formatHoursCompact, getTodayHours } from '../../utils/hoursFormatter';
import { getGoogleMapsUrl } from '../../utils/maps';
import { Z_INDEX, STYLE_COLORS, DEFAULT_STYLE_COLORS } from '../../constants';
import { LocationIcon, PhoneIcon, ClockIcon, GlobeIcon, CloseIcon } from '../ui/Icons';

interface PizzeriaCardProps {
  pizzeria: Pizzeria;
  style?: PizzaStyle;
  onClose: () => void;
}

export function PizzeriaCard({ pizzeria, style, onClose }: PizzeriaCardProps) {
  const todayHours = getTodayHours(pizzeria.hours);
  const allHours = formatHoursCompact(pizzeria.hours);
  const mapsUrl = getGoogleMapsUrl(pizzeria.address, pizzeria.google_maps_url);
  
  const styleColors = style?.slug ? STYLE_COLORS[style.slug] : null;
  const accentColor = styleColors?.markerColor || DEFAULT_STYLE_COLORS.markerColor;

  return (
    <>
      {/* Backdrop - click to close */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px]"
        style={{ zIndex: Z_INDEX.overlay }}
        onClick={onClose}
      />
      
      {/* Floating Card - left side panel */}
      <div 
        className="fixed left-4 bottom-4 top-4 w-80 max-w-[calc(100vw-2rem)] animate-slide-in-left"
        style={{ zIndex: Z_INDEX.modal }}
      >
        <div className="h-full bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 flex flex-col overflow-hidden">
          {/* Color accent bar */}
          <div 
            className="h-1.5 w-full shrink-0"
            style={{ backgroundColor: accentColor }}
          />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-3 p-1.5 text-gray-400 hover:text-white active:text-white transition-colors rounded-lg hover:bg-gray-800/50 touch-manipulation"
            aria-label="Close"
          >
            <CloseIcon />
          </button>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {/* Header */}
            <div className="pr-8">
              <h2 className="text-lg font-bold text-white leading-snug">{pizzeria.name}</h2>
              {style && (
                <span 
                  className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  {styleColors?.icon || DEFAULT_STYLE_COLORS.icon}
                  {style.name}
                </span>
              )}
            </div>

            {/* Description */}
            {pizzeria.description && (
              <p className="mt-3 text-gray-400 text-sm leading-relaxed">{pizzeria.description}</p>
            )}

            {/* Details */}
            <div className="mt-4 space-y-3">
              <DetailRow icon={<LocationIcon className="w-4 h-4 text-gray-500" />}>
                <p className="text-gray-300 text-sm break-words leading-snug">{pizzeria.address}</p>
                <a 
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs hover:underline active:underline inline-block mt-0.5"
                  style={{ color: accentColor }}
                >
                  Open in Maps →
                </a>
              </DetailRow>

              {pizzeria.phone && (
                <DetailRow icon={<PhoneIcon className="w-4 h-4 text-gray-500" />}>
                  <a 
                    href={`tel:${pizzeria.phone}`}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {pizzeria.phone}
                  </a>
                </DetailRow>
              )}

              <DetailRow icon={<ClockIcon className="w-4 h-4 text-gray-500 mt-0.5" />}>
                <p className="text-gray-300 text-sm">
                  <span className="text-gray-500">Today:</span> {todayHours}
                </p>
                <details className="mt-1">
                  <summary 
                    className="text-xs cursor-pointer hover:underline active:underline touch-manipulation"
                    style={{ color: accentColor }}
                  >
                    See all hours
                  </summary>
                  <div className="mt-2 text-xs text-gray-500 space-y-0.5">
                    {allHours.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </details>
              </DetailRow>

              {pizzeria.website && (
                <DetailRow icon={<GlobeIcon className="w-4 h-4 text-gray-500" />}>
                  <a 
                    href={pizzeria.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline active:underline text-sm"
                    style={{ color: accentColor }}
                  >
                    Visit Website
                  </a>
                </DetailRow>
              )}
            </div>
          </div>

          {/* Action Buttons - sticky bottom */}
          <div className="shrink-0 px-4 py-3 border-t border-gray-800/50 bg-gray-900/80 space-y-2">
            {pizzeria.phone && (
              <ActionButton href={`tel:${pizzeria.phone}`} accentColor={accentColor} variant="primary">
                📞 Call Now
              </ActionButton>
            )}
            {pizzeria.website && (
              <ActionButton href={pizzeria.website} accentColor={accentColor} variant="secondary" external>
                🍕 View Menu
              </ActionButton>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/** Detail row with icon and content */
function DetailRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

/** Action button with consistent styling */
function ActionButton({ 
  href, 
  accentColor,
  variant, 
  external, 
  children 
}: { 
  href: string;
  accentColor: string;
  variant: 'primary' | 'secondary'; 
  external?: boolean;
  children: React.ReactNode;
}) {
  const baseClasses = "w-full py-2.5 px-4 font-semibold rounded-xl text-center text-sm transition-all touch-manipulation block";
  
  const style = variant === 'primary' 
    ? { backgroundColor: accentColor, color: 'white' }
    : { backgroundColor: 'transparent', color: accentColor, border: `1px solid ${accentColor}` };

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`${baseClasses} ${variant === 'primary' ? 'hover:opacity-90' : 'hover:bg-gray-800/30'}`}
      style={style}
    >
      {children}
    </a>
  );
}
