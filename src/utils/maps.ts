/**
 * Generate a Google Maps search URL for an address
 */
export function getGoogleMapsUrl(address: string, existingUrl?: string): string {
  if (existingUrl) {
    return existingUrl;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
