import Player from './Player.model.js';

class User extends Player {
    /**
     * Player´s total score in the game
     * @type {Number}
     */
    #score;
    /**
     * Player´s country code
     * @type {String}
     */
    #country;

    /**
     * User class constructor
     * @param {String} country
     */
    constructor(country) {
        super();
        this.#score = 0;
        this.#country = country;
    }  

    /**
     * Load player´s total score in the attribute score
     * @private
     * @returns {Number} Player´s total score
     */
    #load_score() {
        return this.#score;
    }
}