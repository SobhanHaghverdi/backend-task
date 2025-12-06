import os from "os";
import cluster from "cluster";
import buildApp from "./app.js";
import env from "./config/env-config.js";

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`🧠 Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Restart worker if it dies
  cluster.on("exit", (worker, code, signal) => {
    console.log(`⚰️ Worker ${worker.process.pid} died — restarting...`);
    cluster.fork();
  });

  // Graceful shutdown master and all workers
  const shutdownMaster = () => {
    console.log("🛑 Master shutting down, killing all workers...");

    for (const id in cluster.workers) {
      cluster.workers[id]?.kill();
    }

    process.exit(0);
  };

  process.on("SIGINT", shutdownMaster);
  process.on("SIGTERM", shutdownMaster);
} else {
  await startWorker();
}

async function startWorker() {
  let server;
  const app = await buildApp();

  // Graceful shutdown for worker
  const shutdownWorker = () => {
    console.log(`🛑 Worker ${process.pid} shutting down...`);
    server.close(() => console.log("Server closed gracefully"));

    process.exit(0);
  };

  process.on("SIGINT", shutdownWorker);
  process.on("SIGTERM", shutdownWorker);

  server = app.listen(env.PORT, () => {
    console.log(`🚀 Worker ${process.pid} started on port ${env.PORT}`);
  });
}
