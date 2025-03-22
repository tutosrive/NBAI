import { fetch_JSON } from "../controllers/helpers/helpers.mjs";

/**
 * Get a flag image from a country code
 * @param {String} country_code
 * @returns {String} URL with the flag `.png`
 */
export function get_flags(country_code, style = "flat", size = 64) {
  return `https://flagsapi.com/${country_code}/${style}/${size}.png`;
}

/**
 * Send data/info to backend or an API
 * @param {String} url URL where the POST request will sent
 * @param {{key_name: value_key}} data The object to be sent as the body
 * @returns {any | null} A object "**data**" from the requested **URL** or a `null` value indicates that the request failed
 */
export async function send_data(url, data) {
  const config = { method: "POST", body: data, headers: { "Content-Type": "application/json" } }; // Request configuration
  return await fetch_JSON(url, config);
}
