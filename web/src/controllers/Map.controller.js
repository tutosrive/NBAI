import Ship from "../models/Ship.model.js";
import { send_data } from "../services/GameScoreManager.service.js";
import Gemini from "../services/Gemini.service.js";
import { getBoardSize } from "./helpers/helpers.mjs";
import ScoreCalculator from "./ScoreCalculator.controller.js";
import { winner } from "./Winner.controller.js";

export async function init() {
  load_maps(); // Llama a load_maps directamente, el HTML ya está cargado
}

let BOARD_SIZE; // Tamaño por defecto, configurable entre 10 y 20
let SHIPS_CONFIG = [
  { size: 5, name: "aircraft carrier", id: "carrier" },
  { size: 4, name: "battleship", id: "battleship" },
  { size: 3, name: "cruiser", id: "cruiser1" },
  { size: 3, name: "cruiser", id: "cruiser2" },
  { size: 2, name: "submarine", id: "submarine1" },
  { size: 2, name: "submarine", id: "submarine2" },
];

let scoreCalculator;
let currentTurn;
let orientation;
let playerBoard;
let machineBoard;
let orientationBtn;
let shipInfoPanel; // Panel to display ship info
let aiMessageToast;
let aiMessageToastBody;

let playerShips = [];
let machineShips = [];
let shipIndex = 0; // Index of the ship being placed by the player
let aiPreviousTargets = []; // Inicializa el array para almacenar los objetivos de la IA

function showToast(message) {
  aiMessageToastBody.innerHTML = `<strong>${message}</strong>`;
  aiMessageToast.classList.add("show"); // Crear y añadir el backdrop usando las clases de Bootstrap

  const backdrop = document.createElement("div");
  backdrop.classList.add("modal-backdrop", "fade", "show"); // Clases de Bootstrap para el backdrop
  document.body.appendChild(backdrop);

  let timeout = setTimeout(() => {
    if (backdrop && backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
    }
    aiMessageToast.classList.remove("show"); // Remover el backdrop
    timeout = null;
  }, 3000);
}

function createBoard(container, isPlayer) {
  container.innerHTML = "";
  for (let i = 0; i < BOARD_SIZE; i++) {
    const rowDiv = document.createElement("div");
    rowDiv.dataset.row = i;
    rowDiv.style.display = "flex";
    rowDiv.style.gap = "2px";

    for (let j = 0; j < BOARD_SIZE; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;
      const index = i * BOARD_SIZE + j;
      cell.dataset.index = index;

      if (!isPlayer) {
        cell.addEventListener("click", () => {
          if (currentTurn !== "player" || cell.classList.contains("hit") || cell.classList.contains("miss")) return;
          handleAttack(cell, machineBoard, machineShips, true);
        });
        cell.classList.add("machine-cell");
      } else {
        cell.addEventListener("click", () => placePlayerShip(cell));
      }
      rowDiv.appendChild(cell);
    }
    container.appendChild(rowDiv);
  }
}

function indexToCoord(index) {
  return { row: Math.floor(index / BOARD_SIZE), col: index % BOARD_SIZE };
}

function coordToIndex(row, col) {
  return row * BOARD_SIZE + col;
}

function canPlaceShipPreview(board, startRow, startCol, size, orientation) {
  if (orientation === "horizontal" && startCol + size > BOARD_SIZE) return false;
  if (orientation === "vertical" && startRow + size > BOARD_SIZE) return false;

  for (let i = 0; i < size; i++) {
    const r = orientation === "horizontal" ? startRow : startRow + i;
    const c = orientation === "horizontal" ? startCol + i : startCol;
    if (r >= BOARD_SIZE || c >= BOARD_SIZE) return false; // Boundary check
    const cell = board.querySelector(`[data-row="${r}"][data-col="${c}"]`);
    if (cell && cell.classList.contains("ship")) return false;
  }
  return true;
}

function placeShip(board, row, col, ship, shipList, isPlayer = false) {
  const positions = [];
  for (let i = 0; i < ship.size; i++) {
    const r = orientation === "horizontal" ? row : row + i;
    const c = orientation === "horizontal" ? col + i : col;
    const cell = board.querySelector(`[data-row="${r}"][data-col="${c}"]`);

    if (cell) {
      cell.classList.add("ship");
      positions.push({ row: r, col: c });
    }
  }
  ship.setPositions(positions);
  shipList.push(ship);
}

