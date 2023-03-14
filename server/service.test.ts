import { Card } from "./src/model/card";
import { instantiateUnoService, IUnoService } from "./src/service/GameManager";

var gameManager : IUnoService

beforeEach(() => {
    gameManager = instantiateUnoService();
  });

test("When asking for gamestate before anything has happened the game state should be the start state of the game.", async () => {
    gameManager.createGame("game_code","player_name");
    const gameState = await gameManager.getState("player_name", "game_code");
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
    const gameStatePlayerOne = await gameManager.getState("player_one", "1")
    const gameStatePlayerTwo = await gameManager.getState("player_two", "1")
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

test("If card is placed, it should end up on top of discard pile", async () => {
    gameManager.createGame("1", "player_one");
    gameManager.setPlayerTwo("player_two", "1");

    var statePlayer1 = await gameManager.getState("player_one", "1");
    var statePlayer2 = await gameManager.getState("player_two", "1");
    
    var currentTop = statePlayer1.topCard;
    
    if(statePlayer1.yourTurn){
        var card = statePlayer1.yourPile.seeTopCard();
        gameManager.place("1", card, "player_one");
        statePlayer1 = await gameManager.getState("player_one", "1");

        expect(statePlayer1.topCard.colour !== currentTop.colour 
        && statePlayer1.topCard.value !== currentTop.value).toBeTruthy
        expect(statePlayer1.topCard.colour === card.colour 
        && statePlayer1.topCard.value === card.value).toBeTruthy

        expect(statePlayer1.yourTurn).toBeFalsy
    }
    if(statePlayer2.yourTurn){
        var card = statePlayer2.yourPile.seeTopCard();
        gameManager.place("1", card, "player_two");
        statePlayer2 = await gameManager.getState("player_two", "1");

        expect(statePlayer2.topCard.colour !== currentTop.colour 
        && statePlayer2.topCard.value !== currentTop.value).toBeTruthy
        expect(statePlayer2.topCard.colour === card.colour 
        && statePlayer2.topCard.value === card.value).toBeTruthy
    }
})

test("If card is placed, it should become the other players turn", async () => {
    gameManager.createGame("1", "player_one");
    gameManager.setPlayerTwo("player_two", "1");
    var statePlayer1 = await gameManager.getState("player_one", "1");
    var statePlayer2 = await gameManager.getState("player_two", "1");
    
    if(statePlayer1.yourTurn){
        gameManager.place("1", statePlayer1.yourPile.seeTopCard(), "player_one");
        statePlayer1 = await gameManager.getState("player_one", "1");
        expect(statePlayer1.yourTurn).toBeFalsy
    }
    if(statePlayer2.yourTurn){
        gameManager.place("1", statePlayer2.yourPile.seeTopCard(), "player_two");
        statePlayer2 = await gameManager.getState("player_two", "1");
        expect(statePlayer2.yourTurn).toBeFalsy
    }
})

test("Before game is created the gameState should be incorrect", async () => {
    var statePlayer1 = await gameManager.getState("player_one", "1");
    expect(statePlayer1.sizeDrawPile===0).toBeTruthy
    expect(statePlayer1.sizeGamePile===0).toBeTruthy
    expect(statePlayer1.yourTurn).toBeFalsy
    expect(statePlayer1.yourPile.size()===0).toBeTruthy
})

//TODO
test("test of set player two", async () => {
    gameManager.createGame("1", "player_one");
    //expect(gameManager.setPlayerTwo("player_one", "1")).toThrow
    //expect(gameManager.setPlayerTwo("player_two", "2")).toThrow
    var statePlayer1 = await gameManager.getState("player_one", "1");
    
    gameManager.setPlayerTwo("player_two", "1");
    expect(statePlayer1.opponentName === "player_two").toBeTruthy
})

test("If uno pressed when more than one card in hand. add two cards to hand", async () => {
    gameManager.createGame("1", "player_one");
    gameManager.setPlayerTwo("player_two", "1");
    
    gameManager.sayUno("player_one", "1");
    var statePlayer1 = await gameManager.getState("player_one", "1");
    expect(statePlayer1.yourPile.size()===7).toBeTruthy
})

test("If card is placed, it should become the other players turn", async () => {
    gameManager.createGame("1", "player_one");
    gameManager.setPlayerTwo("player_two", "1");
    var statePlayer1 = await gameManager.getState("player_one", "1");
    var statePlayer2 = await gameManager.getState("player_two", "1");
    
    if(statePlayer1.yourTurn){
        var topCard = statePlayer1.topCard;
        var placeable = false;
        statePlayer1.yourPile.pile.forEach(card => {
            if(card.colour===topCard.colour || card.value===topCard.value || card.colour==4) placeable=true;
        });
        gameManager.pickUpCard("player_one", "1");
        var statePlayer1 = await gameManager.getState("player_one", "1");
        if(placeable){
            expect(statePlayer1.yourPile.size()===5).toBeTruthy
        } else {
            expect(statePlayer1.yourPile.size()===6).toBeTruthy
        }
    }
    if(statePlayer2.yourTurn){
        var topCard = statePlayer2.topCard;
        var placeable = false;
        statePlayer2.yourPile.pile.forEach(card => {
            if(card.colour===topCard.colour || card.value===topCard.value || card.colour==4) placeable=true;
        });
        gameManager.pickUpCard("player_two", "1");
        var statePlayer2 = await gameManager.getState("player_two", "1");
        if(placeable){
            expect(statePlayer2.yourPile.size()===5).toBeTruthy
        } else {
            expect(statePlayer2.yourPile.size()===6).toBeTruthy
        }
    }
})

