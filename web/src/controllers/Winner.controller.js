let timeout;

export async function winner(message) {
  const container = document.querySelector("#main");
  const res = await fetch("./html/Winner.html");
  const html = await res.text();
  container.innerHTML += html;
  load_winner(message);
}

function load_winner(message) {
  // Elementos del DOM
  const overlay = document.querySelector(".popup-overlay");
  const popup = document.querySelector(".popup-container");
  const btnExitGame = document.querySelector(".exit-game");
  showPopup(overlay, popup, message);
  // Event listeners
  btnExitGame.addEventListener("click", exitGame);
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
function restartGame() {
  hidePopup();
  load_home();
}

// Salir del juego
function exitGame() {
  Toast.show({ message: "Returning to the beginning" });
  load_home();
}

function load_home() {
  timeout = setTimeout(() => {
    location.hash = "#home";
    timeout = null;
  }, 3000);
}
