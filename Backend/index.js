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

dotenv.config({});
connectDB();

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const corsOptions = {
    origin:'http://localhost:3000',
    credentials:true
}
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(cookieParser());

// APIs
app.use("/api/v1/auth", authRoutr);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/application", applicationRoute);


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Node server Running In port ${PORT}`);
});

