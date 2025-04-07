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
    console.log(this.#climate);

    this.#climate.main.temp = Helps.convert_kelvin_celcius(this.#climate.main.temp);
    this.#page = page;
    this.load_climate_map();
  }

  load_climate_map() {
    const html_card_weather = () => {
      this.#container.classList.remove("w-container-climate2");
      this.#container.classList.add("w-container-climate1");
      return `<div class="col-12 col-md-11 mx-auto p-2">
    <div class="climate-card-wrapper">
        <div class="row climate-card rounded-pill align-items-center p-2">
            <div class="col-md-6 d-flex flex-column align-items-center">
                <div class="text-center small">${COUNTRY_NAME}</div>
                <div class="text-center small">${this.#climate.weather[0].description}</div>
            </div>
            <div class="col-md-5 row row-cols-2 align-items-center justify-content-around">
                <div class="col-6 p-0 d-flex justify-content-center"><img class="shadow-img climate-icon" src="${this.#icon_weather}" alt="Icon weather, ${this.#climate.weather[0].description}"></div>
                <div class="col-6 mt-1 d-flex justify-content-center"><p class="m-0 ps-4"><span class="fs-6 fw-semibold climate-temp">${this.#climate.main.temp}°C</span></p></div>
            </div>
        </div>
    </div>
</div>`;
    };
    const html_icon_weather = () => {
      this.#container.classList.remove("w-container-climate1");
      this.#container.classList.add("w-container-climate2");
      return `<div class="p-0"><img class="shadow-img" src="${this.#icon_weather}" alt="Icon weather, ${this.#climate.weather[0].description}"></div>`;
    };
    this.#container.innerHTML = this.#page === "map" ? html_card_weather() : html_icon_weather();
  }
}
