/**
 * Utilities for parsing Google Maps URLs and extracting place information
 */

interface ParsedGoogleMapsInfo {
  name?: string;
  address?: string;
  lat?: number;
  lng?: number;
  placeId?: string;
}

/**
 * Parse a Google Maps URL to extract place information
 * Supports various Google Maps URL formats:
 * - https://www.google.com/maps/place/Place+Name/@lat,lng,...
 * - https://maps.google.com/?q=...
 * - https://goo.gl/maps/... (short URLs won't work directly)
 * - https://www.google.com/maps?cid=...
 */
export function parseGoogleMapsUrl(url: string): ParsedGoogleMapsInfo {
  const result: ParsedGoogleMapsInfo = {};
  
  if (!url) return result;

  try {
    const urlObj = new URL(url);
    
    // Extract coordinates from URL path (format: @lat,lng,zoom)
    const coordMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (coordMatch) {
      result.lat = parseFloat(coordMatch[1]);
      result.lng = parseFloat(coordMatch[2]);
    }

    // Extract place name from /place/Name/ format
    const placeMatch = url.match(/\/place\/([^/@]+)/);
    if (placeMatch) {
      // Decode URL-encoded name and replace + with spaces
      result.name = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    }

    // Extract from query parameter
    const qParam = urlObj.searchParams.get('q');
    if (qParam) {
      // Check if it's coordinates
      const qCoordMatch = qParam.match(/(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (qCoordMatch) {
        result.lat = parseFloat(qCoordMatch[1]);
        result.lng = parseFloat(qCoordMatch[2]);
      } else {
        // It's likely an address or place name
        result.address = qParam;
      }
    }

    // Extract place ID if present
    const ftidMatch = url.match(/ftid=([^&]+)/);
    if (ftidMatch) {
      result.placeId = ftidMatch[1];
    }

  } catch (e) {
    console.warn('Failed to parse Google Maps URL:', e);
  }

  return result;
}

/**
 * Geocode an address to get lat/lng coordinates using Nominatim (free, open-source)
 * Rate limit: 1 request per second
 */
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  if (!address) return null;

  try {
    // Add Portland, OR to improve results for local addresses
    const searchQuery = address.toLowerCase().includes('portland') 
      ? address 
      : `${address}, Portland, OR`;
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
      {
        headers: {
          'User-Agent': 'PizzaDiscoveryApp/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }

    return null;
  } catch (e) {
    console.warn('Geocoding failed:', e);
    return null;
  }
}

/**
 * Validate that coordinates are within Portland metro area
 */
export function isInPortlandArea(lat: number, lng: number): boolean {
  // Portland metro bounding box (approximate)
  const bounds = {
    north: 45.75,
    south: 45.35,
    east: -122.35,
    west: -123.0
  };

  return lat >= bounds.south && lat <= bounds.north && lng >= bounds.west && lng <= bounds.east;
}
