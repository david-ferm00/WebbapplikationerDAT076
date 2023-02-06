import express from "express";
import { Request, Response } from "express";
import { instantiateUnoService } from "../service/Game";
import { GameState } from "../service/GameState";

export const unoRouter = express.Router();

const unoService = instantiateUnoService();

unoRouter.get("/", async (req: Request, res: Response) => {    
    res.status(200).send("It works!");
});


unoRouter.get("/game_state", async (
    req: Request,
    res: Response<GameState>
) => {
    try {
        const GameState = await unoService.getState(1);
        res.status(200).send(GameState);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});


