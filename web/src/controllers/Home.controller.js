import UserController from "./User.controller.js";
import Events from "../models/Events.event.js";
import { get_data } from "../services/GameScoreManager.service.js";
import { get_flags } from "../services/GeoDataProvider.service.js";

export default class HomeGame {
  static boardSizeOptions;
  static boardSizeSelect;
  static rankCheckboxes;
  static startButton;
  static ranking_container;

  static init() {
    this.boardSizeOptions = {
      Cadet: [
        { value: "10x10", text: "10x10" },
        { value: "11x11", text: "11x11" },
        { value: "12x12", text: "12x12" },
      ],
      Seafarer: [
        { value: "13x13", text: "13x13" },
        { value: "14x14", text: "14x14" },
      ],
      Commander: [
        { value: "15x15", text: "15x15" },
        { value: "16x16", text: "16x16" },
      ],
      Captain: [
        { value: "17x17", text: "17x17" },
        { value: "18x18", text: "18x18" },
      ],
      Admiral: [
        { value: "19x19", text: "19x19" },
        { value: "20x20", text: "20x20" },
      ],
    };

    this.#initializeTooltips();
    this.boardSizeSelect = document.getElementById("board");
    this.rankCheckboxes = document.querySelectorAll('input[name="rank"]');
    this.startButton = document.querySelector(".btn-start");
    this.ranking_container = document.querySelector("#ranking-sect");
    this.#setupRankSelection();
    this.#setDefaultRankSelection();
    this.#setupStartButton();
    this.load_ranking();
  }

  static async load_ranking() {
    const data = await get_data(`${URL_API}/ranking`);
    const div_ranking = (data) => {
      const flag = data.country_code ? `<img class="flag-img" src="${get_flags(data.country_code)}" alt="Flag of ${data.country_code}"/>` : "---";
      return `<div class="row row-cols-3 w-100 text-center p-0 m-0 overflow-y-scroll align-items-center">
      <div class="col"><p>${data.nick_name}</p></div><div class="col"><p>${data.score}</p></div>
      <div class="col">${flag}</div></div>`;
    };

    if (data) {
      data.data.forEach((ranking_info) => {
        this.ranking_container.innerHTML += div_ranking(ranking_info);
      });
      return;
    }
    this.ranking_container.innerHTML += div_ranking({ nick_name: "----", score: "----" });
  }

  static #initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  /**
   * Generates HTML options for a select element
   * @param {Object} options - Configuration object
   * @param {Array} options.items - Array of objects to create options from
   * @param {string} options.value - Property name to use as option value
   * @param {string} options.text - Property name to use as option text
   * @param {string} options.selected - Value that should be marked as selected
   * @param {string} options.firstOption - Optional first option text (empty value)
   * @returns {string} HTML string with option elements
   */
  static toOptionList({ items = [], value = "value", text = "text", selected = "", firstOption = "" } = {}) {
    let optionsHTML = "";

    if (firstOption) {
      optionsHTML += `<option value="">${firstOption}</option>`;
    }

    items.forEach((item) => {
      const isSelected = item[value] == selected;
      optionsHTML += `<option value="${item[value]}" ${isSelected ? "selected" : ""}>${item[text]}</option>`;
    });

    return optionsHTML;
  }

  /**
   * actualizar las opciones de tamaño del tablero según el rango seleccionado
   * @param {*} selectedRank
   */
  static updateBoardSizes(selectedRank) {
    const sizes = this.boardSizeOptions[selectedRank];

    this.boardSizeSelect.innerHTML = this.toOptionList({
      items: sizes,
      value: "value",
      text: "text",
      firstOption: "Select size...",
    });
  }

  static #setupRankSelection() {
    this.rankCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        if (this.checked) {
          // Desmarcar otros checkboxes
          HomeGame.rankCheckboxes.forEach((cb) => {
            if (cb !== this) cb.checked = false;
          });
          HomeGame.updateBoardSizes(this.value);
        }
      });
    });
  }

  static #setDefaultRankSelection() {
    const firstRankCheckbox = document.querySelector('input[name="rank"]');
    if (firstRankCheckbox) {
      firstRankCheckbox.checked = true;
      this.updateBoardSizes(firstRankCheckbox.value);
    }
  }

  static #setupStartButton() {
    const ev = new Events();
    this.startButton.addEventListener("click", function () {
      if (!localStorage.getItem("user_nbai")) {
        Toast.show({ message: "First Sign Up, please." });
        return new UserController();
      }
      const selectedMap = document.querySelector('input[name="map"]:checked');
      const selectedRank = document.querySelector('input[name="rank"]:checked');
      const selectedSize = HomeGame.boardSizeSelect.value;
      const toast_waning = (message) => Toast.show({ message: message, mode: "warning" });
      if (!selectedMap) {
        toast_waning("Please select a map");
        return;
      }

      if (!selectedRank) {
        toast_waning("Please select a rank");
        return;
      }

      if (!selectedSize) {
        toast_waning("Please select a board size");
        return;
      }
      const data = { MAP: selectedMap.value, RANK: selectedRank.value, SIZE: parseInt(selectedSize.slice(0, 2), 10) };
      localStorage.setItem("DATA_NBAI", JSON.stringify(data));
      document.querySelector("#map-link").click();

      let timeout = setTimeout(() => {
        ev.spread("PlayerPlay", data);
        timeout = null;
      }, 1000);
    });
  }
}
