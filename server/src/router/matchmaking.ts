import express from "express";
import { Request, Response } from "express";
import { instantiateUnoService } from "../service/Game";
import { IUnoService } from "../service/Game";

export const matchmakingRouter = express.Router();

var unoService : IUnoService = instantiateUnoService("-1","hello");

//list of games
matchmakingRouter.get("/matchmaking", async (req: Request, res: Response) => {    
    res.status(200).send("It works from matchmaking router!");
});

interface GamelistItem{
    code : string,
    noOfPlayers : number
}

matchmakingRouter.get("/matchmaking/gamelist", async(req: Request, res: Response) => {
    /*if(unoService == undefined || unoService == null){
        res.status(400).send(null)
    } else {
        res.status(200).send(unoService);
    }*/
    const gamelist : GamelistItem = {code : unoService.getCode()===undefined ? "" : unoService.getCode(), noOfPlayers : unoService.getNoOfPlayers()}
    res.status(200).send(gamelist)
});

//create a game
matchmakingRouter.post("/matchmaking/creategame/:code/:id", async(req : Request, res: Response) => {
    unoService = instantiateUnoService(req.params.code, req.params.id);
    res.status(200)
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
    if(unoService.getCode() == req.params.code){
        unoService.setPlayerTwo(req.params.id);
    }
    /*const game = get game from db;
    if(game already has two players){
        res.status(400).send("game full already");
    } else {
        game.setPlayer2Name(req.params.id);
        res.status(200).send("you may request gamestate")
    }*/
});

export function getUnoServices() : IUnoService{
    return unoService;
}