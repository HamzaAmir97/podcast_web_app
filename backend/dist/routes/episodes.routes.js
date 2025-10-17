"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const episodes_controller_1 = require("../controllers/episodes.controller");
const router = (0, express_1.Router)();
router.get("/", episodes_controller_1.listEpisodes);
router.get("/latest", episodes_controller_1.latestEpisodes);
router.get("/:id", episodes_controller_1.getEpisode);
exports.default = router;
