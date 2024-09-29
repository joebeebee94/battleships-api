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

    placeShip() {

    }

    placeShot() {

    }

    allShipsPlaced() {
        
    }

    allShipsSunk() {
        
    }

}