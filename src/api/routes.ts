import express, { Request, Response, NextFunction } from 'express';
import { Game } from '../classes/game';
import { Board } from '../classes/board';
import { Ship } from '../classes/ship';
import { EShipType, EShipOrientation, EPlayerId } from "../../types/classes";

// extend Request type to include game properties
declare global {
    namespace Express {
        interface Request {
            game?: Game;
            playerId?: string;
            playerBoard?: Board;
            opponentBoard?: Board;
        }
    }
}

// game instances stored in object
const games: { [key: number]: Game } = {};

const router = express.Router();

// middleware function to save game properties to the request
function loadGame(req: Request, res: Response, next: NextFunction) {
    const { playerId, gameId } = req.params;
    const game = games[parseInt(gameId)]
    if (!game) {
        res.status(404).send({ message: `Game not found with gameId: ${gameId}` });
        return;
    }
    const opponentId = playerId === EPlayerId.Player1 ? EPlayerId.Player2 : EPlayerId.Player1;
    const playerBoard = game.getBoard(playerId as EPlayerId);
    const opponentBoard = game.getBoard(opponentId);
    if (!playerBoard || !opponentBoard) {
        res.status(400).send({ message: `Board not found from playerId: ${playerId}` });
        return;
    }
    req.game = game;
    req.playerId = playerId;
    req.playerBoard = playerBoard;
    req.opponentBoard = opponentBoard;
    next()
}

// POST - creates a new game instance
router.post('/start', (req: Request, res: Response) => {

    const gameId = Object.keys(games).length + 1;
    games[gameId] = new Game();
    res.json({ gameId });

});

// POST - places a ship onto a player's board for a particular game
router.post('/:gameId/player/:playerId/placeShip', loadGame, (req: Request, res: Response) => {

    if (!req.game || !req.playerId || !req.playerBoard || !req.opponentBoard) {
        const message = 'Error with loadGame middleware function, not all params loaded into game'
        res.status(400).send({ shipPlaced: false, message });
        return;
    }

    if (req.playerBoard.allShipsPlaced()) {
        const message = `All ships already placed for ${req.playerId}`
        res.status(400).send({ shipPlaced: false, message });
        return;
    }

    const { shipType, shipOrientation, xStartingPosition, yStartingPosition } = req.body;

    if (!Object.values(EShipType).includes(shipType)) {
        res.status(400).send({ shipPlaced: false, message: `Invalid ship type ${shipType}!` });
        return;
    }
    if (!Object.values(EShipOrientation).includes(shipOrientation)) {
        res.status(400).send({ shipPlaced: false, message: `Invalid ship orientation ${shipOrientation}!` });
        return;
    }

    const ship = new Ship(shipType, shipOrientation, xStartingPosition, yStartingPosition);

    if (req.playerBoard.placeShip(ship)) {
        const gameState = req.game.getState()
        res.status(200).send({ shipPlaced: true, gameState });
    } else {
        const message = 'Invalid ship placement!'
        res.status(400).send({ shipPlaced: false, message });
    }

});

// POST - places a shot onto a player's board for a particular game
router.post('/:gameId/player/:playerId/callShot', loadGame, (req: Request, res: Response) => {

    if (!req.game || !req.playerId || !req.playerBoard || !req.opponentBoard) {
        const message = 'Error with loadGame middleware function, not all params loaded into game'
        res.status(400).send({ shotPlaced: false, message });
        return;
    }

    if (!req.playerBoard.allShipsPlaced() || !req.opponentBoard.allShipsPlaced()) {
        const message = `All ships must be placed before taking a shot`
        res.status(400).send({ shotPlaced: false, message });
        return;
    }

    const nextTurn = req.game.turns % 2 === 0 ? EPlayerId.Player1 : EPlayerId.Player2;

    if (nextTurn !== req.playerId) {
        const message = `Please wait your turn. ${nextTurn} to take the next shot`
        res.status(400).send({ shotPlaced: false, message });
        return;
    }

    const { xPosition, yPosition } = req.body;
    const result = req.opponentBoard.placeShot(xPosition, yPosition);

    if (!result) {
        const message = `Invalid shot position: [${xPosition}, ${yPosition}]`;
        res.status(400).send({ shotPlaced: false, message })
        return;
    }

    req.game.incrementTurns();
    const gameState = req.game.getState()
    res.status(200).send({ shotPlaced: true, result, gameState });

});

export default router;