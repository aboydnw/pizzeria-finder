import { useState, useEffect, useCallback } from 'react';
import { usePizzeriaStore } from '../../stores/pizzeriaStore';
import { submitPizzeria, updatePizzeria } from '../../services/submissions';
import { parseGoogleMapsUrl, geocodeAddress, isInPortlandArea } from '../../utils/googleMaps';
import { Z_INDEX, STYLE_COLORS, DEFAULT_STYLE_COLORS } from '../../constants';
import { CloseIcon } from '../ui/Icons';
import type { Pizzeria, PizzaStyle } from '../../types';

interface SubmitFormProps {
  isOpen: boolean;
  onClose: () => void;
  editPizzeria?: Pizzeria | null; // If provided, we're in edit mode
  editStyle?: PizzaStyle | null;
}

interface FormData {
  name: string;
  address: string;
  googleMapsUrl: string;
  phone: string;
  website: string;
  styleId: string;
  description: string;
}

const initialFormData: FormData = {
  name: '',
  address: '',
  googleMapsUrl: '',
  phone: '',
  website: '',
  styleId: '',
  description: '',
};

export function SubmitForm({ isOpen, onClose, editPizzeria, editStyle }: SubmitFormProps) {
  const { pizzaStyles } = usePizzeriaStore();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isParsingUrl, setIsParsingUrl] = useState(false);

  const isEditMode = !!editPizzeria;

  // Pre-fill form when editing
  useEffect(() => {
    if (isOpen && editPizzeria) {
      setFormData({
        name: editPizzeria.name || '',
        address: editPizzeria.address || '',
        googleMapsUrl: editPizzeria.google_maps_url || '',
        phone: editPizzeria.phone || '',
        website: editPizzeria.website || '',
        styleId: editStyle?.id || '',
        description: editPizzeria.description || '',
      });
    }
  }, [isOpen, editPizzeria, editStyle]);

  // Reset form when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setFormData(initialFormData);
        setSubmitStatus('idle');
        setErrorMessage('');
      }, 300);
    }
  }, [isOpen]);

  // Parse Google Maps URL when it changes
  const handleGoogleMapsUrlChange = useCallback(async (url: string) => {
    setFormData(prev => ({ ...prev, googleMapsUrl: url }));
    
    if (!url) return;

    setIsParsingUrl(true);
    
    try {
      const parsed = parseGoogleMapsUrl(url);
      
      // Auto-fill name if found and current name is empty
      if (parsed.name && !formData.name) {
        setFormData(prev => ({ ...prev, name: parsed.name || prev.name }));
      }
      
      // Auto-fill address if found
      if (parsed.address && !formData.address) {
        setFormData(prev => ({ ...prev, address: parsed.address || prev.address }));
      }
    } catch (e) {
      console.warn('Failed to parse URL:', e);
    } finally {
      setIsParsingUrl(false);
    }
  }, [formData.name, formData.address]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'googleMapsUrl') {
      handleGoogleMapsUrlChange(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      setErrorMessage('Please enter the pizzeria name');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage('Please enter the address');
      return;
    }
    if (!formData.styleId) {
      setErrorMessage('Please select a pizza style');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Geocode the address to get coordinates
      let lat: number | undefined;
      let lng: number | undefined;
      
      // Only geocode if address changed or we don't have coords
      const addressChanged = editPizzeria ? formData.address !== editPizzeria.address : true;
      
      if (addressChanged) {
        const coords = await geocodeAddress(formData.address);
        if (coords) {
          if (isInPortlandArea(coords.lat, coords.lng)) {
            lat = coords.lat;
            lng = coords.lng;
          } else {
            setErrorMessage('This address appears to be outside the Portland area. Please check the address.');
            setIsSubmitting(false);
            return;
          }
        }
      } else {
        // Keep existing coordinates
        lat = editPizzeria?.lat;
        lng = editPizzeria?.lng;
      }

      const submissionData = {
        id: editPizzeria?.id,
        name: formData.name.trim(),
        address: formData.address.trim(),
        lat,
        lng,
        phone: formData.phone.trim() || undefined,
        website: formData.website.trim() || undefined,
        google_maps_url: formData.googleMapsUrl.trim() || undefined,
        style_id: formData.styleId || undefined,
        description: formData.description.trim() || undefined,
      };

      // Submit or update
      const result = isEditMode 
        ? await updatePizzeria(submissionData)
        : await submitPizzeria(submissionData);

      if (result.success) {
        setSubmitStatus('success');
        
        // Refresh the page to show changes
        window.location.reload();
      } else {
        setErrorMessage(result.error || 'Failed to save. Please try again.');
        setSubmitStatus('error');
      }
    } catch (e) {
      console.error('Submit error:', e);
      setErrorMessage('Something went wrong. Please try again.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const getStyleColors = (slug: string) => STYLE_COLORS[slug] || DEFAULT_STYLE_COLORS;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        style={{ zIndex: Z_INDEX.modal }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="fixed inset-4 sm:inset-auto sm:top-4 sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg bg-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 flex flex-col overflow-hidden animate-fade-in"
        style={{ zIndex: Z_INDEX.modal + 1 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white">
              {isEditMode ? 'Edit Pizzeria' : 'Add a Pizzeria'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isEditMode ? 'Update the details for this pizzeria' : 'Know a great pizza spot? Add it to the map!'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {submitStatus === 'success' ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🍕</div>
              <h3 className="text-xl font-bold text-white mb-2">
                {isEditMode ? 'Changes saved!' : 'Added to the map!'}
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Refreshing to show the updates...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Google Maps URL - First for auto-fill */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Google Maps Link
                  <span className="text-gray-500 font-normal ml-1">(optional)</span>
                </label>
                <input
                  type="url"
                  name="googleMapsUrl"
                  value={formData.googleMapsUrl}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/..."
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                />
                {isParsingUrl && (
                  <p className="text-xs text-orange-400 mt-1">Extracting info from link...</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Pizzeria Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ken's Artisan Pizza"
                  required
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="304 SE 28th Ave, Portland, OR"
                  required
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                />
              </div>

              {/* Style */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Pizza Style <span className="text-red-400">*</span>
                </label>
                <select
                  name="styleId"
                  value={formData.styleId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors appearance-none cursor-pointer"
                  style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '20px'
                  }}
                >
                  <option value="">Select a style...</option>
                  {pizzaStyles.map(style => {
                    const colors = getStyleColors(style.slug);
                    return (
                      <option key={style.id} value={style.id}>
                        {colors.icon} {style.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Phone & Website row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(503) 555-1234"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  {isEditMode ? 'Description' : 'Why is this place great?'}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us what makes their pizza special..."
                  rows={2}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors resize-none"
                />
              </div>

              {/* Error message */}
              {errorMessage && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <p className="text-red-400 text-sm">{errorMessage}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    {isEditMode ? 'Saving...' : 'Adding to map...'}
                  </>
                ) : (
                  <>
                    <span>🍕</span>
                    {isEditMode ? 'Save Changes' : 'Add to Map'}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
