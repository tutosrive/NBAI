import Ship from './Ship.model.js';

export default class Map {
    /**
     * Geographic ubication of player
     * Get information about weather
     * @type {String}
     */
    #geographic_location;
    /**
     * Board size chosen by player
     * @type {Number}
     */
    #board_size;
    /**
     * Ships positions on board
     * @type {Array<Array<Array>>}
     */
    #ships_positions;
    /**
     * Previously bombed and unavailable positions
     * @type {Array<Array<Number>>}
     */
    #dead_positions;

    /**
     * Map class constructor
     * @param {String} geographic_location Geographic location of player
     * @param {Number} board_size Board size chosen by player
     */
    constructor(geographic_location, board_size) {
        this.#geographic_location = geographic_location;
        this.#board_size = board_size;
        this.#ships_positions = [];
        this.#dead_positions = [];
    }

    /**
     * Export player's map 
     * @public
     * @returns {Object} JSON
     */
    export_map() {
        const playerMap = [];
        const IAMap = [];
        
        // Initialize empty maps
        for (let y = 0; y < this.#board_size; y++) {
            playerMap[y] = [];
            IAMap[y] = [];
            for (let x = 0; x < this.#board_size; x++) {
                playerMap[y][x] = 'a'; // Default to water
                IAMap[y][x] = 'a';
            }
        }
        
        // Mark player's ships
        for (const shipPositions of this.#ships_positions) {
            for (const pos of shipPositions) {
                // Check if this position was hit
                const wasHit = this.#dead_positions.some(
                    deadPos => deadPos.x === pos.x && deadPos.y === pos.y
                );
                
                playerMap[pos.y][pos.x] = wasHit ? 'p1-h' : 'p1';
            }
        }
        
        // Mark bombed positions (hits and misses)
        for (const deadPos of this.#dead_positions) {
            if (deadPos.hitShip) {
                // For opponent map, we only show hits on their own ships
                // This would need info from the game about opponent's hits
                // Currently showing only player's bomb attempts
                IAMap[deadPos.y][deadPos.x] = 'b';
            } else {
                playerMap[deadPos.y][deadPos.x] = 'b';
            }
        }
        
        return {
            player_map: playerMap,
            opponent_map: IAMap,
            player: 'p1',
            opponent: 'p2',
            size: this.#board_size
        };
    }

    /**
     * Position a ship on the map
     * Check that there is no overlap with other ships on the map
     * @private
     * @param {Ship} ship Ship to position
     * @param {Array<Number>} position Ship position
     * @returns {boolean} True if the ship is positioned successfully, false otherwise
     */
    #place_ship(ship, position) {
        for (let shipPos of this.#ships_positions) {
            for (let position of shipPos) {
                if (position.x === position.x && position.y === position.y) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Adds a list of a player's ships to the map
     * @public
     * @param {Array<Ship>} ships List of ships to add
     * @returns {Object} JSON
     */
    ships_place(ships) {
        let placedShips = [];
        let errors = [];

        for (let ship of ships) {
            let valid = true;
            for (let position of ship.positions) {
                if (position.x < 0 || position.x >= this.#board_size || position.y < 0 || position.y >= this.#board_size || !this.#place_ship(ship, position)) {
                    valid = false;
                    break;
                }
            }
            
            if (valid) {
                this.#ships_positions.push(ship.positions);
                placedShips.push(ship);
            } else {
                errors.push({ id: ship.id, error: 'Invalid placement' });
            }
        }

        return { success: errors.length === 0, placedShips, errors };
    }

    /**
     * Charge information about the weather
     * @private
     * @returns {Object} JSON
     */
    #load_climate() {
    }
}
