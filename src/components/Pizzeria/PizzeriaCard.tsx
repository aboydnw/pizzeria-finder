import type { Pizzeria, PizzaStyle } from '../../types';
import { formatHoursCompact, getTodayHours } from '../../utils/hoursFormatter';
import { getGoogleMapsUrl } from '../../utils/maps';
import { Z_INDEX } from '../../constants';
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

  return (
    <div 
      className="absolute bottom-0 left-0 right-0 animate-slide-up"
      style={{ zIndex: Z_INDEX.overlay }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      
      {/* Card */}
      <div className="relative bg-gray-900 rounded-t-2xl shadow-2xl border-t border-gray-700 max-h-[85vh] overflow-y-auto">
        {/* Handle bar */}
        <div className="sticky top-0 bg-gray-900 flex justify-center pt-3 pb-2 cursor-grab">
          <div className="w-12 h-1.5 bg-gray-600 rounded-full" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white active:text-white transition-colors touch-manipulation"
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        {/* Content */}
        <div 
          className="px-4 sm:px-6 pb-6 pt-1" 
          style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
        >
          {/* Header */}
          <div className="pr-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white">{pizzeria.name}</h2>
            {style && (
              <span className="inline-block mt-2 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium">
                {style.name}
              </span>
            )}
          </div>

          {/* Description */}
          {pizzeria.description && (
            <p className="mt-4 text-gray-300 text-sm sm:text-base">{pizzeria.description}</p>
          )}

          {/* Details */}
          <div className="mt-5 space-y-4">
            <DetailRow icon={<LocationIcon className="w-5 h-5 text-gray-500" />}>
              <p className="text-gray-300 text-sm sm:text-base break-words">{pizzeria.address}</p>
              <a 
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 text-sm hover:underline active:underline inline-block mt-1"
              >
                Open in Google Maps →
              </a>
            </DetailRow>

            {pizzeria.phone && (
              <DetailRow icon={<PhoneIcon className="w-5 h-5 text-gray-500" />}>
                <a 
                  href={`tel:${pizzeria.phone}`}
                  className="text-gray-300 hover:text-orange-400 active:text-orange-400 transition-colors text-sm sm:text-base"
                >
                  {pizzeria.phone}
                </a>
              </DetailRow>
            )}

            <DetailRow icon={<ClockIcon className="w-5 h-5 text-gray-500 mt-0.5" />}>
              <p className="text-gray-300 text-sm sm:text-base">
                <span className="text-gray-500">Today:</span> {todayHours}
              </p>
              <details className="mt-1">
                <summary className="text-orange-400 text-sm cursor-pointer hover:underline active:underline touch-manipulation">
                  See all hours
                </summary>
                <div className="mt-2 text-sm text-gray-400 space-y-1">
                  {allHours.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </details>
            </DetailRow>

            {pizzeria.website && (
              <DetailRow icon={<GlobeIcon className="w-5 h-5 text-gray-500" />}>
                <a 
                  href={pizzeria.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:underline active:underline text-sm sm:text-base"
                >
                  Visit Website
                </a>
              </DetailRow>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {pizzeria.phone && (
              <ActionButton href={`tel:${pizzeria.phone}`} variant="primary">
                Call Now
              </ActionButton>
            )}
            {pizzeria.website && (
              <ActionButton href={pizzeria.website} variant="secondary" external>
                View Menu
              </ActionButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Detail row with icon and content */
function DetailRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

/** Action button with consistent styling */
function ActionButton({ 
  href, 
  variant, 
  external, 
  children 
}: { 
  href: string; 
  variant: 'primary' | 'secondary'; 
  external?: boolean;
  children: React.ReactNode;
}) {
  const baseClasses = "flex-1 py-3.5 px-4 font-semibold rounded-xl text-center transition-colors touch-manipulation";
  const variantClasses = variant === 'primary' 
    ? "bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white"
    : "bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white";

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`${baseClasses} ${variantClasses}`}
    >
      {children}
    </a>
  );
}
