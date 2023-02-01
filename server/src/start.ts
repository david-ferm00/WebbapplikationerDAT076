import express from "express";
import { unoRouter } from "./router/uno";

export const app = express();

app.use(express.json());
app.use(unoRouter);