import assert from 'assert';
import request from 'supertest';
import app from '../src/api/app'
import { EShipOrientation, EPlayerId, EShipType } from '../types/classes';


describe('Integration - Mock Gameplay', () => {
    let gameId: number;
    let response: any;
    let params: {[key: string]: any};

    before(async () => {
        response = await request(app).post('/game/start').expect(200);
        gameId = response.body.gameId;
    })

    it('Should handle invalid ship and shot placements before all ships are live', async () => {
        // player1 attempt placeShip to invalid gameId
        params = {
            shipType: EShipType.Battleship,
            shipOrientation: EShipOrientation.Horizontal,
            xStartingPosition: 1,
            yStartingPosition: 1
        }
        response = await request(app).post(`/game/200/player/${EPlayerId.Player1}/placeShip`)
            .send(params)
            .expect(404);

        // player1 attempt shot before all ships in play
        params = { xPosition: 1, yPosition: 1 }
        response = await request(app).post(`/game/${gameId}/player/${EPlayerId.Player1}/placeShot`)
            .send(params)
            .expect(400);
        assert.strictEqual(response.body.shotPlaced, false);

        // player1 placeShip with invalid shipType
        params = {
            shipType: 'Dinghy',
            shipOrientation: EShipOrientation.Horizontal,
            xStartingPosition: 1,
            yStartingPosition: 1
        };
        response = await request(app).post(`/game/${gameId}/player/${EPlayerId.Player1}/placeShip`)
            .send(params)
            .expect(400);
        assert.strictEqual(response.body.shipPlaced, false);

        // player1 placeShip with invalid shipOrientation
        params = {
            shipType: EShipType.Battleship,
            shipOrientation: 'straight',
            xStartingPosition: 1,
            yStartingPosition: 1
        };
        response = await request(app).post(`/game/${gameId}/player/${EPlayerId.Player1}/placeShip`)
            .send(params)
            .expect(400);
        assert.strictEqual(response.body.shipPlaced, false);

        // player1 placeShip with invalid starting position
        params = {
            shipType: EShipType.Battleship,
            shipOrientation: EShipOrientation.Horizontal,
            xStartingPosition: 1,
            yStartingPosition: -1
        };
        response = await request(app).post(`/game/${gameId}/player/${EPlayerId.Player1}/placeShip`)
            .send(params)
            .expect(400);
        assert.strictEqual(response.body.shipPlaced, false);
    });

    it('Should handle all valid ship placements for both players', async () => {
        const ships = [
            { shipType: EShipType.Battleship, shipOrientation: EShipOrientation.Horizontal, xStartingPosition: 1, yStartingPosition: 1 },
            { shipType: EShipType.Carrier, shipOrientation: EShipOrientation.Horizontal, xStartingPosition: 1, yStartingPosition: 2 },
            { shipType: EShipType.Cruiser, shipOrientation: EShipOrientation.Horizontal, xStartingPosition: 1, yStartingPosition: 3 },
            { shipType: EShipType.Destroyer, shipOrientation: EShipOrientation.Horizontal, xStartingPosition: 1, yStartingPosition: 4 },
            { shipType: EShipType.Submarine, shipOrientation: EShipOrientation.Horizontal, xStartingPosition: 1, yStartingPosition: 5 },
        ];
        for (const player of Object.values(EPlayerId)) {
            for (const ship of ships) {
                const response = await request(app).post(`/game/${gameId}/player/${player}/placeShip`)
                    .send(ship)
                    .expect(200);
                assert.strictEqual(response.body.shipPlaced, true);
            }
        }
    });

    it('Should handle invalid ship and shot placements after all ships are live', async () => {
        // player1 invalid attempt to place 6th ship
        params = {
            shipType: EShipType.Submarine,
            shipOrientation: EShipOrientation.Horizontal,
            xStartingPosition: 1,
            yStartingPosition: 6
        }
        response = await request(app).post(`/game/${gameId}/player/${EPlayerId.Player1}/placeShip`)
            .send(params)
            .expect(400);
        assert.strictEqual(response.body.shipPlaced, false);

        // player2 attempt shot out of turn
        params = { xPosition: 1, yPosition: 1 }
        response = await request(app).post(`/game/${gameId}/player/${EPlayerId.Player2}/placeShot`)
            .send(params)
            .expect(400);
        assert.strictEqual(response.body.shotPlaced, false);

        // player1 attempt shot out of bounds
        params = { xPosition: -1, yPosition: 1 }
        response = await request(app).post(`/game/${gameId}/player/${EPlayerId.Player1}/placeShot`)
            .send(params)
            .expect(400);
        assert.strictEqual(response.body.shotPlaced, false);

    });

    it('Should place alternating shots until there is a winner', async () => {
        let i = 0, j = 0;
        let winner = null;
        while (i < 10 && j < 10 && !winner) {
            // Player 1 takes a shot
            params = { xPosition: i, yPosition: j };
            response = await request(app)
                .post(`/game/${gameId}/player/${EPlayerId.Player1}/placeShot`)
                .send(params);
            if (response.body.gameState?.winner === EPlayerId.Player1) {
                winner = EPlayerId.Player1;
                break;
            }
            // Player 2 takes a shot to opposite coordinates
            params = { xPosition: 9 - i, yPosition: 9 - j };
            response = await request(app)
                .post(`/game/${gameId}/player/${EPlayerId.Player2}/placeShot`)
                .send(params);
            if (response.body.gameState?.winner === EPlayerId.Player2) {
                winner = EPlayerId.Player2;
                break;
            }
            // Increment coordinates for the next shots
            j++;
            if (j === 10) { i++; j = 0 }
        }
        assert.strictEqual(winner, EPlayerId.Player1)
    });

    it('Should handle invalid shot attempt to position that already contains one', async () => {
        params = { xPosition: 0, yPosition: 0 }
        response = await request(app).post(`/game/${gameId}/player/${EPlayerId.Player1}/placeShot`)
            .send(params)
            .expect(400);
        assert.strictEqual(response.body.shotPlaced, false); 
    })
})