import { EShotStatus, EPlaceShotResult } from '../../types/classes';
import { Ship } from './ship'
import { Shot } from './shot'

export class Board {
    size: number;
    ships: Ship[];
    shots: Shot[];

    constructor(size: number = 10) {
        this.size = size;
        this.ships = [];
        this.shots = [];
    }

    placeShip(ship: Ship): boolean {
        for (const [x, y] of ship.occupiedPositions) {
            if (x >= this.size || y >= this.size || x < 0 || y < 0) {
                return false; // ship out of bounds
            }
        }
        for (const s of this.ships) {
            for (const [x, y] of s.occupiedPositions) {
                if (ship.occupiedPositions.some(pos => pos[0] === x && pos[1] === y)) {
                    return false; // ships overlap
                }
            }
        }
        this.ships.push(ship);
        return true;
    }

    placeShot(x: number, y: number) {
        if (x >= this.size || y >= this.size || x < 0 || y < 0) {
            return false;  // shot out of bounds
        }
        const position = [x, y];
        if (this.shots.some(s => s.position[0] === position[0] && s.position[1] === position[1])) {
            return false;  // shot already taken
        }
        const hitShip = this.ships.find(ship => 
            ship.occupiedPositions.some(pos => pos[0] === position[0] && pos[1] === position[1])
        );
        if (hitShip) {
            hitShip.takeHit();
            this.shots.push(new Shot(x, y, EShotStatus.Hit));
            return hitShip.isSunk() ? EPlaceShotResult.Sunk : EPlaceShotResult.Hit;
        }
        this.shots.push(new Shot(x, y, EShotStatus.Miss))
        return EPlaceShotResult.Miss;
    }

    allShipsPlaced() {
        return this.ships.length === 5;
    }

    allShipsSunk() {
        if (!this.allShipsPlaced()) {
            return false;
        }
        return this.ships.every(ship => ship.isSunk());
    }

}