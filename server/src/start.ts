import express from "express";
import cors from "cors";
import { unoRouter } from "./router/uno";
import { matchmakingRouter } from "./router/matchmaking";

export const app = express();

app.use(express.json());
app.use(cors());
app.use(matchmakingRouter);
app.use(unoRouter);