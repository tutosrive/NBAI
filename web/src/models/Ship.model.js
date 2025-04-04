export default class Ship {
  constructor(size, name, resistence, positions) {
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
  }
}
