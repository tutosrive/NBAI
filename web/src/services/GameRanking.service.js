import { fetch_JSON } from '../controllers/helpers/helpers.mjs';

/**
* Get the ranking of the game
* @returns {Array} Ranking of the game
*/

export async function get_ranking() {
   return fetch_JSON('http://127.0.0.1/ranking');
}