import { Router } from "express";
import { streamEpisode } from "../controllers/stream.controller";

const r = Router();
r.get("/:id", streamEpisode);

export default r;
