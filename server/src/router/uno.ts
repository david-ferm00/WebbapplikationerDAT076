import express from "express";
import { Request, Response } from "express";
import { Card } from "../model/card";
import { Colour } from "../model/Colour";
import { instantiateUnoService } from "../service/Game";
import { GameState } from "../service/GameState";

export const unoRouter = express.Router();

const unoService = instantiateUnoService();

unoRouter.get("/", async (req: Request, res: Response) => {    
    res.status(200).send("It works!");
});


unoRouter.get("/uno/game_state", async (
    req: Request,
    res: Response<GameState>
) => {
    try {
        //const GameState = await unoService.getState();
        //res.status(200).send(GameState);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

unoRouter.put("/uno/select_card", async (
    req: Request<{player_name : string , card : Card}>,
    res: Response<Card | string>
) => {
    try {
        const player = req.body.player_name;
        const card = req.body.card;
        if (typeof(player) !== "string") {
            res.status(400).send(`Bad PUT call to ${req.originalUrl} --- player_name has type ${typeof(player)}`);
            return;
        }
        if (typeof(card) !== typeof(Card)) {
            res.status(400).send(`Bad PUT call to ${req.originalUrl} --- card has type ${typeof(card)}`);
            return;
        }
        unoService.place(card, player);
        res.status(200)

    } catch (e: any) {
        res.status(500).send(e.message)
    }
});

unoRouter.put("/uno/select_color", async (
    req: Request<{player_name : string , colour : Colour}>,
    res: Response<Colour | string>
) => {
    try {
        const player = req.body.player_name;
        const colour = req.body.colour;
        if (typeof(player) !== "string") {
            res.status(400).send(`Bad PUT call to ${req.originalUrl} --- player_name has type ${typeof(player)}`);
            return;
        }
        if (typeof(colour) !== typeof(Colour)) {
            res.status(400).send(`Bad PUT call to ${req.originalUrl} --- colour has type ${typeof(colour)}`);
            return;
        }
        //unoService.selectColor(player, colour);

    } catch (e: any) {
        res.status(500).send(e.message)
    }
});

unoRouter.put("/uno/say_uno", async (
    req: Request<{player_name : string}>,
    res: Response<string>
) => {
    try {
        const player = req.body.player_name;
        if (typeof(player) !== "string") {
            res.status(400).send(`Bad PUT call to ${req.originalUrl} --- player_name has type ${typeof(player)}`);
            return;
        }
        //unoService.sayUno(player);

    } catch (e: any) {
        res.status(500).send(e.message)
    }
});

// We want the clients to get specific information based on who is asking

