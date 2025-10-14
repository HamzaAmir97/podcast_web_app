import { Request, Response, NextFunction } from "express";
import { Episodes } from "../services/episodes.service";

// INFO: Lists episodes with optional text search and simple pagination.
// INFO: Query params: ?limit=number (default 10), ?offset=number (default 0), ?q=string (optional).
export const listEpisodes = (req: Request, res: Response, next: NextFunction) => {
  try {
    // INFO: Extract query params and set safe defaults.
    const limit = Number(req.query.limit ?? 10);
    const offset = Number(req.query.offset ?? 0);
    const q = String(req.query.q ?? "");

    // INFO: Very light validation to keep the controller simple.
    if (!Number.isFinite(limit) || !Number.isFinite(offset) || limit < 0 || offset < 0) {
      return res.status(400).json({ message: "limit and offset must be non-negative numbers" });
    }

    // INFO: Delegate the actual filtering/pagination to the service layer.
    const payload = Episodes.list({ limit, offset, q });

    // INFO: Send the normalized response shape.
    return res.json(payload);
  } catch (err) {
    // INFO: Pass unexpected errors to the global error handler.
    next(err);
  }
};

// INFO: Returns the latest episodes ordered by published date (desc).
// INFO: Query param: ?limit=number (default 2).
export const latestEpisodes = (req: Request, res: Response, next: NextFunction) => {
  try {
    // INFO: Parse and validate the limit in one place.
    const limit = Number(req.query.limit ?? 2);
    if (!Number.isFinite(limit) || limit <= 0) {
      return res.status(400).json({ message: "limit must be a positive number" });
    }

    // INFO: Ask the service for the N most recent episodes.
    const payload = Episodes.latest(limit);

    // INFO: Send the minimal JSON structure.
    return res.json(payload);
  } catch (err) {
    // INFO: Centralized error handling keeps the controller small.
    next(err);
  }
};

// INFO: Fetch a single episode by its id (slug).
// INFO: Route param: /episodes/:id
export const getEpisode = (req: Request, res: Response, next: NextFunction) => {
  try {
    // INFO: Read the id from the path parameters.
    const { id } = req.params;

    // INFO: Look up the episode in the service.
    const episode = Episodes.byId(id);

    // INFO: If not found, return a standard 404.
    if (!episode) return res.status(404).json({ message: "Episode not found" });

    // INFO: Otherwise, return the episode as-is.
    return res.json(episode);
  } catch (err) {
    // INFO: Delegate unexpected issues to the global error handler.
    next(err);
  }
};
