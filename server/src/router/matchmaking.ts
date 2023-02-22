import express from "express";
import { Request, Response } from "express";
import { Card } from "../model/card";
import { Colour } from "../model/Colour";
import { instantiateUnoService } from "../service/Game";
import { GameState } from "../model/GameState";

export const matchmakingRouter = express.Router();

const unoService = instantiateUnoService();

matchmakingRouter.get("/matchmaking", async (req: Request, res: Response) => {    
    res.status(200).send("It works from matchmaking router!");
});