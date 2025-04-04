// Elementos del DOM
const overlay = document.querySelector(".popup-overlay");
const popup = document.querySelector(".popup-container");
const btnPlayAgain = document.querySelector(".play-again");
const btnExitGame = document.querySelector(".exit-game");

// Mostrar el popup
function showPopup() {
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
}

// Salir del juego
function exitGame() {
  alert("Saliendo del juego...");
}

// Event listeners
btnPlayAgain.addEventListener("click", restartGame);
btnExitGame.addEventListener("click", exitGame);
