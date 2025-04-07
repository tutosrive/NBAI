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
export async function getBoardSize(callback) {
  const modalHTML = `
  <div class="modal fade" id="boardModal" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header justify-content-center"><h5 class="modal-title">Select board size</h5></div>
        <div class="modal-body text-center justify-content-center">
          <div class="d-flex justify-content-center"><input type="number" id="sizeInput" class="form-control mb-2 text-center w-50" min="10" max="20" placeholder="Min 10, Max 20" required></div>
          <p class="text-danger d-none">Minimum value (10), Maximum value (20)!</p>
        </div>
        <div class="modal-footer"><button class="btn btn-primary" onclick="handleOk()">Accept</button></div>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
  const modal = new bootstrap.Modal("#boardModal");
  const input = document.getElementById("sizeInput");

  window.handleOk = () => {
    if (input.checkValidity()) {
      callback(Number(input.value));
      const modal_1 = document.querySelector("#boardModal");
      modal.hide();
      if (modal_1) document.body.removeChild(modal_1);
    } else {
      document.querySelector(".text-danger").classList.remove("d-none");
    }
  };
  modal.show();
}
