import { Router } from "express";
import { listEpisodes, latestEpisodes, getEpisode } from "../controllers/episodes.controller";

const router = Router();
router.get("/", listEpisodes);
router.get("/latest", latestEpisodes);
router.get("/:id", getEpisode);

export default router;
