import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutr from "./routes/authRoutr.js";
import companyRoute from "./routes/companyRoute.js";
import jobRoute from "./routes/jobRoutes.js";
import applicationRoute from "./routes/applicationRoute.js";
import messageRoute from "./routes/messageRoute.js";
import http from "node:http";
import { initializeSocket } from "./socket.js";
import path from "path";

dotenv.config({});
connectDB();
const app = express();
const server = http.createServer(app);
initializeSocket(server);

const __dirname = path.resolve();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(morgan("dev"));
const allowedOrigins = [
  "http://localhost:3000", // CRA dev (if running separately)
  "http://localhost:8000", // React served by backend (YOUR CURRENT CASE)
  "http://127.0.0.1:3000",
  "http://127.0.0.1:8000",
  "https://mern-stack-jobportal-project.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// APIs
app.use("/api/v1/auth", authRoutr);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/message", messageRoute);

app.use(express.static(path.join(__dirname, "/jobportal/build")));
app.get('*', (_,res) => {
    res.sendFile(path.resolve(__dirname, "jobportal", "build", "index.html"));
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Node server Running In port ${PORT}`);
});

