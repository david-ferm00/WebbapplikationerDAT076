import express from "express";
import { Request, Response } from "express";
import { instantiateUnoService } from "../service/GameManager";
import { IUnoService } from "../service/GameManager";
import { Card } from "../model/card";
import { GameState } from "../model/GameState"
import { GameListElement } from "../service/GameListElement";


export const router = express.Router();

var unoService : IUnoService = instantiateUnoService();

// Parameters used in most requests
interface GameRequest extends Request{
    params : {code:string, id:string}
}

//Get available game
router.get("/matchmaking/gamelist", async(req: Request<{},{},{}>, res: Response<GameListElement[] | string>) => {
    try {
       const gamelist : GameListElement[] = await unoService.getGameList();
        res.status(200).send(gamelist) 
    } catch (e : any) {
        console.error(e.stack)
        res.status(500).send(`Failed to retrieve game list ${e.message}`)
    }
});

//create a game
//TODO Maybe return the gamelistelement if success?
router.post("/matchmaking/creategame/:code/:id", async(req : GameRequest, res: Response<string>) => {
    try {
        const player:string = req.params.id;
        const code:string = req.params.code;

        if (typeof(player) !== "string") {
            res.status(400).send(`Bad PUT call to ${req.originalUrl} --- id has type ${typeof(player)}`);
        }
        if (typeof(code) !== "string") {
            res.status(400).send(`Bad PUT call to ${req.originalUrl} --- code has type ${typeof(code)}`);
        }
        if(await unoService.createGame(code, player)) {
            res.status(200).send("Game created")
        } 
        
    } catch (e : any) {
        console.error(e.stack)
        res.status(500).send(`Game not created ${e.message}`)
    }
});

//join a game
router.put("/matchmaking/joinGame/:code/:id", async(req : GameRequest, res: Response<String>) => {    
    try {
        const player:string = req.params.id;
        const code:string = req.params.code;

        if (typeof(player) !== "string") {
            res.status(400).send(`Bad PUT call to ${req.originalUrl} --- id has type ${typeof(player)}`);
        }
        if (typeof(code) !== "string") {
            res.status(400).send(`Bad PUT call to ${req.originalUrl} --- code has type ${typeof(code)}`);
        }
        if(await unoService.setPlayerTwo(player, code)) {
            res.status(200).send("Success")
        }
    } catch (e: any) {
        console.error(e.stack)
        res.status(500).send(`Failed to join game ${e.message}`)
    }
});

//give the client the state of the game
router.get("/uno/game_state/:code/:id", async (req: GameRequest, res: Response<GameState | string>) => {
    try {
        const player:string = req.params.id;
        const code:string = req.params.code;

        if (typeof(player) !== "string") {
            res.status(400).send(`Bad PUT call to ${req.originalUrl} --- id has type ${typeof(player)}`);
        }
        if (typeof(code) !== "string") {
            res.status(400).send(`Bad PUT call to ${req.originalUrl} --- code has type ${typeof(code)}`);
        }

        const gameState : GameState = unoService.getState(player, code);
        res.status(200).send(gameState);
    } catch (e: any) {
        console.error(e.stack)
        res.status(500).send(`Failed to get game state ${e.message}`);
    }
});

//give the player a card from the draw deck
router.put("/uno/pickUpCard/:code/:id", async (req: GameRequest, res: Response<string>) =>{
    try{
        const player:string = req.params.id;
        const code:string = req.params.code;

        if (typeof(player) !== "string") {
            res.status(400).send(`Bad PUT call to ${req.originalUrl} --- id has type ${typeof(player)}`);
        }
        if (typeof(code) !== "string") {
            res.status(400).send(`Bad PUT call to ${req.originalUrl} --- code has type ${typeof(code)}`);
        }

        unoService.pickUpCard(player, code)
        
            res.status(200).send("Success")
        
        
    } catch (e: any) {
        console.error(e.stack)
        res.status(400).send(`Failed ${e.message}`)
    }
});

//places a card from the players hand
router.put("/uno/select_card/:code/:id", async (req: GameRequest, res: Response<Card | string>) => {
    try {
        const player:string = req.params.id;
        const code:string = req.params.code;
        const card:Card = req.body.card;

        if (typeof(player) !== "string") {
            res.status(400).send(`Bad PUT call to ${req.originalUrl} --- id has type ${typeof(player)}`);
        }
        if (typeof(code) !== "string") {
            res.status(400).send(`Bad PUT call to ${req.originalUrl} --- code has type ${typeof(code)}`);
        }
        if (card.value===undefined || card.colour===undefined) {
            res.status(400).send(`Bad PUT call to ${req.originalUrl} --- card has type ${typeof(card)}`);
            return;
        }
        if(await unoService.place(code, new Card(card.colour, card.value), player)) {
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