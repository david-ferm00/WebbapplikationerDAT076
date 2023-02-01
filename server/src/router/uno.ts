import express from "express";
import { Request, Response } from "express";

export const unoRouter = express.Router();

unoRouter.get("/", async (req: Request, res: Response) => {    
    res.status(200).send("It works!");
    });


