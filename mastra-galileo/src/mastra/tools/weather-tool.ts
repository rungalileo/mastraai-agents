import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { log } from '../../logger/galileo-logger';

/**
 * Weather Tool Response Interfaces
 * 
 * These interfaces define the structure of the weather API responses
 * to ensure type safety when working with external weather data.
 */
interface GeocodingResponse {
  results: {
    latitude: number;
    longitude: number;
    name: string;
  }[];
}

interface WeatherResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
    weather_code: number;
  };
}

/**
 * Weather Tool
 * 
 * This tool fetches current weather information for a given location.
 * It uses the Open-Meteo API for geocoding and weather data, with
 * automatic Galileo logging for observability.
 */
export const weatherTool = createTool({
  id: 'get-weather',
  description: 'Get current weather for a location',
  inputSchema: z.object({
    location: z.string().describe('City name'),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    feelsLike: z.number(),
    humidity: z.number(),
    windSpeed: z.number(),
    windGust: z.number(),
    conditions: z.string(),
    location: z.string(),
  }),
  execute: async ({ context }: any) => {
    // The context contains the validated input data
    const location = context.location;
    
    if (!location) {
      throw new Error('Location is required');
    }
    
    return await getWeather(location);
  },
});

/**
 * Get Weather Data
 * 
 * This function fetches weather data for a given location using the Open-Meteo API.
 * It performs geocoding to convert the location name to coordinates, then
 * fetches the current weather data for those coordinates.
 * 
 * @param location - The city name to get weather for
 * @returns Weather data including temperature, humidity, wind, and conditions
 * @throws Error if the location is not found or weather data cannot be fetched
 */
const getWeather = log({ 
  name: 'get-weather-api-call', 
  spanType: 'tool' 
}, async (location: string) => {
  // Step 1: Geocode the location to get coordinates
  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
  const geocodingResponse = await fetch(geocodingUrl);
  
  if (!geocodingResponse.ok) {
    throw new Error(`Failed to geocode location '${location}': ${geocodingResponse.statusText}`);
  }
  
  const geocodingData = (await geocodingResponse.json()) as GeocodingResponse;

  if (!geocodingData.results?.[0]) {
    throw new Error(`Location '${location}' not found`);
  }

  const { latitude, longitude, name } = geocodingData.results[0];

  // Step 2: Fetch weather data using the coordinates
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,weather_code`;

  const response = await fetch(weatherUrl);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch weather data for '${name}': ${response.statusText}`);
  }
  
  const data = (await response.json()) as WeatherResponse;

  // Step 3: Transform the data into the expected format
  return {
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windGust: data.current.wind_gusts_10m,
    conditions: getWeatherCondition(data.current.weather_code),
    location: name,
  };
});

/**
 * Get Weather Condition Description
 * 
 * This function converts the numeric weather code from the Open-Meteo API
 * into a human-readable description of the weather conditions.
 * 
 * @param code - The numeric weather code from the API
 * @returns A human-readable description of the weather conditions
 */
function getWeatherCondition(code: number): string {
  const conditions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  
  return conditions[code] || 'Unknown';
}
