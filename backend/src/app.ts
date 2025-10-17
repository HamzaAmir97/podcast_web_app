import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import rateLimit from "express-rate-limit";

import episodesRouter from "./routes/episodes.routes";
import streamRouter from "./routes/stream.routes";

import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";

export const createApp = () => {
  const app = express();

 app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

  app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*" }));
  app.use(morgan("dev"));
  app.use(express.json());

  app.use("/static", express.static(path.join(__dirname, "..", "public")));


  
  app.use("/stream", rateLimit({ windowMs: 60_000, max: 60 }));

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  app.use("/episodes", episodesRouter);
  app.use("/stream", streamRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
