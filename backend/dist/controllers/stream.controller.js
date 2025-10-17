"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamEpisode = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const podcasts_json_1 = __importDefault(require("../../public/data/podcasts.json"));
// INFO: Streams an episode's audio file with HTTP Range support (enables seeking).
// NOTE: Route → GET /stream/:id  → serves /public/audio/:id.mp3 if present.
// IDEA: Keep MP3 file name = episode "id" for zero-config mapping.
const streamEpisode = (req, res) => {
    // INFO: Extract the episode id from URL params.
    const { id } = req.params;
    // INFO: Sanity-check the id against our dataset to avoid arbitrary file access.
    const episodes = podcasts_json_1.default;
    const exists = episodes.some((e) => e.id === id);
    if (!exists)
        return res.status(404).json({ message: "Episode not found" });
    // INFO: Resolve the absolute path of the audio file.
    const audioPath = path_1.default.join(__dirname, "..", "..", "public", "audio", `${id}.mp3`);
    // INFO: If the file doesn't exist on disk, return 404.
    if (!fs_1.default.existsSync(audioPath))
        return res.status(404).json({ message: "Audio not found" });
    // INFO: Pre-read basic file stats to compute sizes/ranges.
    const stat = fs_1.default.statSync(audioPath);
    const fileSize = stat.size;
    // INFO: Read the Range header; if present we serve partial content (206).
    const range = req.headers.range;
    // INFO: No Range → serve the full file with 200 OK (simplest path).
    if (!range) {
        res.writeHead(200, {
            "Content-Type": "audio/mpeg",
            "Content-Length": fileSize,
            "Accept-Ranges": "bytes",
            "Cache-Control": "public, max-age=3600"
        });
        return fs_1.default.createReadStream(audioPath).pipe(res);
    }
    // INFO: Parse Range header like "bytes=START-" or "bytes=START-END".
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    // INFO: Validate "start"; if outside file, respond 416 as per RFC.
    if (Number.isNaN(start) || start >= fileSize) {
        // BUG: Some clients may send malformed ranges; reply with the valid size.
        res.writeHead(416, { "Content-Range": `bytes */${fileSize}` });
        return res.end();
    }
    // INFO: Compute the end; if not provided, stream a small chunk (1 MB) as a fallback.
    const FALLBACK_CHUNK = 1 * 1024 * 1024; // 1 MB
    const endFromHeader = parts[1] ? parseInt(parts[1], 10) : undefined;
    const end = Math.min(endFromHeader && !Number.isNaN(endFromHeader) ? endFromHeader : start + FALLBACK_CHUNK, fileSize - 1);
    // INFO: Length of the partial response (required header).
    const contentLength = end - start + 1;
    // INFO: Send 206 Partial Content headers so the client can seek smoothly.
    res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600"
    });
    // INFO: Create a read stream for the requested byte range and pipe it.
    const stream = fs_1.default.createReadStream(audioPath, { start, end });
    stream.pipe(res);
    // INFO: Handle low-level I/O errors gracefully.
    stream.on("error", (err) => {
        console.error("Audio stream error:", err);
        if (!res.headersSent)
            res.status(500).json({ message: "Error streaming audio" });
        else
            res.end();
    });
    // TODO: Add metrics/logging if you need analytics (bytes served, duration, user agent).
    // HACK: If you see throttling issues in prod, add a per-route rate limiter in stream.routes.ts.
};
exports.streamEpisode = streamEpisode;
