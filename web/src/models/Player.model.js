export default class Player {
  /**
   * Unique identificator
   * @type {String} Max length: 20 chars
   */
  #id;
  /**
   * **Player** alias into game
   * @type {String}
   */
  #nickname;
  /**
   * **Player** Score actual level
   * @type {Number}
   */
  #score_level;
  /**
   * Ships list
   * @type {Array<Ship>}
   */
  #ships;
  // Restrict contructor: Disallow the "new Player()" instruction
  constructor() {
    if (this.constructor === Player) throw new Error('This is a ABSTRACT class, not allow constructor');
  }
  /**
   * This method, spread the Event "PlayerPlay()" and the required data send via "Event"
   */
  play() {
    throw new Error("This is an ABSTRACT method, you've implements this...");
  }
}
