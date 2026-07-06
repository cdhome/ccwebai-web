import app from "./app.js";
import { config } from "./lib/config.js";

const server = app.listen(config.port, () => {
  console.log(`CCWebAI Web API ready on port ${config.port}`);
});

process.on("SIGTERM", () => {
  server.close(() => {
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  server.close(() => {
    process.exit(0);
  });
});

export default app;