function updateShipInfoPanel() {
  if (shipIndex < SHIPS_CONFIG.length) {
    const currentShip = SHIPS_CONFIG[shipIndex];
    shipInfoPanel.innerHTML = `<span class="badge text-bg-warning">Placing: ${currentShip.name}</span> <span class="badge text-bg-info">Size: ${currentShip.size}</span>`;
  } else {
    shipInfoPanel.classList.add("bg-succes");
    shipInfoPanel.textContent = "All ships placed!";
    shipInfoPanel.classList.add("visually-hidden");
  }
}

function placePlayerShip(cell) {
  if (shipIndex >= SHIPS_CONFIG.length) return;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  const config = SHIPS_CONFIG[shipIndex];
  const ship = new Ship(config.id, config.size, config.name);

  if (canPlaceShipPreview(playerBoard, row, col, ship.size, orientation)) {
    // Corrección aquí
    placeShip(playerBoard, row, col, ship, playerShips, true);
    shipIndex++;
    updateShipInfoPanel();
    if (shipIndex === SHIPS_CONFIG.length) {
      createMachineShips();
      enableMachineBoard();
      currentTurn = "player"; // Start the game with the player's turn // Remove preview event listeners after all ships are placed
      playerBoard.removeEventListener("mouseover", showShipPreview);
      playerBoard.removeEventListener("mouseout", clearShipPreview); // Eliminar explícitamente la clase 'preview' de todas las celdas

      const allCells = playerBoard.querySelectorAll(".cell");
      allCells.forEach((cell) => cell.classList.remove("preview"));
    }
  }
}

function createMachineShips() {
  for (const config of SHIPS_CONFIG) {
    const ship = new Ship(config.id, config.size, config.name);
    let placed = false;
    while (!placed) {
      const orient = Math.random() < 0.5 ? "horizontal" : "vertical";
      const row = Math.floor(Math.random() * BOARD_SIZE);
      const col = Math.floor(Math.random() * BOARD_SIZE);
      const originalOrientation = orientation;
      orientation = orient;
      if (canPlaceShipPreview(machineBoard, row, col, ship.size, orientation)) {
        // Corrección aquí
        placeShip(machineBoard, row, col, ship, machineShips);
        orientation = originalOrientation;
        placed = true;
      }
    }
  }
}

function enableMachineBoard() {
  const cells = machineBoard.querySelectorAll(".machine-cell");
  cells.forEach((cell) => cell.classList.add("enabled"));
}

function disableMachineBoard() {
  const cells = machineBoard.querySelectorAll(".machine-cell");
  cells.forEach((cell) => cell.classList.remove("enabled"));
}

function registerHit(row, col, ships) {
  for (const ship of ships) {
    const hitPosition = ship.positions.find((pos) => pos.row === row && pos.col === col);
    if (hitPosition) {
      ship.hit();
      return true;
    }
  }
  return false;
}

function handleAttack(cell, board, ships, isPlayerTurn) {
  if (isPlayerTurn && currentTurn !== "player") return;
  if (!isPlayerTurn && currentTurn !== "machine") return;

  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  if (cell.classList.contains("hit") || cell.classList.contains("miss")) return;

  const wasHit = registerHit(row, col, ships);

  if (wasHit) {
    cell.classList.add("hit");
    cell.textContent = "❌";
    if (!cell.classList.contains("ship")) {
      cell.classList.add("ship");
    }
    scoreCalculator.recordHit(); // Registrar acierto
    if (checkWin(ships, isPlayerTurn ? "¡Ganaste!" : "¡Perdiste!")) return;
    if (!isPlayerTurn) {
      setTimeout(machineTurn, 1500);
    }
  } else {
    cell.classList.add("miss");
    cell.textContent = "💣";
    currentTurn = isPlayerTurn ? "machine" : "player";

    // Lógica para verificar si el fallo estuvo adyacente a un barco enemigo
    if (isPlayerTurn) {
      const isNearMiss = checkNearMiss(row, col, machineShips);
      if (isNearMiss) {
        scoreCalculator.recordNearMiss(); // Registrar fallo cercano
      } else {
        scoreCalculator.recordMiss(); // Registrar fallo normal
      }
    }

    if (currentTurn === "machine") {
      disableMachineBoard();
      setTimeout(machineTurn, 1500);
    } else if (currentTurn === "player") {
      enableMachineBoard();
    }
  }
}

