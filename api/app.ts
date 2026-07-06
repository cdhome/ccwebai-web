import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import telemetryRoutes from "./routes/telemetry.js";
import issueRoutes from "./routes/issues.js";
import adminRoutes from "./routes/admin.js";
import uploadRoutes from "./routes/uploads.js";
import releaseRoutes from "./routes/releases.js";
import { isDatabaseConfigured } from "./lib/config.js";
import { attachSession, requireAdmin } from "./lib/auth.js";

const app: express.Application = express();
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(currentDir, "../dist");

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(attachSession);

app.use("/api/auth", authRoutes);
app.use("/api/telemetry", telemetryRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/admin", requireAdmin, adminRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/releases", releaseRoutes);

app.get("/api/health", (_req: Request, res: Response): void => {
  res.status(200).json({
    ok: true,
    service: "ccwebai-web",
    databaseConfigured: isDatabaseConfigured(),
  });
});

app.use(express.static(distDir));

app.get(/^(?!\/api(?:\/|$)).*/, (_req: Request, res: Response): void => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  void _req;
  void _next;
  res.status(500).json({
    ok: false,
    error: error?.message || "Server internal error",
  });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    ok: false,
    error: "API not found",
  });
});

export default app;
