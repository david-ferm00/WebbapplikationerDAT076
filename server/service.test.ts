import { instantiateUnoService } from "./src/service/Game";

test("When asking for gamestate before anything has happened the game state should be the start state of the game.", async () => {
    const unoService = instantiateUnoService("game_code","player_name");
    const gameState = unoService.getState("player_name");
    expect(gameState.sizeDrawPile ==  81).toBeTruthy(); // total number of cards minus the amount dealt to players and game pile
    expect(gameState.sizeGamePile == 1).toBeTruthy(); 
    expect(gameState.topCard != undefined).toBeTruthy();
    expect(gameState.yourPile.size() == 5).toBeTruthy();
    expect(gameState.sizeOppPile == 5).toBeTruthy();
})