import express from "express";
import cors from "cors";
import { unoRouter } from "./router/uno";

export const app = express();

app.use(express.json());
app.use(cors());
app.use(unoRouter);