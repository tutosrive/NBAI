/**
 * Get a flag image from a country code
 * @param {String} country_code
 * @returns {String} URL with the flag `.png`
 */
export function get_flags(country_code, style = 'flat', size = 64) {
  return `https://flagsapi.com/${country_code}/${style}/${size}.png`;
}
