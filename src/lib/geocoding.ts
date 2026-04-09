export interface GeocodingResult {
  lat: number;
  lng: number;
}

let lastRequestTime = 0;

async function waitForRateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < 1100) {
    await new Promise((resolve) => setTimeout(resolve, 1100 - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();
}

export async function geocodeLocation(
  city: string,
  country: string
): Promise<GeocodingResult | null> {
  if (!city.trim() || !country.trim()) return null;

  await waitForRateLimit();

  const query = encodeURIComponent(`${city}, ${country}`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'UsPrimeDelivery/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Geocoding request failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return null;
    }

    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);

    if (isNaN(lat) || isNaN(lng)) {
      return null;
    }

    return { lat, lng };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}

