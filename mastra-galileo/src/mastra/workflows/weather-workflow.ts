import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { log } from '../../logger/galileo-logger';

/**
 * Weather Forecast Schema
 * 
 * This schema defines the structure of weather forecast data
 * that is passed between workflow steps.
 */
const forecastSchema = z.object({
  location: z.string(),
  temperature: z.number(),
  feelsLike: z.number(),
  humidity: z.number(),
  windSpeed: z.number(),
  windGust: z.number(),
  conditions: z.string(),
});

/**
 * Weather Condition Mapping
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

/**
 * Fetch Weather Step
 * 
 * This step fetches weather forecast data for a given city using the Open-Meteo API.
 * It performs geocoding to convert the city name to coordinates, then fetches
 * the current weather data for those coordinates.
 */
const fetchWeather = createStep({
  id: 'fetch-weather',
  description: 'Fetches weather forecast for a given city',
  inputSchema: z.object({
    city: z.string().describe('The city to get the weather for'),
  }),
  outputSchema: forecastSchema,
  execute: async (params) => {
    const { inputData } = params;
    if (!inputData) {
      throw new Error('Input data not found');
    }

    console.log(`Fetching weather for ${inputData.city}`);

    // Step 1: Geocode the city to get coordinates
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(inputData.city)}&count=1`;
    const geocodingResponse = await fetch(geocodingUrl);
    
    if (!geocodingResponse.ok) {
      throw new Error(`Failed to geocode city '${inputData.city}': ${geocodingResponse.statusText}`);
    }
    
    const geocodingData = (await geocodingResponse.json()) as {
      results: { latitude: number; longitude: number; name: string }[];
    };

    if (!geocodingData.results?.[0]) {
      throw new Error(`Location '${inputData.city}' not found`);
    }

    const { latitude, longitude, name } = geocodingData.results[0];

    // Step 2: Fetch weather data using the coordinates
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,weather_code`;

    const response = await fetch(weatherUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data for '${name}': ${response.statusText}`);
    }
    
    const data = (await response.json()) as {
      current: {
        temperature_2m: number;
        apparent_temperature: number;
        relative_humidity_2m: number;
        wind_speed_10m: number;
        wind_gusts_10m: number;
        weather_code: number;
      };
    };

    // Step 3: Transform the data into the expected format
    const forecast = {
      location: name,
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      windGust: data.current.wind_gusts_10m,
      conditions: getWeatherCondition(data.current.weather_code),
    };

    return forecast;
  },
});

/**
 * Plan Activities Step
 * 
 * This step uses the weather agent to generate activity recommendations
 * based on the weather forecast data. It creates a prompt with the weather
 * information and streams the agent's response.
 */
const planActivities = createStep({
  id: 'plan-activities',
  description: 'Plans activities based on weather forecast using the weather agent',
  inputSchema: forecastSchema,
  outputSchema: z.object({
    activities: z.string(),
  }),
  execute: async (params) => {
    const { inputData, mastra } = params;
    const forecast = inputData;

    if (!forecast) {
      throw new Error('Forecast data not found');
    }

    const agent = mastra?.getAgent('weatherAgent');
    if (!agent) {
      throw new Error('Weather agent not found');
    }

    console.log(`Planning activities for ${forecast.location}`);

    // Create a comprehensive prompt with weather information
    const prompt = `Based on the following weather forecast for ${forecast.location}:

Temperature: ${forecast.temperature}°C (feels like ${forecast.feelsLike}°C)
Humidity: ${forecast.humidity}%
Wind Speed: ${forecast.windSpeed} km/h
Wind Gusts: ${forecast.windGust} km/h
Conditions: ${forecast.conditions}

Please suggest 3-5 activities that would be suitable for this weather. Consider:
- Indoor vs outdoor activities
- Safety considerations (e.g., avoiding outdoor activities in storms)
- Comfort factors (temperature, wind, humidity)
- Seasonal appropriateness

Format your response as a numbered list with brief explanations for each activity.`;

    let activitiesText = '';
    const startTime = Date.now();

    try {
      // Stream the agent's response
      const response = await agent.stream([
        {
          role: 'user',
          content: prompt,
        },
      ]);

      // Process the streaming response
      for await (const chunk of response.textStream) {
        process.stdout.write(chunk);
        activitiesText += chunk;
      }

      const duration = Date.now() - startTime;
      console.log(`\nActivity planning completed in ${duration}ms`);

    } catch (err) {
      console.error('Error during activity planning:', err);
      throw err;
    }

    const result = {
      activities: activitiesText,
    };

    return result;
  },
});

/**
 * Weather Workflow
 * 
 * This workflow orchestrates the weather forecasting and activity planning process.
 * It first fetches weather data for a given city, then uses that data to generate
 * personalized activity recommendations.
 */
const weatherWorkflow = createWorkflow({
  id: 'weather-workflow',
  inputSchema: z.object({
    city: z.string().describe('The city to get the weather for'),
  }),
  outputSchema: z.object({
    activities: z.string(),
  }),
})
  .then(fetchWeather)
  .then(planActivities);

weatherWorkflow.commit();

export { weatherWorkflow };
