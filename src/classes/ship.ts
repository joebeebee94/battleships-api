import { EShipType, EShipOrientation } from "../../types/classes";

export class Ship {
    shipType: EShipType;
    orientation: EShipOrientation;
    xStartingPosition: number;
    yStartingPosition: number;
    occupiedPositions: number[][];
    size: number;
    hits: number;

    constructor(
        shipType: EShipType,
        orientation: EShipOrientation = EShipOrientation.Horizontal, 
        xStartingPosition: number,
        yStartingPosition: number
    ) {
        this.shipType = shipType;
        this.orientation = orientation;
        this.xStartingPosition = xStartingPosition;
        this.yStartingPosition = yStartingPosition;
        this.occupiedPositions = this.createOccupiedPositions();
        this.size = shipType === EShipType.Destroyer ? 2 :
                    shipType === EShipType.Submarine ? 3 :
                    shipType === EShipType.Cruiser ? 3 :
                    shipType === EShipType.Battleship ? 4 :
                    shipType === EShipType.Carrier ? 5 :
                    (() => { throw new Error(`Ship type ${shipType} not recognised!`) })();
        this.hits = 0;
    }

    private createOccupiedPositions() {
        return [];
    }

    isSunk() {

    }

    takeHit() {

    }
}