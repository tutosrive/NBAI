import { get_weather_icons, getWeather } from "../services/GeoDataProvider.service.js";
import DOMClimate from "./DOMClimate.controller.js";
import * as Helps from "./helpers/helpers.mjs";
import HomeGame from "./Home.controller.js";
import * as MapController from "./Map.controller.js"; // Importa el controlador del mapa
import UserController from "./User.controller.js";
import Toast from "https://cdn.jsdelivr.net/gh/tutosrive/legendary-guacamole@main/javascript/from-prog2/v2/toast-v2-3.js";

class App {
  static #main_container;
  static #climate_container;
  static #__timeout;
  static #routes = {};
  static #isLoadingContent = false; // Nueva bandera para controlar la carga

  static async init() {
    document.addEventListener("DOMContentLoaded", async () => {
      window.URL_API = "http://127.0.0.1:5000";
      window.Toast = Toast; // To show messages
      window.Helps = Helps;
      App.#main_container = document.querySelector("#main"); // 1. Configurar rutas con hash
      App.#climate_container = document.querySelector("#climate-container"); // 1. Configurar rutas con hash

      App.#routes = {
        "#home": (await Helps.fetchText("./html/Home.html")).data,
        "#map": (await Helps.fetchText("./html/Map.html")).data,
        "#user": "<h1>Acerca de</h1>",
      };
      const initialHash = window.location.hash || "#home";
      await App.#loadContent(initialHash); // Esperar la carga inicial
      App.#setupNavigation();

      // Inicializar los tooltips de Bootstrap
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

      // Forzar el cierre de los tooltips al hacer clic en el elemento que los dispara
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        tooltipTriggerEl.addEventListener("click", () => {
          const tooltip = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
          if (tooltip) {
            tooltip.hide();
          }
        });
      });
    });
  }

  static async #loadContent(hash) {
    if (App.#isLoadingContent) {
      console.log("Carga de contenido en curso, ignorando:", hash);
      return;
    }
    App.#isLoadingContent = true;
    const __user = localStorage.getItem("user_nbai");
    document.querySelector("#dialog-001") ? document.body.removeChild(document.querySelector("#dialog-001")) : null;
    console.log("Cargando:", hash);
    const routeName = hash.substring(1);
    document.title = `Mi Sitio - ${routeName.charAt(0).toUpperCase() + routeName.slice(1)}`;

    App.#main_container.innerHTML = App.#routes[hash] || `<h1>Página no encontrada: ${hash}</h1>`; // Inicializar el controlador del mapa si la ruta es #map

    if (hash === "#home") {
      if (__user) this.load_climate("home", __user);
      if (!__user) new UserController();
      HomeGame.init();
    }
    if (hash === "#map") {
      if (__user) this.load_climate("map", __user);
      if (!__user) {
        window.location.hash = "#home"; // Cambiar el hash directamente
        App.#isLoadingContent = false;
        return;
      }
      MapController.init();
    }
    App.#isLoadingContent = false;
  }

  static async load_climate(page, __user) {
    window.CITY_USER = JSON.parse(__user).city;
    window.COUNTRY_NAME = JSON.parse(__user).country.name;
    const climate = (await getWeather(CITY_USER)).data ?? "Manizales";
    console.log(climate);

    new DOMClimate(this.#climate_container, climate, get_weather_icons(climate.weather[0].icon), page);
  }

  static #setupNavigation() {
    const dropdownLinks = document.querySelectorAll(".dropdown-menu .dropdown-item");

    dropdownLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        const hash = new URL(link.href).hash;

        if (hash === "#user/profile") {
          // Ejecutar la lógica para el perfil sin cambiar la ruta
          new UserController();
          e.stopPropagation();
          return;
        }

        if (hash === "#user/logout") {
          const __user = localStorage.getItem("user_nbai");
          console.log(__user);
          if (!__user) return Toast.show({ message: "There are no registered users, please Sign Up", mode: "warning" });

          localStorage.removeItem("user_nbai");
          Toast.show({ message: "We're sorry to see you go, please come back soon." });
          window.location.hash = "#home";
          App.#__timeout = null;

          e.stopPropagation();
          return;
        }

        // Si llegamos aquí, significa que el enlace no era perfil ni logout,
        // y el cambio de hash predeterminado debería permitir que se active el enrutador.
        window.location.hash = hash;
        App.#loadContent(hash);
      });
    });

    // Mantener el listener para los cambios de hash directos en la URL
    window.addEventListener("hashchange", () => {
      App.#loadContent(window.location.hash);
    });
  }
}

App.init();
