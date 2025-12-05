import mongoose from "mongoose";
import env from "./env-config.js";

let connection;

async function configureMongoose() {
  const mongooseOptions = {
    family: 4,
    minPoolSize: 5,
    maxPoolSize: 30,
    retryWrites: true,
    maxIdleTimeMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    waitQueueTimeoutMS: 10000,
    appName: "Behtech Backend Task",
    readPreference: "primaryPreferred",
  };

  try {
    await mongoose.connect(env.MONGODB_URI, mongooseOptions);
    connection = mongoose.connection;

    connection.on("error", (err) => {
      console.error("Could not connect to MongoDB:", err);
    });

    connection.once("open", () => console.log("Connected to MongoDB..."));
    connection.on("reconnected", () => console.log("🔄 MongoDB reconnected"));
    connection.on("disconnected", () => console.log("⚠️ MongoDB disconnected"));

    return connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}

export default configureMongoose;
