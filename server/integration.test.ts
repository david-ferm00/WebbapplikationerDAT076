import * as SuperTest from "supertest";
import { instantiateUnoService } from "./src/service/Game";
import { GameState } from "./src/model/GameState";
import { Card } from "./src/model/card";
import {app} from "./src/start";

const request = SuperTest.default(app);

test("integration test 1", async () => {
    const unoService = instantiateUnoService();1
    const card = new Card(0,5);

    const res1 = (await request.put("/uno/select_card").send({player: "1" ,card: card }));
    expect(res1.statusCode).toEqual(200);

    const res2 = await request.get("/uno/game_state");
    expect(res2.statusCode).toEqual(500);
    expect(res2.body.topCard).toEqual(card);
});