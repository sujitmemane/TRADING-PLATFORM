import express from "express";
import { SmartAPI } from "smartapi-javascript";
import authRoutes from "./src/routes/auth.route.js";
import userRoutes from "./src/routes/user.route.js";
import brokerRoutes from "./src/routes/broker.route.js";
import userBrokerRoutes from "./src/routes/user-broker.route.js";
import { connectDB } from "./src/config/database.js";
import cors from "cors";
import { config } from "dotenv";
import https from "https";
import fs from "fs";

config({
  path: "./.env",
});

const app = express();

// 🔐 HTTPS Certificate
const sslOptions = {
  key: fs.readFileSync("./cert/server.key"),
  cert: fs.readFileSync("./cert/server.cert"),
};

let smartAPI = new SmartAPI({
  api_key: "smartapi_key",
});

connectDB();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/brokers", brokerRoutes);
app.use("/api/v1/user-brokers", userBrokerRoutes);

// 🔄 Start HTTPS Server
https.createServer(sslOptions, app).listen(443, () => {
  console.log("🔐 HTTPS server running on https://localhost");
});
