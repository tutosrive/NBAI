export default class Ship {
  constructor(id, size, name) {
    /**
     * Unique ID for the ship
     * @type {String}
     */
    this.id = id; // Añadimos ID ya que estaba en tu ejemplo
    /**
     * Size of the ship
     * @type {Number} int, and the size is between 1 and 5
     */
    this.size = size;

    /**
     * Name of the ship
     * @type {String} One of the 4 types of ship, aircraft carrier, battleship, cruiser or submarine
     */
    this.name = name;

    /**
     * Array of coordinates occupied by the ship
     * @type {Array<Object>} e.g., [{row: 1, col: 3}, {row: 1, col: 4}]
     */
    this.positions = []; // Necesitamos almacenar las posiciones

    /**
     * Current health/resistance of the ship. Starts equal to size.
     * @type {Number}
     */
    this.resistence = size; // Añadimos la resistencia basada en el tamaño

    /**
     * Flag indicating if the ship is sunk
     * @type {Boolean}
     */
    this._isSunk = false;
  }

  /**
   * Sets the positions occupied by the ship.
   * @param {Array<Object>} positionsArray - Array of {row, col} objects.
   */
  setPositions(positionsArray) {
    this.positions = positionsArray;
    this.resistence = this.size; // Resistencia inicial = tamaño
    this._isSunk = false; // Asegurar que no esté hundido al colocar
  }

  /**
   * Registers a hit on the ship, decreasing its resistance.
   */
  hit() {
    if (this.resistence > 0) {
      this.resistence--;
      if (this.resistence <= 0) {
        // Usar <= 0 por seguridad
        this._isSunk = true;
        console.log(`${this.name} (ID: ${this.id}) ha sido hundido!`);
      }
    }
  }

  /**
   * Checks if the ship is sunk (resistance is 0 or less).
   * @returns {Boolean} True if sunk, false otherwise.
   */
  isSunk() {
    this._isSunk = this.resistence <= 0;
    return this._isSunk;
  }
}
