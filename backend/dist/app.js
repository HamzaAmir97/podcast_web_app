"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const episodes_routes_1 = __importDefault(require("./routes/episodes.routes"));
const stream_routes_1 = __importDefault(require("./routes/stream.routes"));
const notFound_1 = require("./middlewares/notFound");
const errorHandler_1 = require("./middlewares/errorHandler");
const createApp = () => {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        crossOriginEmbedderPolicy: false,
    }));
    app.use((0, cors_1.default)({ origin: process.env.CORS_ORIGIN?.split(",") || "*" }));
    app.use((0, morgan_1.default)("dev"));
    app.use(express_1.default.json());
    app.use("/static", express_1.default.static(path_1.default.join(__dirname, "..", "public")));
    app.use("/stream", (0, express_rate_limit_1.default)({ windowMs: 60000, max: 60 }));
    app.get("/health", (_req, res) => res.json({ status: "ok" }));
    app.use("/episodes", episodes_routes_1.default);
    app.use("/stream", stream_routes_1.default);
    app.use(notFound_1.notFound);
    app.use(errorHandler_1.errorHandler);
    return app;
};
exports.createApp = createApp;
