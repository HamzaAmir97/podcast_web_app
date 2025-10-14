import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import data from "../data/episodes.json";

// INFO: Streams an episode's audio file with HTTP Range support (enables seeking).
// NOTE: Route param → /stream/:id  (serves /public/audio/:id.mp3 if it exists).
// IDEA: Keep files small during development to avoid large payloads and faster testing.
export const streamEpisode = (req: Request, res: Response) => {
  // INFO: Read the episode id from the URL parameter.
  const { id } = req.params;

  // INFO: Only allow ids that exist in our dataset (simple sanity check).
  // HACK: This doubles as a tiny guard against arbitrary file access by unknown ids.
  const episodes = data as Array<{ id: string }>;
  const exists = episodes.some(e => e.id === id);
  if (!exists) return res.status(404).json({ message: "Episode not found" });

  // INFO: Build the absolute path to the audio file for this id.
  const audioPath = path.join(__dirname, "..", "..", "public", "audio", `${id}.mp3`);

  // INFO: Ensure the file exists on disk.
  if (!fs.existsSync(audioPath)) return res.status(404).json({ message: "Audio not found" });

  // INFO: Get file size once for range calculations.
  const stat = fs.statSync(audioPath);
  const fileSize = stat.size;

  // INFO: Read the Range header (if present) to decide between 200 and 206.
  const range = req.headers.range;

  // INFO: No Range → send the whole file (simple path).
  if (!range) {
    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Content-Length": fileSize,
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=3600"
    });
    return fs.createReadStream(audioPath).pipe(res);
  }

  // INFO: Parse a header like "bytes=START-" or "bytes=START-END".
  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);

  // INFO: Validate "start"; if it's outside the file → reply 416.
  if (Number.isNaN(start) || start >= fileSize) {
    // BUG: Some clients may send malformed ranges; handle gracefully with 416.
    res.writeHead(416, { "Content-Range": `bytes */${fileSize}` });
    return res.end();
  }

  // INFO: Use provided end if present; otherwise, send a small chunk.
  const FALLBACK_CHUNK = 1 * 1024 * 1024; // 1 MB
  const endFromHeader = parts[1] ? parseInt(parts[1], 10) : undefined;
  const end = Math.min(
    endFromHeader && !Number.isNaN(endFromHeader) ? endFromHeader : start + FALLBACK_CHUNK,
    fileSize - 1
  );

  // INFO: Compute exact byte length for this partial response.
  const contentLength = end - start + 1;

  // INFO: Send required 206 headers for partial content.
  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "audio/mpeg",
    "Cache-Control": "public, max-age=3600"
  });

  // INFO: Stream the desired range to the client.
  const stream = fs.createReadStream(audioPath, { start, end });
  stream.pipe(res);

  // INFO: Handle low-level I/O errors gracefully (rare).
  stream.on("error", (err) => {
    console.error("Audio stream error:", err);
    if (!res.headersSent) res.status(500).json({ message: "Error streaming audio" });
    else res.end();
  });

  
  // TODO: Add metrics/logging if needed (e.g., bytes served, duration).
  // IDEA: Add rate-limiting on /stream in app.ts to protect bandwidth (already recommended).

};
