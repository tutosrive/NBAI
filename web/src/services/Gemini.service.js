export default class Gemini {
  static #URL_API;
  static #prompt;
  static init(matrix, positions_shooted) {
    if (!matrix || !Array.isArray(matrix) || matrix.length === 0) return { status: 400, message: "Invalid matrix provided." };
    // Set the prompt for the Gemini API
    Gemini.#prompt = `Instrucciones: Recibe una matriz de "Naval Battle" donde cada celda tiene un valor: 1 = disparo acertado (parte del barco), -1 = disparo fallido (bomba, sin barco) y 0 = celda intacta (sin disparo). Analiza la matriz y elige la posición [row, col] óptima para disparar. Asegúrate de elegir una posición donde el valor en la matriz sea 0 para evitar repetir disparos. Si en la matriz existen celdas con valor 1 (disparo acertado), considera como objetivo prioritario las casillas adyacentes (arriba, abajo, izquierda o derecha) que tengan valor 0. **Evita seleccionar cualquiera de las siguientes posiciones donde ya se ha disparado: ${positions_shooted}.** Responde SIEMPRE con el siguiente formato EXACTO: {"message":"Mensaje de ánimo y juego", "position":[row, col]} sin saltos de línea, sin formato extra, solo ese string puro. Esta es la matriz: ${matrix}`;
    Gemini.#URL_API = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBSzZ0OwIhIdsllSzgrfoj5iW8E9c7DAx4";
    return Gemini.#ask();
  }
  /** Send query to Gemini */
  static async #ask() {
    const request = { contents: [{ parts: [{ text: Gemini.#prompt }] }] };
    try {
      const response = await fetch(Gemini.#URL_API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request) });
      const data = await response.json();
      return { status: response.status, data: JSON.parse(data?.candidates?.[0]?.content?.parts?.[0]?.text) || "No response" };
    } catch (error) {
      return { status: 500, message: "Error fetching response.", error };
    }
  }
}
