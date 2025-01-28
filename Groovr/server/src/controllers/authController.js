const axios = require("axios");
const { SPOTIFY_CONFIG } = require("../config/spotify");
const querystring = require("querystring");

const authController = {
  login: (req, res) => {
    try {
      const state = Math.random().toString(36).substring(7);
      const scope = [
        "user-read-private",
        "user-read-email",
        "playlist-modify-public",
        "playlist-modify-private",
        "user-library-read",
        "user-top-read",
        "user-read-recently-played",
        "user-read-playback-state",
        "user-read-currently-playing",
      ].join(" ");

      const queryParams = querystring.stringify({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: SPOTIFY_CONFIG.redirectUri,
        state: state,
      });

      const authUrl = `${SPOTIFY_CONFIG.authEndpoint}?${queryParams}`;
      console.log("Login URL generated:", authUrl);
      res.json({ url: authUrl });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  },

  callback: async (req, res) => {
    console.log("Callback received with query:", req.query);
    const { code } = req.query;

    if (!code) {
      console.error("No code provided in callback");
      return res.status(400).json({ error: "Authorization code is required" });
    }

    // Check if we've already processed this code
    if (req.session.processedCodes?.includes(code)) {
      console.log("Code already processed:", code);
      return res.status(400).json({ error: "Authorization code already used" });
    }

    try {
      const tokenResponse = await axios.post(
        "https://accounts.spotify.com/api/token",
        querystring.stringify({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        }),
        {
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(
                process.env.SPOTIFY_CLIENT_ID +
                  ":" +
                  process.env.SPOTIFY_CLIENT_SECRET
              ).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { access_token, refresh_token } = tokenResponse.data;

      if (!access_token) {
        throw new Error("No access token received from Spotify");
      }

      // Store the processed code
      if (!req.session.processedCodes) {
        req.session.processedCodes = [];
      }
      req.session.processedCodes.push(code);

      // Store tokens in session
      req.session.access_token = access_token;
      req.session.refresh_token = refresh_token;

      res.json({
        access_token,
        token_type: tokenResponse.data.token_type,
        expires_in: tokenResponse.data.expires_in,
      });
    } catch (error) {
      console.error(
        "Token exchange error:",
        error.response?.data || error.message
      );
      res.status(500).json({
        error: "Token exchange failed",
        message: error.response?.data?.error_description || error.message,
      });
    }
  },

  refresh: async (req, res) => {
    const refresh_token = req.session.refresh_token;

    if (!refresh_token) {
      return res.status(401).json({ error: "No refresh token" });
    }

    try {
      const response = await axios.post(
        SPOTIFY_CONFIG.tokenEndpoint,
        new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refresh_token,
        }),
        {
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(
                SPOTIFY_CONFIG.clientId + ":" + SPOTIFY_CONFIG.clientSecret
              ).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { access_token } = response.data;
      req.session.access_token = access_token;

      res.json({ access_token });
    } catch (error) {
      console.error(
        "Token refresh error:",
        error.response?.data || error.message
      );
      res.status(400).json({ error: "Token refresh failed" });
    }
  },
};

module.exports = authController;
