import { instantiateUnoService } from "./src/service/Game";
import { GameState } from "./src/model/GameState";

test("When asking for gamestate before anything has happened the game state should be the start state of the game.", async () => {
    const unoService = instantiateUnoService();
    const gameState = await unoService.getState(1);
    expect(gameState.sizeDrawPile ==  108-10
            && gameState.sizeGamePile == 0
            && gameState.topCard != undefined
            && gameState.yourPile.size() == 5
            && gameState.sizeOppPile == 5).toBeTruthy();
})