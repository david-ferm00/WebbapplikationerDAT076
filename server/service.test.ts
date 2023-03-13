import { instantiateUnoService } from "./src/service/GameManager";

test("When asking for gamestate before anything has happened the game state should be the start state of the game.", async () => {
    const GameManager = instantiateUnoService();
    GameManager.createGame("game_code","player_name");
    const gameState = GameManager.getState("player_name", "game_code");
    expect(gameState.sizeDrawPile ===  81) // total number of cards minus the amount dealt to players and game pile
    expect(gameState.sizeGamePile == 1)
    expect(gameState.topCard != undefined)
    expect(gameState.yourPile.size() == 5)
    expect(gameState.sizeOppPile == 5)
})

test("Create new games", async () => {
    const GameManager = instantiateUnoService();
    GameManager.createGame("1", "player_name");
    GameManager.createGame("2", "player_name");
    GameManager.createGame("3", "player_name");
    GameManager.createGame("4", "player_name");
    expect(GameManager.getGameList.length === 4)
})

test("Multiple games with the same name", async () => {
    const GameManager = instantiateUnoService();
    GameManager.createGame("1", "player_name");
    GameManager.createGame("2", "player_name");
    expect(() => GameManager.createGame("2", "player_name")).toThrowError
    expect(GameManager.getGameList.length === 2)
})

test("", async () => {
    
})

test("", async () => {

})
