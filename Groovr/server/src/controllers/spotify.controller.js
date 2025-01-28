const axios = require("axios");

const spotifyController = {
  getUserProfile: async (req, res) => {
    try {
      const accessToken = req.user.access_token;

      const response = await axios.get("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return res.json({
        id: response.data.id,
        display_name: response.data.display_name,
        email: response.data.email,
        images: response.data.images,
        country: response.data.country,
        product: response.data.product,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return res.status(500).json({ error: "Failed to fetch user profile" });
    }
  },

  getRecentlyPlayed: async (req, res) => {
    try {
      const accessToken = req.user.access_token;

      const response = await axios.get(
        "https://api.spotify.com/v1/me/player/recently-played",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          params: {
            limit: 20,
          },
        }
      );

      const tracks = response.data.items.map((item) => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists[0].name,
        albumArt: item.track.album.images[0]?.url,
        played_at: item.played_at,
        duration_ms: item.track.duration_ms,
      }));

      return res.json({ tracks });
    } catch (error) {
      console.error(
        "Error in getRecentlyPlayed:",
        error.response?.data || error.message
      );
      return res.status(500).json({
        error: "Failed to fetch recently played tracks",
        details: error.response?.data || error.message,
      });
    }
  },

  getTopArtists: async (req, res) => {
    try {
      const accessToken = req.user.access_token;

      const response = await axios.get(
        "https://api.spotify.com/v1/me/top/artists",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          params: {
            limit: 20,
            time_range: "medium_term",
          },
        }
      );

      const artists = response.data.items.map((artist) => ({
        id: artist.id,
        name: artist.name,
        genres: artist.genres,
        images: artist.images,
        popularity: artist.popularity,
      }));

      return res.json({ artists });
    } catch (error) {
      console.error(
        "Error in getTopArtists:",
        error.response?.data || error.message
      );
      return res.status(500).json({
        error: "Failed to fetch top artists",
        details: error.response?.data || error.message,
      });
    }
  },

  getTopGenres: async (req, res) => {
    try {
      const accessToken = req.user.access_token;

      const response = await axios.get(
        "https://api.spotify.com/v1/me/top/artists",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          params: {
            limit: 50,
            time_range: "medium_term",
          },
        }
      );

      // Extract and count genres
      const genreCounts = response.data.items.reduce((acc, artist) => {
        artist.genres.forEach((genre) => {
          acc[genre] = (acc[genre] || 0) + 1;
        });
        return acc;
      }, {});

      // Sort genres by count
      const sortedGenres = Object.entries(genreCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([genre]) => genre);

      return res.json({ genres: sortedGenres });
    } catch (error) {
      console.error(
        "Error in getTopGenres:",
        error.response?.data || error.message
      );
      return res.status(500).json({
        error: "Failed to fetch top genres",
        details: error.response?.data || error.message,
      });
    }
  },

  searchTracks: async (req, res) => {
    try {
      const { q: query } = req.query;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }

      const accessToken = req.user.access_token;

      const response = await axios.get("https://api.spotify.com/v1/search", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          q: query,
          type: "track",
          limit: 20,
        },
      });

      const tracks = response.data.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        albumArt: track.album.images[0]?.url,
        previewUrl: track.preview_url,
        uri: track.uri,
        duration_ms: track.duration_ms,

        popularity: track.popularity,
        explicit: track.explicit,
      }));

      return res.json({ tracks });
    } catch (error) {
      console.error("Error searching tracks:", error);
      return res.status(500).json({ error: "Failed to search tracks" });
    }
  },

  getRecommendations : async (req, res) => {
    const { previewUrl } = req.body;  // The URL of the audio to analyze
    console.log("previewUrl from controller: ", previewUrl);

    try {
        // Step 1: Call Flask API to get genre based on the previewUrl (audio file)
        const flaskResponse = await axios.post('http://127.0.0.1:5000/predict', {
            url: "https://cdnt-preview.dzcdn.net/api/1/1/d/0/2/0/d029ec2caa866126755ce1b9d0f1c56f.mp3?hdnea=exp=1738041789~acl=/api/1/1/d/0/2/0/d029ec2caa866126755ce1b9d0f1c56f.mp3*~data=user_id=0,application_id=42~hmac=1e5f6416d602f372a22437a2da73c36e55aac0617001291e2586b715e6113aab"
        });

        // Step 2: Extract the genre from the Flask response
        const genre = flaskResponse.data.genre;
        if (!genre) {
            return res.status(404).json({ message: 'No genre predicted from the audio.' });
        }

        console.log("Predicted genre: ", genre);

        // Step 3: Use the genre to fetch related tracks from Spotify
        const accessToken = req.user.access_token;

        // Step 4: Search for tracks using the first genre from Flask response
        const searchResponse = await axios.get("https://api.spotify.com/v1/search", {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { q: `genre:"${genre}"`, type: "track", limit: 50 }
        });

        // Map the search results to your desired track data
        const recommendedTracks = searchResponse.data.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            albumArt: track.album.images[0]?.url,
            previewUrl: track.preview_url,
            uri: track.uri
        }));

        return res.status(200).json({
            message: `Recommendations based on the genre: ${genre}`,
            tracks: recommendedTracks,
        });

    } catch (error) {
        console.error("Error in getRecommendations:", error.response?.data || error.message);
        res.status(500).json({
            error: "Failed to fetch recommendations",
            details: error.response?.data || error.message,
        });
    }
},


  getArtist: async (req, res) => {
    try {
      const { artistId } = req.params;
      const accessToken = req.user.access_token;

      const response = await axios.get(
        `https://api.spotify.com/v1/artists/${artistId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      return res.json({
        id: response.data.id,
        name: response.data.name,
        genres: response.data.genres,
      });
    } catch (error) {
      console.error("Error fetching artist:", error);
      return res.status(500).json({ error: "Failed to fetch artist details" });
    }
  },

  createPlaylist: async (req, res) => {
    try {
      const { name, description, trackUris } = req.body;
      const accessToken = req.user.access_token;

      // First create an empty playlist
      const createResponse = await axios.post(
        `https://api.spotify.com/v1/me/playlists`,
        {
          name,
          description,
          public: false,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const playlistId = createResponse.data.id;

      // Then add tracks to the playlist
      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          uris: trackUris,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return res.json({
        success: true,
        playlistId,
        playlistUrl: createResponse.data.external_urls.spotify,
      });
    } catch (error) {
      console.error("Error creating playlist:", error);
      return res.status(500).json({
        error: "Failed to create playlist",
        details: error.response?.data || error.message,
      });
    }
  },
};

module.exports = spotifyController;
