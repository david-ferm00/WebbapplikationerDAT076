import { Card } from "./src/model/card";
import { instantiateUnoService, IUnoService } from "./src/service/GameManager";

var gameManager : IUnoService

beforeEach(() => {
    gameManager = instantiateUnoService();
  });

test("When asking for gamestate before anything has happened the game state should be the start state of the game.", async () => {
    gameManager.createGame("game_code","player_name");
    const gameState = gameManager.getState("player_name", "game_code");
    expect(gameState.sizeDrawPile ===  81) // total number of cards minus the amount dealt to players and game pile
    expect(gameState.sizeGamePile == 1)
    expect(gameState.topCard != undefined)
    expect(gameState.yourPile.size() == 5)
    expect(gameState.sizeOppPile == 5)
})

test("Create new games", async () => {
    gameManager.createGame("1", "player_name");
    gameManager.createGame("2", "player_name");
    gameManager.createGame("3", "player_name");
    gameManager.createGame("4", "player_name");
    expect(gameManager.getGameList.length === 4)
})

test("Multiple games with the same name", async () => {
    gameManager.createGame("1", "player_name");
    gameManager.createGame("2", "player_name");
    expect(() => gameManager.createGame("2", "player_name")).toThrowError
    expect(gameManager.getGameList.length === 2)
})

test("Trying to put a card that is not present in your hand (cheating)", async () => {
    gameManager.createGame("1", "player_one")
    gameManager.setPlayerTwo("player_two", "1")
    //Find a card not present in the hand of player one 
    const gameStatePlayerOne = gameManager.getState("player_one", "1")
    const gameStatePlayerTwo = gameManager.getState("player_two", "1")
    const cardFromTwo: Card = gameStatePlayerTwo.yourPile.pile[0]
    const cardFromOne: Card = gameStatePlayerOne.yourPile.pile[0]

    expect(gameStatePlayerOne.yourPile.pile.includes(cardFromTwo)).toBeFalsy
    expect(gameStatePlayerTwo.yourPile.pile.includes(cardFromOne)).toBeFalsy

    // It should be either player one's or player two's turn, not both at the same time
    expect(gameStatePlayerOne.yourTurn ? !gameStatePlayerTwo.yourTurn : gameStatePlayerTwo.yourTurn)

    if(gameStatePlayerOne.yourTurn) {    
        expect(gameManager.place("1",cardFromTwo,"player_one")).toBeFalsy
        expect(gameManager.place("1",cardFromOne,"player_one")).toBeTruthy
    }

    if(gameStatePlayerTwo.yourTurn) {    
        expect(gameManager.place("1",cardFromOne,"player_two")).toBeFalsy
        expect(gameManager.place("1",cardFromTwo,"player_two")).toBeTruthy
    }
}) 

test("", async () => {
    
})

test("", async () => {

})
