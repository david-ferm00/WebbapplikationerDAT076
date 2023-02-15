import { instantiateUnoService } from "./src/service/Game";
import { GameState } from "./src/model/GameState";

test("When asking for gamestate before anything has happened the game state should be the start state of the game.", async () => {
    const unoService = instantiateUnoService();
    const gameState = await unoService.getState("1");
    expect(gameState.sizeDrawPile ==  100-11).toBeTruthy();
    expect(gameState.sizeGamePile == 1).toBeTruthy();
    expect(gameState.topCard != undefined).toBeTruthy();
    expect(gameState.yourPile.size() == 5).toBeTruthy();
    expect(gameState.sizeOppPile == 5).toBeTruthy();
})