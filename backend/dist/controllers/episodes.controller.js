"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEpisode = exports.latestEpisodes = exports.listEpisodes = void 0;
const episodes_service_1 = require("../services/episodes.service");
// INFO: Lists episodes with optional text search and simple pagination.
// NOTE: Query params → ?limit (default 10), ?offset (default 0), ?q (optional).
const listEpisodes = (req, res, next) => {
    try {
        // INFO: Extract query params with safe defaults.
        const limit = Number(req.query.limit ?? 10);
        const offset = Number(req.query.offset ?? 0);
        const q = String(req.query.q ?? "");
        // INFO: Very light validation to keep things simple.
        if (!Number.isFinite(limit) || !Number.isFinite(offset) || limit < 0 || offset < 0) {
            // FIXME: Consider adding a validation library (e.g., zod) if requirements grow.
            return res.status(400).json({ message: "limit and offset must be non-negative numbers" });
        }
        // INFO: Delegate filtering & pagination to the service layer.
        const payload = episodes_service_1.Episodes.list({ limit, offset, q });
        // INFO: Return normalized response.
        return res.json(payload);
    }
    catch (err) {
        // NOTE: Pass unexpected errors to the global error handler.
        next(err);
    }
};
exports.listEpisodes = listEpisodes;
// INFO: Returns the latest episodes ordered by published date (desc).
// NOTE: Query param → ?limit (default 2).
const latestEpisodes = (req, res, next) => {
    try {
        // INFO: Parse and validate the limit.
        const limit = Number(req.query.limit ?? 2);
        if (!Number.isFinite(limit) || limit <= 0) {
            return res.status(400).json({ message: "limit must be a positive number" });
        }
        // INFO: Ask the service for the N most recent episodes.
        const payload = episodes_service_1.Episodes.latest(limit);
        // INFO: Respond with a minimal JSON shape.
        return res.json(payload);
    }
    catch (err) {
        // NOTE: Centralized error handling keeps controllers small.
        next(err);
    }
};
exports.latestEpisodes = latestEpisodes;
// INFO: Fetch a single episode by its id (slug).
// NOTE: Route param → /episodes/:id
const getEpisode = (req, res, next) => {
    try {
        // INFO: Read the id from the path parameters.
        const { id } = req.params;
        // INFO: Look up the episode in the service.
        const episode = episodes_service_1.Episodes.byId(id);
        // INFO: If not found, return a standard 404.
        if (!episode)
            return res.status(404).json({ message: "Episode not found" });
        // INFO: Otherwise, return the episode as-is.
        return res.json(episode);
    }
    catch (err) {
        // NOTE: Delegate unexpected issues to the global error handler.
        next(err);
    }
};
exports.getEpisode = getEpisode;
