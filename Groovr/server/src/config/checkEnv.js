function checkRequiredEnvVars() {
  const required = [
    "SPOTIFY_CLIENT_ID",
    "SPOTIFY_CLIENT_SECRET",
    "SPOTIFY_REDIRECT_URI",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("Missing required environment variables:", missing);
    process.exit(1);
  }

  console.log("Environment variables check passed:", {
    clientIdLength: process.env.SPOTIFY_CLIENT_ID.length,
    secretLength: process.env.SPOTIFY_CLIENT_SECRET.length,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  });
}

module.exports = checkRequiredEnvVars;
