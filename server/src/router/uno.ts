import express from "express";
import { Request, Response } from "express";
import { Card } from "../model/card";
import { Colour } from "../model/Colour";
import { instantiateUnoService, IUnoService } from "../service/Game";
import { GameState } from "../model/GameState";

export const unoRouter = express.Router();

const unoService = instantiateUnoService("tbd", "1");

unoRouter.get("/uno", async (req: Request, res: Response) => {    
    res.status(200).send("It works!");
});

unoRouter.get("/uno/game_state/:id", async (req: Request, res: Response<GameState>) => {
    //const unoService : IUnoService = getUnoServices();
    try {
        const gameState : GameState = unoService.getState(req.params.id);
        res.status(200).send(gameState);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

unoRouter.put("/uno/pickUpCard/:code/:id", async (req: Request, res: Response) =>{
    //const unoService = getUnoServices();
    try{
        unoService.pickUpCard(req.params.id);
        res.status(200).send("Works")
    }catch{
        res.status(400).send("failed")
    }
});

unoRouter.put("/uno/select_card/:code/:id", async (
    req: Request<{card:Card}>,
    res: Response<Card | string>
) => {
    try {
        //const unoService = getUnoServices();
        const player = req.body.id;
        const card:Card = req.params.card;
        console.log("type of request body: " + typeof(req.body))
        console.log("type of player: " + typeof(player))
        /*if (typeof(player) !== "string") {
            res.status(400).send(`Bad PUT call to ${req.originalUrl} --- player_name has type ${typeof(player)}`);
        }
        if (typeof(req.body.card) !== typeof(Card)) {
            res.status(500).send(`Bad PUT call to ${req.originalUrl} --- card has type ${typeof(card)}`);
            return;
        }*/
        unoService.place(card, player);
        res.status(200).send("Card placed");

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

unoRouter.put("/uno/say_uno/:code/:id", async (
    req: Request,
    res: Response<string>
) => {
    try {
        const player = req.params.id;
        if (typeof(player) !== "string") {
            res.status(400).send(`Bad PUT call to ${req.originalUrl} --- player_name has type ${typeof(player)}`);
            return;
        }
        unoService.sayUno(player);

    } catch (e: any) {
        res.status(500).send(e.message)
    }
});


// We want the clients to get specific information based on who is asking

