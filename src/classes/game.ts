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
        this.turns ++;
    }

    getBoard(playerId: EPlayerId) {
        return this.players[playerId];
    }

    getWinner() {
        if (this.players[EPlayerId.Player1].allShipsSunk()) {
            return EPlayerId.Player2;
        }
        if (this.players[EPlayerId.Player2].allShipsSunk()) {
            return EPlayerId.Player1;
        }
        return null;
    }

    getState() {
        return {
            'playerNextTurn': this.turns % 2 === 0 ? EPlayerId.Player1 : EPlayerId.Player2,
            'winner': this.getWinner(),
            'player1Board': this.players[EPlayerId.Player1],
            'player2Board': this.players[EPlayerId.Player2],
            'player1LiveShipCount': this.players[EPlayerId.Player1].ships.filter(ship => !ship.isSunk()).length,
            'player2LiveShipCount': this.players[EPlayerId.Player2].ships.filter(ship => !ship.isSunk()).length,
        }
    }
}