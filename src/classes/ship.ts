import { EShipType, EShipOrientation } from "../../types/classes";

export class Ship {
    shipType: EShipType;
    shipOrientation: EShipOrientation;
    xStartingPosition: number;
    yStartingPosition: number;
    occupiedPositions: number[][];
    size: number;
    hits: number;

    constructor(
        shipType: EShipType,
        shipOrientation: EShipOrientation = EShipOrientation.Horizontal, 
        xStartingPosition: number,
        yStartingPosition: number
    ) {
        this.shipType = shipType;
        this.shipOrientation = shipOrientation;
        this.xStartingPosition = xStartingPosition;
        this.yStartingPosition = yStartingPosition;
        this.occupiedPositions = this.createOccupiedPositions(xStartingPosition, yStartingPosition, shipOrientation, shipType);
        this.size = this.getSizeFromType(shipType);
        this.hits = 0;
    }

    private getSizeFromType(type: EShipType) {
        const shipSizes: { [key in EShipType]: number } = {
            [EShipType.Destroyer]: 2,
            [EShipType.Submarine]: 3,
            [EShipType.Cruiser]: 3,
            [EShipType.Battleship]: 4,
            [EShipType.Carrier]: 5,
        };
        return shipSizes[type];
    }

    private createOccupiedPositions(x: number, y: number, orientation: EShipOrientation, type: EShipType) {
        const size = this.getSizeFromType(type);
        return Array.from({ length: size }, (_, i) => 
            orientation === EShipOrientation.Horizontal ? [x + i, y] : [x, y + i]
        );
    }

    isSunk(): boolean {
        return this.hits >= this.size; 
    }

    takeHit() {
        this.hits ++;
    }
}