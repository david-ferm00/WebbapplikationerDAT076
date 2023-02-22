import express from "express";
import { Request, Response } from "express";
import { Card } from "../model/card";
import { Colour } from "../model/Colour";
import { instantiateUnoService } from "../service/Game";
import { GameState } from "../model/GameState";

export const matchmakingRouter = express.Router();

//const unoService = instantiateUnoService("tbd", "1");

//list of games
matchmakingRouter.get("/matchmaking", async (req: Request, res: Response) => {    
    res.status(200).send("It works from matchmaking router!");
});

//create a game
matchmakingRouter.post("/matchmaking/creatgame/:code/:id", async(req : Request, res: Response) => {
    const unoService = instantiateUnoService(req.params.code, req.params.id);

    /*if(game code already exists){
        res.status(400).send("game code already exists");
    } else {
        const game = instantiateUnoService(req.params.code, req.params.id);
        //put this game into the DB
        res.status(200).send("yeah yeah yeah")
    }*/
});

//join a game
matchmakingRouter.put("/matchmaking/joinGame/:code/:id", async(req : Request, res: Response) => {
    /*const game = get game from db;
    if(game already has two players){
        res.status(400).send("game full already");
    } else {
        game.setPlayer2Name(req.params.id);
        res.status(200).send("you may request gamestate")
    }*/
});