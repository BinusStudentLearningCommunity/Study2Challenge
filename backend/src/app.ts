import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

import authRoutes from "./routes/auth.route";
import dashboardRoutes from "./routes/dashboard.route";
import eventRoutes from "./routes/event.route";
import userRoutes from "./routes/user.route";
import adminRoutes from "./routes/admin.route";
import connectDB from "./config/database";

const app: Application = express();

// Cors

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.FRONTEND_URL, // Your main frontend URL
      "http://localhost:3000", // Local development
      "https://www.study2challenge.bslc.or.id",
      "https://study2-challenge.vercel.app",
    ].filter(Boolean) as string[];

    // Check if the origin is in the allowed list
    if (
      allowedOrigins.some(
        (allowedOrigin) =>
          origin === allowedOrigin ||
          (allowedOrigin.includes("*") &&
            origin.endsWith(allowedOrigin.split("*")[1]))
      )
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies/auth headers if needed
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 600, // How long the results of a preflight request can be cached (in seconds)
};

// Apply CORS with options
app.use(cors(corsOptions));

// Apply JSON parser first for most routes
app.use(express.json());
app.use(morgan("dev"));

// Connect to database (handle Vercel serverless environment)
if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  connectDB();
} else {
  // For Vercel, we might want to handle DB connection differently
  // or rely on connection pooling
  connectDB().catch(console.error);
}

// Routes
app.use("/api", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/user", userRoutes);
app.use("/api/event", eventRoutes); // Keep this after JSON parser if events need JSON
app.use("/api/admin", adminRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Berhasil masuk API BSLC" });
});

// Health check endpoint for Vercel
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("GLOBAL ERROR HANDLER:", err.stack || err);
  res
    .status(500)
    .json({ message: "Terjadi kesalahan pada server!", error: err.message });
});

// Export for Vercel serverless
export default app;

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  const PORT: string | number = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server backend berjalan pada port ${PORT}`);
  });
}
