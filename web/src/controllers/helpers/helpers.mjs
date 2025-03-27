/**
 * Request from URL and get the response in JSON format
 * @param {String} url URL to send the request
 * @param {{method: string, heders: {}, body: {name_key: any}}} config Objet with rquest config, `headers`, `method`, e.t.c.
 */
export async function fetch_JSON(url, config = null) {
  if (config) {
    // Validate type config === {key:value}
    if (!(config instanceof Object) && !Array.isArray(config) && !config) throw new Error('La configuración debe ser un objeto {key: value}');
    // Validate that have a body
    if (config.method === 'POST' && !config.body) throw new Error('Asegurarse de enviar un BODY si método es POST');
    // Cast Javascript Object to StringJSON
    config.body = JSON.stringify(config.body);
  }
  config.headers['Accept'] = 'application/json';
  // Try request
  try {
    const request = await fetch(url, config);
    if (request.ok) {
      const response = await request.json();
      return { status: request.status, data: response };
    }
    return { status: request.status, data: null };
  } catch (e) {
    return { status: 500, data: 'Internal Server Error', error: { message: e.message, code: e.cause.errno } };
  }
}

export const convert_kelvin_celcius = (kelkin_grades) => (kelkin_grades - 273.15).toFixed(2);
