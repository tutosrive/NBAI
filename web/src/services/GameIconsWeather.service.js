import { fetch_JSON } from '../controllers/helpers/helpers.mjs'; 
/**
 * Get a climate and more information about the weather in that city
 * @param {String} city
 * @param {String} API_KEY
 * @returns {String} URL with the information of the city
 */

const API_KEY = 'Key'; // key of that page

export async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  return fetch_JSON(url); 
}
