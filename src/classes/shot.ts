import { EShotStatus } from "../../types/classes";

export class Shot {
    xPosition: number;
    yPosition: number;
    position: number[];
    status: EShotStatus;

    constructor(xPosition: number, yPosition: number, status: EShotStatus) {
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.position = [xPosition, yPosition];
        this.status = status;
    }
}