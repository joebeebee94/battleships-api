# Battelship API Project

This repository contains the code for a backend service that runs a two-player Battleship game, built with TypeScript and the Express framework.

## Usage
### Overview
This API provides three endpoints for players to:
- create a game instance
- place a ship
- call a shot

When a game starts, each player is assigned a 10x10 board. Ships can be placed anywhere on the board, but they must not overlap. Each player must place 5 ships before the game can proceed, and shots can only be taken once all ships are placed. Players take alternating turns to place shots.

The game continues until one player sinks all of the opponent's ships, at which point they are declared the winner.

After each move (placing a ship or taking a shot), the API returns the updated game state, including the status of the game and the winner, if applicable.

### Deployment
Install the required dependencies:
```
npm install
```

(Optional) Create a .env file and set the PORT and NODE_ENV values:
```
PORT=3000
NODE_ENV=development
```

To run the application locally with Nodemon, use the following command:
```
npm run dev
```
### Testing
Unit and integration tests are written using the Mocha framework. To run the test suite, use the following command:
```
npm run test
```

## Entities

### Shot

#### Properties:
- xPosition
- yPosition
- position
- status

### Ship

#### Properties:
- shipType
- shipOrientation
- xStartingPosition
- yStartingPosition
- occupiedPositions
- size
- hits

#### Methods:
- getSizeFromType
- createOccupiedPositions
- isSunk
- takeHit

### Board

#### Properties:
- size
- ships
- shots

#### Methods:
- placeShip
- placeShot
- allShipsPlaced
- allShipsSunk

### Game

#### Properties:
- players
- turns

#### Methods:
- incrementTurns
- getBoard
- getWinner
- getState

## Endpoints

### /game/start
#### Summary:
- Creates new game instance in memory
- Returns unique gameId
- Parameters: None

#### Example request:
```
curl -X POST http://localhost:3000/game/start \
-H 'Content-Type: application/json' \
```

### /game/:gameId/player/:playerId/placeShip
#### Summary:
- Places a ship on a particular players board for a given game
- Returns result and updated game state

#### Parameters: 
```
{
    shipType: 'Destroyer' | 'Submarine' | 'Cruiser' | 'Battleship' | 'Carrier',
    shipOrientation: 'horizontal' | 'vertical',
    xStartingPosition: number,
    yStartingPosition: number,
}
```
#### Example request:
```
curl -X POST http://localhost:3000/game/{gameId}/player/{playerId}/placeShip \
-H 'Content-Type: application/json' \
-d '{
    "shipType": "Battleship",
    "shipOrientation": "horizontal",
    "xStartingPosition": 1,
    "yStartingPosition": 1
}'
```

### /game/:gameId/player/:playerId/placeShot
- Places a shot on a particular players board for a given game
- returns result and updated game state

#### Parameters:
```
{
    xPosition: number,
    yPosition: number,
}
```
#### Example request:
```
curl -X POST http://localhost:3000/game/{gameId}/player/{playerId}/placeShot \
-H 'Content-Type: application/json' \
-d '{
    "xPosition": 1,
    "yPosition": 1
}'
```

## Next Steps

### Potential Features:
- Add validation so only 1 of each ship type can be placed per player.
- Allow custom game settings such as board size, number of ships, or number of players.

### Improvements:
- Deploy to a cloud platform provider (e.g. AWS Lambda Function)
- Implement persistent storage to store games, players, and game history using a database (e.g. MongoDB).
- Refactor the `Player` into its own entity, with properties such as `name` and customisable `playerId`.
- Improve error handling with detailed HTTP error codes and messages.
