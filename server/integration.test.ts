import * as SuperTest from "supertest";
import { instantiateUnoService } from "./src/service/GameManager";
import { Card } from "./src/model/card";
import {app} from "./src/start";

const request = SuperTest.default(app);

test("integration test 1", async () => {
    const unoService = instantiateUnoService();
    unoService.createGame("game_code", "player_one")
    const responseJoin = await request.post("/matchmaking/joinGame/game_code/player_two")

    const resGameStatePlayerOne = await request.get("/uno/game_state/game_code/player_two");
    expect(resGameStatePlayerOne.statusCode).toEqual(200);

    const resGameStatePlayerTwo = await request.get("/uno/game_state/game_code/player_one");
    expect(resGameStatePlayerTwo.statusCode).toEqual(200);
    
    //If player one starts
    if(resGameStatePlayerOne.body.yourTurn) {
        const card:Card = resGameStatePlayerOne.body.yourPile.pile[0];
        const res1 = (await request.put("/uno/select_card").send({player: "player_two" ,card: card}));
        expect(res1.statusCode).toEqual(200);
        expect(!resGameStatePlayerTwo.body.yourTurn)

        const res2 = await request.get("/uno/game_state/game_code/player_one");
        expect(res2.statusCode).toEqual(200);
        expect(res2.body.topCard).toEqual(card);
    }

    //If player two starts
    if(resGameStatePlayerTwo.body.yourTurn) {
        const card:Card = resGameStatePlayerTwo.body.yourPile.pile[0];
        const res1 = (await request.put("/uno/select_card").send({player: "player_one" ,card: card}));
        expect(res1.statusCode).toEqual(200);
        expect(!resGameStatePlayerOne.body.yourTurn)

        const res2 = await request.get("/uno/game_state/game_code/player_two");
        expect(res2.statusCode).toEqual(200);
        expect(res2.body.topCard).toEqual(card);
    }
});
