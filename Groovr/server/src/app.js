require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const axios = require("axios");
const authRoutes = require("./routes/auth");
const checkRequiredEnvVars = require("./config/checkEnv");
const spotifyRoutes = require("./routes/spotify.routes");

const app = express();
const PORT = process.env.PORT || 5001;

// Check environment variables before starting the server
checkRequiredEnvVars();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Deezer proxy endpoint
app.get("/api/deezer-proxy", async (req, res) => {
  const { track, artist } = req.query;

  console.log("Received Deezer proxy request:", { track, artist });

  if (!track || !artist) {
    console.error("Missing parameters:", { track, artist });
    return res.status(400).json({
      error: "Track and artist parameters are required",
      received: { track, artist },
    });
  }

  try {
    const url = `https://api.deezer.com/search?q=track:"${encodeURIComponent(
      track
    )}" artist:"${encodeURIComponent(artist)}"`;
    console.log("Calling Deezer API:", url);

    const response = await axios.get(url);
    console.log("Deezer API response received:", {
      total: response.data.total,
      count: response.data.data?.length,
    });

    res.json(response.data);
  } catch (error) {
    console.error("Deezer API error:", error);
    res.status(500).json({
      error: "Error fetching data from Deezer API",
      details: error.message,
      url: `https://api.deezer.com/search?q=track:"${encodeURIComponent(
        track
      )}" artist:"${encodeURIComponent(artist)}"`,
    });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", spotifyRoutes);
// app.use("/api", userRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
