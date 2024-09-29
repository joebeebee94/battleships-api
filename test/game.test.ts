import assert from 'assert';
import { Ship } from '../src/classes/ship'
import { Game } from '../src/classes/game'
import { EPlayerId, EShipType, EShipOrientation } from '../types/classes';

describe('Game - getWinner', () => {
    let game: Game;
    let ships1: Ship[];
    let ships2: Ship[];

    beforeEach(() => {
        game = new Game();
        ships1 = [
            new Ship(EShipType.Destroyer, EShipOrientation.Horizontal, 0, 0),
            new Ship(EShipType.Submarine, EShipOrientation.Horizontal, 0, 1),
            new Ship(EShipType.Cruiser, EShipOrientation.Horizontal, 0, 2),
            new Ship(EShipType.Battleship, EShipOrientation.Horizontal, 0, 3),
            new Ship(EShipType.Carrier, EShipOrientation.Horizontal, 0, 4)
        ];
        ships1.forEach(ship => game.players[EPlayerId.Player1].placeShip(ship));

        ships2 = [
            new Ship(EShipType.Destroyer, EShipOrientation.Horizontal, 0, 0),
            new Ship(EShipType.Submarine, EShipOrientation.Horizontal, 0, 1),
            new Ship(EShipType.Cruiser, EShipOrientation.Horizontal, 0, 2),
            new Ship(EShipType.Battleship, EShipOrientation.Horizontal, 0, 3),
            new Ship(EShipType.Carrier, EShipOrientation.Horizontal, 0, 4)
        ];
        ships2.forEach(ship => game.players[EPlayerId.Player2].placeShip(ship));
    });

    it(`Should return ${EPlayerId.Player1} if all of ${EPlayerId.Player2} ships1 have been sunk`, () => {
        ships2.forEach(ship => {
            for (let i = 0; i < ship.size; i++) {
                ship.takeHit();
            }
        });
        assert.strictEqual(game.getWinner(), EPlayerId.Player1);
    });

    it(`Should return ${EPlayerId.Player2} if all of ${EPlayerId.Player1} ships1 have been sunk`, () => {
        ships1.forEach(ship => {
            for (let i = 0; i < ship.size; i++) {
                ship.takeHit();
            }
        });
        assert.strictEqual(game.getWinner(), EPlayerId.Player2);
    });

    it(`Should return null if neither player have had all ships1 sunk`, () => {
        assert.strictEqual(game.getWinner(), null);
    })
})