// Nueva función para verificar si un disparo fallido estuvo cerca de un barco enemigo
function checkNearMiss(missedRow, missedCol, enemyShips) {
  for (const ship of enemyShips) {
    for (const position of ship.positions) {
      const shipRow = position.row;
      const shipCol = position.col;

      // Verificar adyacencia a la redonda (incluyendo diagonales)
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue; // No verificar la misma celda
          if (missedRow + i === shipRow && missedCol + j === shipCol) {
            return true; // El fallo estuvo adyacente a un barco
          }
        }
      }
    }
  }
  return false; // No se encontró adyacencia a ningún barco
}

function getPlayerBoardMatrix() {
  const matrix = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(0));
  const cells = playerBoard.querySelectorAll(".cell");
  cells.forEach((cell) => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    if (cell.classList.contains("hit")) {
      matrix[row][col] = 1; // Hit ship
    } else if (cell.classList.contains("miss")) {
      matrix[row][col] = -1; // Missed shot
    } // 0 represents untouched cells
  });
  return matrix;
}

async function machineTurn() {
  if (currentTurn !== "machine") return; // Simulate AI thinking

  const thinkingDelay = Math.random() * 2000 + 1000; // 1 to 3 seconds
  showToast("AI is thinking...");
  console.log("AI is thinking...");
  await new Promise((resolve) => setTimeout(resolve, thinkingDelay));

  const playerMatrix = getPlayerBoardMatrix();
  console.log("Player Board Matrix:", playerMatrix); // Added this line
  const geminiResponse = await Gemini.init(playerMatrix, aiPreviousTargets); // Pasa aiPreviousTargets

  if (geminiResponse.status === 200 && geminiResponse.data?.position) {
    const [row, col] = geminiResponse.data.position;
    aiPreviousTargets.push([row, col]); // Añade la nueva posición a la lista de atacadas

    const message = geminiResponse.data?.message || "AI's turn!";
    showToast(`AI says: ${message}`);

    const cell = playerBoard.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (cell && !cell.classList.contains("hit") && !cell.classList.contains("miss")) {
      handleAttack(cell, playerBoard, playerShips, false); // If AI hits, handleAttack will call machineTurn again
    } else {
      // Fallback to random if Gemini suggests an invalid or already targeted cell
      console.warn("Gemini suggested an invalid target, falling back to random.");
      const available = [...playerBoard.querySelectorAll(".cell")].filter((c) => !c.classList.contains("hit") && !c.classList.contains("miss"));
      if (available.length > 0) {
        const randomCell = available[Math.floor(Math.random() * available.length)];
        handleAttack(randomCell, playerBoard, playerShips, false); // If AI hits, handleAttack will call machineTurn again
      } else {
        console.warn("No available cells for AI to attack.");
        currentTurn = "player";
        enableMachineBoard();
      }
    }
  } else {
    console.error("Gemini API error:", geminiResponse);
    showToast("AI encountered an error!"); // Fallback to random if Gemini API fails
    const available = [...playerBoard.querySelectorAll(".cell")].filter((c) => !c.classList.contains("hit") && !c.classList.contains("miss"));
    if (available.length > 0) {
      const cell = available[Math.floor(Math.random() * available.length)];
      handleAttack(cell, playerBoard, playerShips, false); // If AI hits, handleAttack will call machineTurn again
    } else {
      console.warn("No available cells for AI to attack (Gemini error).");
      currentTurn = "player";
      enableMachineBoard();
    }
  }
}

async function checkWin(ships, message) {
  const allSunk = ships.every((ship) => ship.isSunk());
  if (allSunk) {
    const finalScore = scoreCalculator.getTotalScore();
    winner();
    const user = JSON.parse(localStorage.getItem("user_nbai"));
    user.score += finalScore;
    const data = { nick_name: user.nickname, score: parseInt(user.score, 10), country_code: user.country.code };
    // Send info to backend
    await send_data(`${URL_API}/score-recorder`, data);
    currentTurn = null; // Game over
    disableMachineBoard();
    return true;
  }
  return false;
}

function exportPlayerMap() {
  const boardSize = BOARD_SIZE; // Utiliza la variable global BOARD_SIZE
  const playerBoardElement = document.querySelector("#player-board");
  const rows = playerBoardElement.querySelectorAll(".board > div");
  const mapMatrix = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize));

  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll(".cell");
    cells.forEach((cell, colIndex) => {
      if (cell.classList.contains("hit") && cell.classList.contains("ship")) {
        mapMatrix[rowIndex][colIndex] = "p1-h";
      } else if (cell.classList.contains("ship")) {
        mapMatrix[rowIndex][colIndex] = "p1";
      } else if (cell.classList.contains("miss")) {
        mapMatrix[rowIndex][colIndex] = "b";
      } else {
        mapMatrix[rowIndex][colIndex] = "a";
      }
    });
  });

  return mapMatrix;
}

