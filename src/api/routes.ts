import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.post('/start', (req: Request, res: Response) => {
    res.status(200).send({});
});

router.post('/:gameId/player/:playerId/placeShip', (req: Request, res: Response) => {

});

router.post('/:gameId/player/:playerId/placeShot', (req: Request, res: Response) => {

});

export default router;