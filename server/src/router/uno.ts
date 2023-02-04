import express from "express";
import { Request, Response } from "express";
import { Card } from "../model/card";

class GameState {
    yourPile: Array<Card>;
    yourTurn: Boolean;
    sizeGamePile: number;
    sizeDrawPile: number;
    sizeOppPile: number;
    topCard: number;

    constructor(yourPile : Array<Card>, yourTurn : Boolean, sizeGamePile : number, sizeDrawPile : number, sizeOppPile : number, topCard : number) {
        this.yourPile = yourPile;
        this.yourTurn = 
    }
}

export const unoRouter = express.Router();

unoRouter.get("/", async (req: Request, res: Response) => {    
    res.status(200).send("It works!");
});


unoRouter.get("/game_state", async (
    req: Request,
    res: Response<Array<Card>, Boolean, number >
) => {
    try {
        const tasks = await unoService.getState();
        res.status(200).send(state);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});


