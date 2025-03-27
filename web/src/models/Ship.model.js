export default class Ship {
    constructor(id,size,name,resistence,positions) {
          /**
        * Unique identificator
        * @type {String} Max length: 20 chars
        */
        this.id = id;

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
        * resistence of the ship 
        * @type {Number} int, It goes from 1 to 5 depending on the type of ship
        */ 
        this.resistence = resistence;

        /**
        * Positions of the ship
        * @type {Array<Array<number>>} Array of positions, each position is an object with x and y
        * @example [{x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3}, {x: 1, y: 4}, {x: 1, y: 5}]
        */
        this.positions = positions;
        
    }   
}