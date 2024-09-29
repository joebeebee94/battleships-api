import assert from 'assert';
import { Shot } from '../src/classes/shot'
import { Ship } from '../src/classes/ship'
import { Board } from '../src/classes/board'
import { EShipType, EShipOrientation, EPlaceShotResult, EShotStatus } from '../types/classes';

describe('Board - placeShip', () => {
    let board: Board;

    beforeEach(() => {
        board = new Board()
    });

    it('Should add ship to ships array if placement is valid', () => {
        const ship = new Ship(EShipType.Destroyer, EShipOrientation.Vertical, 2, 1);
        const shipPlaced = board.placeShip(ship);
        assert.strictEqual(shipPlaced, true);
        assert.deepStrictEqual(board.ships, [ship]);
    });

    it('Should not add ship to ships array if placement overlaps with existing ship', () => {
        const ship1 = new Ship(EShipType.Destroyer, EShipOrientation.Vertical, 2, 1);
        const ship2 = new Ship(EShipType.Carrier, EShipOrientation.Horizontal, 1, 2);
        const ship1Placed = board.placeShip(ship1);
        const ship2Placed = board.placeShip(ship2);
        assert.strictEqual(ship1Placed, true);
        assert.strictEqual(ship2Placed, false);
        assert.deepStrictEqual(board.ships, [ship1]);
    });

    it('Should not add ship to ships array if placement is invalid', () => {
        const ship = new Ship(EShipType.Destroyer, EShipOrientation.Vertical, 2, board.size + 1);
        const shipPlaced = board.placeShip(ship);
        assert.strictEqual(shipPlaced, false);
        assert.deepStrictEqual(board.ships, []);
    });
})

describe('Board - placeShot', () => {
    let board: Board;

    beforeEach(() => {
        board = new Board()
    });

    it('Should add shot to shots array if placement is valid hit', () => {
        const [x, y] = [1, 1]
        const placedShip = board.placeShip(new Ship(EShipType.Battleship, EShipOrientation.Horizontal, x, y))
        const result = board.placeShot(x, y);
        assert.strictEqual(result, EPlaceShotResult.Hit);
        assert.deepStrictEqual(board.shots, [new Shot(x, y, EShotStatus.Hit)])
    });

    it('Should add shot to shots array if placement is valid miss', () => {
        const [x, y] = [1, 1]
        const result = board.placeShot(x, y);
        assert.strictEqual(result, EPlaceShotResult.Miss);
        assert.deepStrictEqual(board.shots, [new Shot(x, y, EShotStatus.Miss)])
    });

    it('Should not add shot to shots array if placement has already been made', () => {
        const [x, y] = [1, 1]
        const result1 = board.placeShot(x, y);
        const result2 = board.placeShot(x, y);
        assert.strictEqual(result1, EPlaceShotResult.Miss);
        assert.strictEqual(result2, false);
        assert.deepStrictEqual(board.shots, [new Shot(x, y, EShotStatus.Miss)])
    })

    it('Should not add shot to shots array if placement is invalid', () => {
        const [x, y] = [1, board.size + 1]
        const result = board.placeShot(x, y);
        assert.strictEqual(result, false);
        assert.deepStrictEqual(board.shots, [])
    });
})

describe('Board - allShipsPlaced', () => {
    it('Should return false until 5 ships have been placed on the board, then true', () => {
        const board = new Board();
        assert.strictEqual(board.allShipsPlaced(), false);
        const ships = [
            new Ship(EShipType.Destroyer, EShipOrientation.Horizontal, 0, 0),
            new Ship(EShipType.Submarine, EShipOrientation.Horizontal, 0, 1),
            new Ship(EShipType.Cruiser, EShipOrientation.Horizontal, 0, 2),
            new Ship(EShipType.Battleship, EShipOrientation.Horizontal, 0, 3),
            new Ship(EShipType.Carrier, EShipOrientation.Horizontal, 0, 4)
        ];
        for (let i = 0; i < 4; i++) {
            board.placeShip(ships[i]);
            assert.strictEqual(board.allShipsPlaced(), false);
        }
        board.placeShip(ships[4]);
        assert.strictEqual(board.allShipsPlaced(), true);
        assert.strictEqual(board.ships.length, 5);
    });
});

describe('Board - allShipsSunk', () => {
    let board: Board;

    beforeEach(() => {
        board = new Board();
    })

    it('Should return true when all ships have been placed and none remain floating', () => {
        const ships = [
            new Ship(EShipType.Destroyer, EShipOrientation.Horizontal, 0, 0),
            new Ship(EShipType.Submarine, EShipOrientation.Horizontal, 0, 1),
            new Ship(EShipType.Cruiser, EShipOrientation.Horizontal, 0, 2),
            new Ship(EShipType.Battleship, EShipOrientation.Horizontal, 0, 3),
            new Ship(EShipType.Carrier, EShipOrientation.Horizontal, 0, 4)
        ];
        ships.forEach(ship => board.placeShip(ship));
        assert.strictEqual(board.allShipsSunk(), false);
        ships.forEach(ship => {
            for (let i = 0; i < ship.size; i++) {
                ship.takeHit();
            }
        });
        assert.strictEqual(board.allShipsSunk(), true);
    });

    it('Should return false when no ships have been placed or any remain floating', () => {
        assert.strictEqual(board.allShipsSunk(), false);
        const ships = [
            new Ship(EShipType.Destroyer, EShipOrientation.Horizontal, 0, 0),
            new Ship(EShipType.Submarine, EShipOrientation.Horizontal, 0, 1),
        ];
        ships.forEach(ship => board.placeShip(ship));
        assert.strictEqual(board.allShipsSunk(), false);
    });

})
