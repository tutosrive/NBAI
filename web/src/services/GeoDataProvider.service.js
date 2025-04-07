import { fetch_JSON } from "../controllers/helpers/helpers.mjs";
/**
 * Get a flag image from a country code
 * @param {String} country_code
 * @returns {String} URL with the flag `.png`
 */
export function get_flags(country_code, style = "flat", size = 64) {
  return `https://flagsapi.com/${country_code}/${style}/${size}.png`;
}

export function get_weather_icons(code) {
  return `https://cdn.jsdelivr.net/gh/tutosrive/images-projects-srm-trg@main/NBAI/openweather/${code}.svg`;
}

/**
 * Get a climate and more information about the weather in that city
 * @param {String} city
 * @param {String} API_KEY
 * @returns {String} URL with the information of the city
 */

const API_KEY = "c00db9b55a97635912ea6cdabe4735db"; // key of that page

export async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
  return fetch_JSON(url);
}
