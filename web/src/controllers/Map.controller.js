import Ship from '../models/Ship.model.js';

export async function init() {
  const container = document.querySelector('#main');
  const res = await fetch('./html/Map.html');
  const html = await res.text();
  container.innerHTML = html;
  load_maps();
}
console.log(new Ship(9));

let BOARD_SIZE = 10; // cambiar para que sea configurable
let SHIPS;

let currentTurn;
let orientation;
let playerBoard;
let machineBoard;
let orientationBtn;

let playerShips = [];
let machineShips = [];

function load_maps() {
  BOARD_SIZE = 10;
  SHIPS = [new Ship(5, 'Aircraft Carrier'), new Ship(4, 'Battleship'), new Ship(3, 'Cruiser'), new Ship(3, 'Cruiser'), new Ship(2, 'Submarine'), new Ship(2, 'Submarine')];
  currentTurn = 'player';
  orientation = 'horizontal';

  playerBoard = document.querySelector('#player-board');
  machineBoard = document.querySelector('#machine-board');
  orientationBtn = document.querySelector('#orientation-button');

  playerShips = [];
  machineShips = [];

  orientationBtn.addEventListener('click', () => {
    orientation = orientation === 'horizontal' ? 'vertical' : 'horizontal';
    orientationBtn.textContent = `Cambiar Orientación (${orientation.charAt(0).toUpperCase() + orientation.slice(1)})`;
  });
  const toggleBtn = document.querySelector('#toggle-debug');
  let debugMode = false;

  toggleBtn.addEventListener('click', () => {
    debugMode = !debugMode;
    const shipCells = machineBoard.querySelectorAll('.ship');
    shipCells.forEach((cell) => {
      cell.style.backgroundColor = debugMode ? '#b446b4' : '#87cefa';
    });
  });

  createBoard(playerBoard, true);
  createBoard(machineBoard, false);
}

function createBoard(container, isPlayer) {
  container.innerHTML = '';
  for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    if (!isPlayer) {
      cell.addEventListener('click', () => {
        if (currentTurn !== 'player' || cell.classList.contains('hit') || cell.classList.contains('miss')) return;
        handleAttack(cell, machineBoard, machineShips, true);
      });
    } else {
      cell.addEventListener('click', () => placePlayerShip(cell));
    }
    container.appendChild(cell);
  }
}

function indexToCoord(index) {
  return { row: Math.floor(index / BOARD_SIZE), col: index % BOARD_SIZE };
}

function coordToIndex(row, col) {
  return row * BOARD_SIZE + col;
}

function canPlaceShip(board, row, col, size, orientation) {
  if (orientation === 'horizontal' && col + size > BOARD_SIZE) return false;
  if (orientation === 'vertical' && row + size > BOARD_SIZE) return false;

  for (let i = 0; i < size; i++) {
    const r = orientation === 'horizontal' ? row : row + i;
    const c = orientation === 'horizontal' ? col + i : col;
    const cell = board.children[coordToIndex(r, c)];
    if (cell.classList.contains('ship')) return false;
  }

  return true;
}

function placeShip(board, row, col, size, shipList, isPlayer = false) {
  const positions = [];
  for (let i = 0; i < size; i++) {
    const r = orientation === 'horizontal' ? row : row + i;
    const c = orientation === 'horizontal' ? col + i : col;
    const index = coordToIndex(r, c);
    const cell = board.children[index];

    // Agregar clase 'ship' tanto a jugador como máquina
    cell.classList.add('ship');

    positions.push(index);
  }
  shipList.push({ positions, hits: [] });
}

let shipIndex = 0;
function placePlayerShip(cell) {
  if (shipIndex >= SHIPS.length) return;
  const { row, col } = indexToCoord(parseInt(cell.dataset.index));
  const size = SHIPS[shipIndex].size;

  if (canPlaceShip(playerBoard, row, col, size, orientation)) {
    placeShip(playerBoard, row, col, size, playerShips, true);
    shipIndex++;
    if (shipIndex === SHIPS.length) {
      createMachineShips();
      enableMachineBoard();
    }
  }
}

function createMachineShips() {
  SHIPS.forEach((ship) => {
    let placed = false;
    while (!placed) {
      const orient = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const row = Math.floor(Math.random() * BOARD_SIZE);
      const col = Math.floor(Math.random() * BOARD_SIZE);
      if (canPlaceShip(machineBoard, row, col, ship.size, orient)) {
        const original = orientation;
        orientation = orient;
        placeShip(machineBoard, row, col, ship.size, machineShips);
        orientation = original;
        placed = true;
      }
    }
  });
}

function enableMachineBoard() {
  const cells = machineBoard.querySelectorAll('.cell');
  cells.forEach((cell) => cell.classList.add('enabled'));
}

function registerHit(row, col, ships) {
  for (let ship of ships) {
    if (ship.positions.includes(coordToIndex(row, col))) {
      ship.hits.push(coordToIndex(row, col));
      return true;
    }
  }
  return false;
}

function handleAttack(cell, board, ships, isPlayerTurn) {
  const index = parseInt(cell.dataset.index);
  const { row, col } = indexToCoord(index);
  const wasHit = registerHit(row, col, ships);

  if (wasHit) {
    cell.classList.add('hit');
    cell.textContent = '❌';
    if (!cell.classList.contains('ship')) {
      cell.classList.add('ship');
    }
    if (checkWin(ships, isPlayerTurn ? '¡Ganaste!' : '¡Perdiste!')) return;
    if (!isPlayerTurn) {
      setTimeout(machineTurn, 600);
    }
  } else {
    cell.classList.add('miss');
    cell.textContent = '💣';
    currentTurn = isPlayerTurn ? 'machine' : 'player';
    if (currentTurn === 'machine') {
      setTimeout(machineTurn, 600);
    }
  }
}

function machineTurn() {
  const available = [...playerBoard.querySelectorAll('.cell')].filter((c) => !c.classList.contains('hit') && !c.classList.contains('miss'));

  if (available.length === 0) return;

  const cell = available[Math.floor(Math.random() * available.length)];
  handleAttack(cell, playerBoard, playerShips, false);
}

function checkWin(ships, message) {
  const allSunk = ships.every((ship) => ship.hits.length === ship.positions.length);
  if (allSunk) {
    alert(message);
    return true;
  }
  return false;
}
