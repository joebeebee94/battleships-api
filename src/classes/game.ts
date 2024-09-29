import { Board } from './board';
import { EPlayerId } from '../../types/classes';

export class Game {
    players: { [playerId in EPlayerId]: Board };
    turns: number;

    constructor() {
        this.players = {
            'player1': new Board(),
            'player2': new Board(),
        }
        this.turns = 0;
    }

    incrementTurns() {

    }

    getBoard() {

    }

    getWinner() {

    }

    getState() {

    }
}