function handleExportPlayerMap() {
  const exportedMap = exportPlayerMap();
  console.log("Mapa del Jugador Exportado (Matriz):");
  console.log(exportedMap);
  showToast("Mapa del Jugador Exportado a la consola como matriz"); // Opcional: mostrar un mensaje al usuario
}

function load_maps() {
  getBoardSize((size) => {
    BOARD_SIZE = size; // Load Maps
    scoreCalculator = new ScoreCalculator();

    currentTurn = null;
    orientation = "horizontal";

    playerBoard = document.querySelector("#player-board");
    machineBoard = document.querySelector("#machine-board");
    orientationBtn = document.querySelector("#orientation-button");
    shipInfoPanel = document.querySelector("#div-info-some");
    shipInfoPanel.classList.remove("visually-hidden");
    aiMessageToast = document.querySelector("#ai-message-toast");
    aiMessageToastBody = document.querySelector("#ai-message-toast-body");

    playerShips = [];
    machineShips = [];
    shipIndex = 0;
    updateShipInfoPanel();
    disableMachineBoard();
    aiPreviousTargets = [];

    document.addEventListener("keydown", (e) => {
      if (e.key.toUpperCase() === "R") {
        orientation = orientation === "horizontal" ? "vertical" : "horizontal";
        orientationBtn.textContent = `Ship to ${orientation.charAt(0).toUpperCase() + orientation.slice(1)}`;
      }
    });

    orientationBtn.addEventListener("click", () => {
      orientation = orientation === "horizontal" ? "vertical" : "horizontal";
      orientationBtn.textContent = `Ship to ${orientation.charAt(0).toUpperCase() + orientation.slice(1)}`;
    });

    const boardsContainer = document.querySelector(".boards"); // row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-2
    boardsContainer.classList.add("row-cols-1", "row-cols-sm-2", "row-cols-md-2", "row-cols-lg-2"); // }
    createBoard(playerBoard, true);
    createBoard(machineBoard, false);

    const exportButton = document.querySelector("#export-player-map");
    if (exportButton) {
      exportButton.addEventListener("click", handleExportPlayerMap);
    } // Event listeners for ship preview

    playerBoard.addEventListener("mouseover", showShipPreview);
    playerBoard.addEventListener("mouseout", clearShipPreview);
  });
}

function showShipPreview(event) {
  if (shipIndex >= SHIPS_CONFIG.length) return;
  const cell = event.target;
  if (!cell.classList.contains("cell") || cell.classList.contains("ship")) return;

  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  const currentShipSize = SHIPS_CONFIG[shipIndex].size;

  const canBePlaced = canPlaceShipPreview(playerBoard, row, col, currentShipSize, orientation);

  for (let i = 0; i < currentShipSize; i++) {
    const r = orientation === "horizontal" ? row : row + i;
    const c = orientation === "horizontal" ? col + i : col;

    if (r < BOARD_SIZE && c < BOARD_SIZE) {
      const previewCell = playerBoard.querySelector(`[data-row="${r}"][data-col="${c}"]`);
      if (previewCell) {
        previewCell.classList.remove("preview-invalid"); // Remove previous invalid class
        previewCell.classList.remove("preview"); // Remove previous valid class
        if (canBePlaced) {
          previewCell.classList.add("preview");
        } else {
          previewCell.classList.add("preview-invalid");
        }
      }
    }
  } // If the ship cannot be placed from the initial hover cell, also mark subsequent out-of-bounds cells as invalid
  if (!canBePlaced) {
    for (let i = 0; i < currentShipSize; i++) {
      const r = orientation === "horizontal" ? row : row + i;
      const c = orientation === "horizontal" ? col + i : col;
      if (r >= BOARD_SIZE || c >= BOARD_SIZE) {
        const previewCell = playerBoard.querySelector(`[data-row="${r}"][data-col="${c}"]`);
        if (previewCell) {
          previewCell.classList.add("preview-invalid");
        }
      }
    }
  }
}

function clearShipPreview() {
  const previewCells = playerBoard.querySelectorAll(".preview");
  previewCells.forEach((cell) => cell.classList.remove("preview"));
  const invalidPreviewCells = playerBoard.querySelectorAll(".preview-invalid");
  invalidPreviewCells.forEach((cell) => cell.classList.remove("preview-invalid"));
}
