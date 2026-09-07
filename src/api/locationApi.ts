/**
 * Location API service
 * Interacts with HTML5 Geolocation API with graceful fallback when permissions are denied or unavailable.
 */

export interface GeoPosition {
  latitude: number;
  longitude: number;
  accuracy?: number;
  addressText?: string;
  isLive: boolean;
}

export const locationApi = {
  getCurrentPosition: async (): Promise<GeoPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: Number(position.coords.latitude.toFixed(4)),
            longitude: Number(position.coords.longitude.toFixed(4)),
            accuracy: position.coords.accuracy,
            isLive: true,
            addressText: `GPS: ${position.coords.latitude.toFixed(3)}°N, ${position.coords.longitude.toFixed(3)}°E`,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000,
        }
      );
    });
  },
};
