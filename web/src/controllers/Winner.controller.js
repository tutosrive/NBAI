let timeout;
let overlay;

export async function winner(message) {
  const container = document.querySelector("#main");
  const res = await fetch("./html/Winner.html");
  const html = await res.text();
  container.innerHTML += html;
  load_winner(message);
}

function load_winner(message) {
  // Elementos del DOM
  overlay = document.querySelector(".popup-overlay");
  const popup = document.querySelector(".popup-container");
  const btnExitGame = document.querySelector(".exit-game");
  const btnReload = document.querySelector(".reload-game");
  showPopup(overlay, popup, message);
  // Event listeners
  btnExitGame.addEventListener("click", exitGame);
  btnReload.addEventListener("click", reloadGame);
}

// Mostrar el popup
function showPopup(overlay, popup, message) {
  overlay.style.display = "flex";
  document.querySelector("#msg-end-game").innerHTML = message;
  popup.style.animation = "popIn 0.3s ease-out";
}

// Ocultar el popup
function hidePopup() {
  overlay.style.display = "none";
}

// Reiniciar el juego
function reloadGame() {
  hidePopup();
  Toast.show({ message: "Playing Again" });
  location.reload();
}

// Reload game
function exitGame() {
  hidePopup();
  Toast.show({ message: "Return Home" });
  load_home();
}

function load_home() {
  timeout = setTimeout(() => {
    location.hash = "#home";
    timeout = null;
  }, 3000);
}
