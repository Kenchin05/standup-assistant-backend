import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import teamRoutes from "./routes/teamRoutes";
import standupRoutes from "./routes/standupRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/standup", standupRoutes);

export default app;
