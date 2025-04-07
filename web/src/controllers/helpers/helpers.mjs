/**
 * Request from URL and get the response in JSON format
 * @param {String} url URL to send the request
 * @param {{method: string, heders: {}, body: {name_key: any}}} config Objet with rquest config, `headers`, `method`, e.t.c.
 */
export async function fetch_JSON(url, config = {}) {
  if (config) {
    // Validate type config === {key:value}
    if (!(config instanceof Object) && !Array.isArray(config) && !config) throw new Error("La configuración debe ser un objeto {key: value}");
    // Validate that have a body
    if (config.method === "POST" && !config.body) throw new Error("Asegurarse de enviar un BODY si método es POST");
    // Cast Javascript Object to StringJSON
    config.body = JSON.stringify(config.body);
  }
  if (!Object.hasOwn(config, "headers")) config["headers"] = { Accept: "application/json" };
  else config.headers["Accept"] = "application/json";
  // Try request
  try {
    const request = await fetch(url, config);
    if (request.ok) {
      const response = await request.json();
      return { status: request.status, data: response };
    }
    return { status: request.status, data: null };
  } catch (e) {
    return { status: 500, data: "Internal Server Error", error: e };
  }
}

/**
 * Loads an HTML resource into an application layer
 * @param {String} url The route where the resource is located
 * @param {String} container Optionally, the layer where the content is inserted
 * @returns If the second argument is given, the container is returned, if not the resource is returned.
 */
export async function fetchText(url, container = null) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const html = await response.text();
      const element = document.querySelector(container);
      if (element) {
        element.innerHTML = html;
      }
      return { status: response.status, data: element || html }; // para permitir encadenamiento o para retornar el HTML
    } else {
      return { status: response.status, data: response.statusText, error: `Error trying to access ${url}` };
    }
  } catch (e) {
    return { status: response.status, data: null, error: `Error trying to access ${url}` };
  }
}

export const convert_kelvin_celcius = (kelkin_grades) => (kelkin_grades - 273.15).toFixed(2);
export async function toast_message(message) {
  // Elimina el toast anterior si existe
  const existingToastEl = document.querySelector("#toast1");
  if (existingToastEl) existingToastEl.remove();
  const toastHTML = `<div id="toast1" class="toast toast_message_001 position-fixed end-0 m-3" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="d-flex w-100 align-items-center">
      <div class="toast-body d-flex align-items-center justify-content-center">${message}</div>
      <button type="button" class="btn-close ms-auto me-2" data-bs-dismiss="toast" aria-label="Close" style="margin-top: -0.1rem;"></button>
    </div></div>`;

  document.body.insertAdjacentHTML("beforeend", toastHTML);
  const toastEl = document.querySelector("#toast1"); // Selecciona el nuevo elemento toast
  const toast = new bootstrap.Toast(toastEl); // Inicialízalo como un Toast de Bootstrap
  toast.show();

  let timeout = setTimeout(() => {
    if (toastEl) {
      toast.hide(); // Oculta el toast
      toastEl.addEventListener("hidden.bs.toast", () => {
        // Remueve el elemento después de que esté completamente oculto
        toastEl ? toastEl.remove() : null;
      });
    }
    timeout = null;
  }, 2000);
}
