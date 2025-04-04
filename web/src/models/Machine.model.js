import Player from './Player.model.js'; 
//Since it is inheriting from player, it doesn`t need any more attributes.
export default class Machine extends Player {
  constructor() {
  }

  play() {
    console.log(' La máquina está jugando...');
  }
}
