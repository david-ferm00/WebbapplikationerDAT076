import * as SuperTest from "supertest";
import { instantiateUnoService } from "./src/service/Game";
import { GameState } from "./src/model/GameState";
import { Card } from "./src/model/card";
import {app} from "./src/start";

const request = SuperTest.default(app);

test("integration test 1", async () => {
    const unoService = instantiateUnoService();
    const res = await request.get("/uno/game_state");
    expect(res.statusCode).toEqual(200);
    let card:Card = res.body.yourPile.pile[0];

    const res1 = (await request.put("/uno/select_card").send({player_name : "1" ,card : card}));
    expect(res1.statusCode).toEqual(200);

    const res2 = await request.get("/uno/game_state");
    expect(res2.statusCode).toEqual(200);
    expect(res2.body.topCard).toEqual(card);
});