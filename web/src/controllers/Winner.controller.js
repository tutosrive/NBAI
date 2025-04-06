export async function winner() {
  const container = document.querySelector("#main");
  const res = await fetch("./html/Winner.html");
  const html = await res.text();
  console.log(html);
  container.innerHTML += html;
  load_winner();
}

function load_winner() {
  // Elementos del DOM
  const overlay = document.querySelector(".popup-overlay");
  const popup = document.querySelector(".popup-container");
  const btnPlayAgain = document.querySelector(".play-again");
  const btnExitGame = document.querySelector(".exit-game");
  showPopup(overlay, popup);
  // Event listeners
  btnPlayAgain.addEventListener("click", restartGame);
  btnExitGame.addEventListener("click", exitGame);
}

// Mostrar el popup
function showPopup(overlay, popup) {
  overlay.style.display = "flex";
  popup.style.animation = "popIn 0.3s ease-out";
}

// Ocultar el popup
function hidePopup() {
  overlay.style.display = "none";
}

// Reiniciar el juego
function restartGame() {
  hidePopup();
  alert("Reiniciando juego...");
  location.reload();
}

// Salir del juego
function exitGame() {
  alert("Saliendo del juego...");
  location.reload();
}
