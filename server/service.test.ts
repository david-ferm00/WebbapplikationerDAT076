import { instantiateUnoService } from "./src/service/GameManager";

test("When asking for gamestate before anything has happened the game state should be the start state of the game.", async () => {
    const GameManager = instantiateUnoService();
    GameManager.createGame("game_code","player_name");
    const gameState = GameManager.getState("player_name", "game_code");
    expect(gameState.sizeDrawPile ==  81).toBeTruthy(); // total number of cards minus the amount dealt to players and game pile
    expect(gameState.sizeGamePile == 1).toBeTruthy(); 
    expect(gameState.topCard != undefined).toBeTruthy();
    expect(gameState.yourPile.size() == 5).toBeTruthy();
    expect(gameState.sizeOppPile == 5).toBeTruthy();
})

test("")