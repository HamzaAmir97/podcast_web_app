"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const stream_controller_1 = require("../controllers/stream.controller");
const router = (0, express_1.Router)();
// INFO: Optional per-route rate limiting for audio streaming.
// NOTE: If you already applied a limiter on "/stream" in app.ts, you can skip this one.
const streamLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60000, // 1 minute
    max: 60, // NOTE: Allow up to 60 requests per minute per IP
    standardHeaders: true,
    legacyHeaders: false,
});
// INFO: Streams an episode's audio by id with HTTP Range support.
// NOTE: Example → GET /stream/como-codar-tranquilo
// IDEA: Keep file names aligned with "id" in episodes.json (id.mp3) for zero-config mapping.
router.get("/:id", streamLimiter, stream_controller_1.streamEpisode);
exports.default = router;
