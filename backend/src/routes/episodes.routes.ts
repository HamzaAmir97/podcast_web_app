import { Router } from "express";
import { listEpisodes, latestEpisodes, getEpisode } from "../controllers/episodes.controller";

const r = Router();
r.get("/", listEpisodes);
r.get("/latest", latestEpisodes);
r.get("/:id", getEpisode);

export default r;
