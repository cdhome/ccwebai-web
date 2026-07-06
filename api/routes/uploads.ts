import { Router, type Request, type Response } from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "../../uploads/logs");

router.post("/logs", async (req: Request, res: Response): Promise<void> => {
  const fileName = String(req.body?.fileName || "").trim();
  const content = String(req.body?.content || "").trim();

  if (!fileName || !content) {
    res.status(400).json({ ok: false, error: "fileName 和 content 不能为空" });
    return;
  }

  await fs.mkdir(uploadDir, { recursive: true });
  const nextPath = path.join(uploadDir, `${Date.now()}-${fileName.replace(/[^\w.-]+/g, "_")}`);
  await fs.writeFile(nextPath, content, "utf8");
  const stat = await fs.stat(nextPath);

  res.json({
    ok: true,
    fileId: path.basename(nextPath),
    fileName,
    size: stat.size,
  });
});

export default router;
