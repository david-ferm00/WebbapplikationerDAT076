import express from "express";
import { Request, Response } from "express";
import { instantiateUnoService } from "../service/GameManager";
import { IUnoService } from "../service/GameManager";
import { Card } from "../model/card";
import { GameState } from "../model/GameState"
import { GameListElement } from "../service/GameListElement";


export const router = express.Router();

var unoService : IUnoService = instantiateUnoService();

//Get available game
router.get("/matchmaking/gamelist", async(req: Request, res: Response) => {
    try {
       const gamelist : GameListElement[] = unoService.getGameList();
        res.status(200).send(gamelist) 
    } catch (e : any) {
        console.error(e.stack)
        res.status(500).send(e.message)
    }
});

//create a game
//TODO Maybe return the gamelistelement if success?
router.post("/matchmaking/creategame/:code/:id", async(req : Request, res: Response) => {
    try {
        const result: Boolean = await unoService.createGame(req.params.code, req.params.id);
        res.status(200).send("Game created")
    } catch (e : any) {
        console.error(e.stack)
        res.status(500).send(e.message)
    }
});

//join a game
router.put("/matchmaking/joinGame/:code/:id", async(req : Request, res: Response) => {
    try {
        unoService.setPlayerTwo(req.params.id, req.params.code);
        res.status(200) //TODO
    } catch (e: any) {
        console.error(e.stack)
        res.status(500).send(e.message)
    }
});

//give the client the state of the game
router.get("/uno/game_state/:code/:id", async (req: Request, res: Response<GameState>) => {
    try {
        const gameState : GameState = unoService.getState(req.params.id, req.params.code);
        res.status(200).send(gameState);
    } catch (e: any) {
        console.error(e.stack)
        res.status(500).send(e.message);
    }
});

//give the player a card from the draw deck
router.put("/uno/pickUpCard/:code/:id", async (req: Request, res: Response) =>{
    try{
        unoService.pickUpCard(req.params.id, req.params.code);
        res.status(200).send("Works")
    }catch (e: any) {
        console.error(e.stack)
        res.status(400).send("failed")
    }
});

// request 
interface GameStateRequest extends Request{
    params : {}
    body : {}
}

// request 
interface SelectCardRequest extends Request{
    body : {card:Card, code:string, id:string}
}

//places a card from the players hand
router.put("/uno/select_card/", async (
    req: SelectCardRequest,
    res: Response<Card | string>
) => {
    try {
        const player:string = req.body.id;
        const card:Card = req.body.card;
        if (typeof(player) !== "string") {
            res.status(400).send(`Bad PUT call to ${req.originalUrl} --- player_name has type ${typeof(player)}`);
        }
        if (card.value===undefined && card.colour===undefined) {
            res.status(400).send(`Bad PUT call to ${req.originalUrl} --- card has type ${typeof(card)}`);
            return;
        }
        if(await unoService.place(req.body.code, new Card(card.colour, card.value), player)) {
            res.status(200).send(card);
        } else {
            res.status(400).send(`Bad PUT call to ${req.originalUrl} --- card: ${card} is not present in the hand of ${player}`);
            return;
        }
        
    } catch (e: any) {
        console.error(e.stack)
        res.status(500).send(e.message)
    }
});

//when the uno button is pressed
router.put("/uno/say_uno/:code/:id", async (
    req: Request,
    res: Response<string>
) => {
    try {
        const player = req.params.id;
        if (typeof(player) !== "string") {
            res.status(400).send(`Bad PUT call to ${req.originalUrl} --- player_name has type ${typeof(player)}`);
            return;
        }
        unoService.sayUno(player,req.params.code);

    } catch (e: any) {
        console.error(e.stack)
        res.status(500).send(e.message)
    }
});