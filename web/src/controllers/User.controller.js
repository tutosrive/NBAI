import Popup from "https://cdn.jsdelivr.net/gh/tutosrive/legendary-guacamole@main/javascript/from-prog2/v2/popup-v2.js";
import { fetchText } from "../controllers/helpers/helpers.mjs";
import icons from "https://cdn.jsdelivr.net/gh/tutosrive/legendary-guacamole@main/javascript/from-prog2/v1/icons.js";
import { get_data, send_data } from "../services/GameScoreManager.service.js";
window.icons = icons; // Needded to use icons in "toast"

export default class UserController {
  #mode; // 'add' or 'view'
  #data_user; // Required data to load into form
  #html_user; // HTML template (Modal content)
  #__countries; // All dict countries
  #__cities; // All cities, get from API
  #option_countries; // Options to select countries
  #option_cities; // Options to select cities
  #__country_selected; // Code country selected
  #__modal; // Modal object
  constructor() {
    this.#data_user = localStorage.getItem("user_nbai");
    this.#mode = this.#data_user ? "view" : "add";
    this.init();
  }
  /** Load required data */
  async init() {
    this.#html_user = (await fetchText("./html/User.html")).data;

    // Load countries
    this.#__countries = (await get_data(`${URL_API}/countries`)).data;
    this.#option_countries = "";
    this.#__countries.forEach((country_dict) => {
      const country = country_dict[Object.keys(country_dict)[0]];
      this.#option_countries += `<option value="${Object.keys(country_dict)[0]}">${country}</option>`;
    });
    this.#__userModal();
  }
  /** Load Modal into document */
  async #__userModal() {
    if (this.#__modal) this.#__modal.remove();
    let btns = [];
    if (this.#mode === "add") btns.push({ caption: "Agregar", classes: "btn btn-primary me-2", action: () => this.#send_user() });
    btns.push({ caption: "Cerrar", classes: "btn btn-danger me-2", action: () => this.#__modal.remove() });
    // Create a modal
    this.#__modal = new Popup({ modal: false, classes: "bg-dark text-white col-12 col-sm-8 col-md-6 col-lg-6 col-xl-5 col-xxl-7 p-3 rounded", title: '<h5 id="user-modal-title" class="text-info">User</h5>', content: this.#html_user, buttons: btns, doSomething: (id_modal) => this.#__load_information(id_modal) });
    this.#__modal.show();
  }
  /**
   * Load Information into Modal
   * @param {String} modal_id ID current MODAL
   */
  #__load_information(modal_id) {
    const countries_select = document.querySelector(`#${modal_id} #country-select-user`);
    const cities_select = document.querySelector(`#${modal_id} #city-select-user`);
    const user_name_input = document.querySelector(`#${modal_id} #name-user`);
    const nickname_input = document.querySelector(`#${modal_id} #nickname-user`);
    if (this.#mode === "add") this.#__add_user(cities_select, countries_select);
    else this.#__view_user(modal_id, countries_select, cities_select, user_name_input, nickname_input);
  }
  /** Load into Modal the requried data to add new user */
  #__add_user(cities_select, countries_select) {
    Toast.show({ message: "Register User", duration: 1000 });
    countries_select.innerHTML += this.#option_countries;
    document.querySelector("#user-modal-title").innerHTML = "Register User";
    document.querySelectorAll(["#country-select-user", "#name-user", "#nickname-user"]).forEach((item) => (item.disabled = false));
    document.querySelector("#country-select-user").addEventListener("change", async (e) => {
      this.#__country_selected = e.target[e.target.selectedIndex];
      //   Load cities
      const response = await get_data(`http://geodb-free-service.wirefreethought.com/v1/geo/countries/${this.#__country_selected.value}/places?limit=10&types=CITY&languageCode=es&sort=name`);
      if (response.status !== 200) {
        Toast.show({ title: "Warning", message: `Country <span class="text-warning">${this.#__country_selected.textContent}</span> is not allowed`, mode: "warning" });
        return;
      }
      if (response.data.data.length) {
        cities_select.disabled = false; // Activate the SELECT
        this.#__cities = response.data.data; // Get data obtained from API
        cities_select.innerHTML = '<option value="">Select a city</option>'; // Add first option
        this.#option_cities = "";
        // Create an option for each data city
        this.#__cities.map((city_dict) => (this.#option_cities += `<option value="${city_dict.name}">${city_dict.name}</option>`));
        cities_select.innerHTML += this.#option_cities;
      } else {
        cities_select.disabled = true;
        Toast.show({ title: "Information", message: `Country <span class="text-warning">${this.#__country_selected.textContent}</span> is not allowed`, mode: "warning" });
      }
    });
  }
  /** Load and view info about user */
  async #__view_user(id_modal, countries_select, cities_select, user_name_input, nickname_input) {
    document.querySelector("#user-modal-title").innerHTML = "User profile information";
    this.#data_user = JSON.parse(localStorage.getItem("user_nbai")) || {};
    // Validate user data
    if (Object.getOwnPropertyNames(this.#data_user).length === 0) {
      Toast.show({ title: "Information", message: `There is no user`, mode: "warning", error: "User data has no ownership" });
      return;
    }
    // Load data into inputs
    user_name_input.value = this.#data_user.user_name;
    nickname_input.value = this.#data_user.nickname;
    countries_select.innerHTML = `<option>${this.#data_user.country.name}</option>`;
    cities_select.innerHTML = `<option>${this.#data_user.city}</option>`;
    const html_aditional = `<!-- Score --><div class="col"><div class="form-group">
  <label for="score" class="form-label my-0">Total Score</label><input class="form-control" name="score" disabled value="${this.#data_user.score}"/>
</div></div><!-- Score Current Level --><div class="col"><div class="form-group">
  <label for="score-level" class="form-label my-0">Score Level</label><input class="form-control" name="score-level" disabled value="${this.#data_user.score_level}"/>
</div></div>`;
    document.querySelector(`#${id_modal} #row-container-user`).insertAdjacentHTML("beforeend", html_aditional);
  }
  /** Send User to Backend */
  async #send_user() {
    const user_name_input = document.querySelector("#name-user");
    const nickname_input = document.querySelector("#nickname-user");
    const country_input = document.querySelector("#country-select-user");
    const city_input = document.querySelector("#city-select-user");
    if (user_name_input.value === "" || nickname_input.value === "" || country_input.value === "" || city_input.value === "") {
      Toast.show({ title: "Information", message: `Please fill all fields`, mode: "warning" });
      return;
    }
    const country_info = { code: this.#__country_selected.value.toUpperCase(), name: this.#__country_selected.textContent };
    localStorage.setItem("user_nbai", JSON.stringify({ user_name: user_name_input.value, nickname: nickname_input.value, country: country_info, city: city_input.value, score: 0, score_level: 0 }));
    // Send data to API
    const response = await send_data(`${URL_API}/score-recorder`, { nick_name: nickname_input.value, country_code: this.#__country_selected.value.toUpperCase(), score: 0 });
    if (response.status !== 200) {
      Toast.show({ title: "Error", message: `Error sending data`, mode: "danger" });
      return;
    }
    Toast.show({ title: "Success", message: `User <span class="text-success">${nickname_input.value}</span> added successfully`, mode: "success" });
    this.#__modal.remove(); // Close modal
  }
}
