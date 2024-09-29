import assert from 'assert';
import { EShipType, EShipOrientation } from '../types/classes';
import { Ship } from '../src/classes/ship';


describe('Ship - createOccupiedPositions', () => {
    it('Should calculate occupied positions for ship placed horizontally', () => {
        const ship = new Ship(EShipType.Battleship, EShipOrientation.Horizontal, 1, 1);
        const expectedPositions = [[1, 1], [2, 1], [3, 1], [4, 1]]
        assert.deepStrictEqual(ship.occupiedPositions, expectedPositions);
    });

    it('Should calculate occupied positions for ship placed vertically', () => {
        const ship = new Ship(EShipType.Battleship, EShipOrientation.Vertical, 1, 1);
        const expectedPositions = [[1, 1], [1, 2], [1, 3], [1, 4]]
        assert.deepStrictEqual(ship.occupiedPositions, expectedPositions);
    });
});

describe('Ship - isSunk', () => {
    it('Should return true if all positions have been hit', () => {
        const ship = new Ship(EShipType.Battleship, EShipOrientation.Horizontal, 1, 1);
        for (let i=0; i < ship.size; i++) {
            ship.takeHit();
        }
        assert.strictEqual(ship.isSunk(), true)
    });

    it('Should return false if the ship is still floating', () => {
        const ship = new Ship(EShipType.Battleship, EShipOrientation.Horizontal, 1, 1);
        assert.strictEqual(ship.isSunk(), false)
    })
});
