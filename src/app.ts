import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import teamRoutes from "./routes/teamRoutes";
import standupRoutes from "./routes/standupRoutes";
import insightRoutes from "./routes/insightRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// Main Routes
app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/standup", standupRoutes);
app.use("/api/insights", insightRoutes);

export default app;
