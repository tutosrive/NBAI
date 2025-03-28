export default class DOMClimate {
  #container;
  #climate;
  #icon_weather;
  #page;
  /**
   * Create a **DOMClimate** Object
   * @param {HTMLElement} container HTML climate information container
   * @param {JSON} climate Climate information, get from **API OpenWeather**
   * @param {String} icon **URL** to acces icon weather ('**https://www.some/icon/{code}.svg**')
   * @param {String} page Name actual page
   */
  constructor(container, climate, icon, page = null) {
    this.#container = container;
    this.#climate = climate;
    this.#icon_weather = icon;
    this.#climate.main.temp = Helpers.convert_kelvin_celcius(this.#climate.main.temp);
    this.#page = page;
    this.load_climate_map();
  }

  load_climate_map() {
    // FUNCTIONAL
    const html_card_weather = () => {
      this.#container.classList.remove('w-container-climate2');
      this.#container.classList.add('w-container-climate1');
      return `
        <div class="row climate-card rounded-pill align-items-center p-2">
           <div class="col-lg-6">
            <div class="text-center">${window.country_name}</div>
            <div class="text-center">${this.#climate.weather[0].description}</div>
           </div>
           <div class="vl"></div>
           <div class="col-lg-5 row row-cols-2 align-items-center">
            <div class="col p-0"><img class="shadow-img" src="${this.#icon_weather}" alt="Icon weather, ${this.#climate.weather[0].description}"></div>
            <div class="col mt-2"><p><span class="fs-5 fw-semibold">${this.#climate.main.temp}°C</span></p></div>
           </div>
        </div>
    `;
    };
    const html_icon_weather = () => {
      this.#container.classList.remove('w-container-climate1');
      this.#container.classList.add('w-container-climate2');
      return `<div class="p-0"><img class="shadow-img" src="${this.#icon_weather}" alt="Icon weather, ${this.#climate.weather[0].description}"></div>`;
    };
    this.#container.innerHTML = this.#page === 'map' ? html_card_weather() : html_icon_weather();
  }
}
