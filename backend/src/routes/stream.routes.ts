import { Router } from "express";
import rateLimit from "express-rate-limit";
import { streamEpisode } from "../controllers/stream.controller";

const router = Router();

// INFO: Optional per-route rate limiting for audio streaming.
// NOTE: If you already applied a limiter on "/stream" in app.ts, you can skip this one.
const streamLimiter = rateLimit({
  windowMs: 60_000, // 1 minute
  max: 60,          // NOTE: Allow up to 60 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
});

// INFO: Streams an episode's audio by id with HTTP Range support.
// NOTE: Example → GET /stream/como-codar-tranquilo
// IDEA: Keep file names aligned with "id" in episodes.json (id.mp3) for zero-config mapping.
router.get("/:id", streamLimiter, streamEpisode);

export default router;
