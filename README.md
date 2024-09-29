# Battelship API Project

This repository contains the code to run a simple backend service for a 2 player game of Battleships, using the Typescript and the Express framework.

## Usage
### Deployment
Install dependencies with:
```
npm install
```

Create a .env file and set a PORT value, e.g. :
```
PORT=3000
```

To run locally you can use nodemon with:
```
npm run dev
```

## Entities

### Shot

Properties:
- xPosition
- yPosition
- status

### Ship

Properties:
- shipType
- orientation
- xStartingPosition
- yStartingPosition
- occupiedPositions
- size
- hits

Methods:
- isSunk
- takeHit
- createOccupiedPositions

### Board

Properties:
- size
- ships
- shots

Methods:
- placeShip
- placeShot
- allShipsPlaced
- allShipsSunk

### Game

Properties:
- players
- turns

Methods:
- incrementTurns
- getBoard
- getWinner
- getState

## Endpoints

### /game/start
- Creates new game instance in memory
- Returns unique gameId
- Parameters:
```
None
```

### /game/:gameId/player/:playerId/placeShip
- Places a ship on a particular players board for a given game
- Returns updated game state
- Parameters: 
```
{
    shipType: Destroyer | Submarine | Cruiser | Battleship | Carrier,
    shipOrientation: horizontal | vertical,
    xStartingPosition: number,
    yStartingPosition: number,
}
```

### /game/:gameId/player/:playerId/placeShot
- Places a shot on a particular players board for a given game
- returns shot status and updated game state
- Parameters:
```
{
    xPosition: number,
    yPosition: number,
}
```
