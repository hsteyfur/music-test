const express = require("express");
const router = express.Router();
const spotifyController = require("../controllers/spotify.controller");
const { requireAuth } = require("../middleware/auth.middleware");

// User profile and data routes
router.get("/user/profile", requireAuth, spotifyController.getUserProfile);
router.get(
  "/user/recently-played",
  requireAuth,
  spotifyController.getRecentlyPlayed
);
router.get("/user/top-artists", requireAuth, spotifyController.getTopArtists);
router.get("/user/top-genres", requireAuth, spotifyController.getTopGenres);
// Search route
router.get("/search", requireAuth, spotifyController.searchTracks);

// Add this new route
router.post(
  "/recommendations/:trackId",
  requireAuth,
  spotifyController.getRecommendations
);

router.post("/playlist", requireAuth, spotifyController.createPlaylist);

router.get("/artists/:artistId", requireAuth, spotifyController.getArtist);

// Add this new route
router.get("/playlists", requireAuth, spotifyController.getUserPlaylists);

module.exports = router;
