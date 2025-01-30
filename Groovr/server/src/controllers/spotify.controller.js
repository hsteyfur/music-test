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

  getRecommendations: async (req, res) => {
    try {
      const { previewUrl, seedTracks = [] } = req.body;
      const trackId = req.params.trackId;
      console.log("Starting recommendation process for track:", trackId);

      // Get genre predictions from Flask
      const flaskResponse = await axios.post("http://127.0.0.1:5000/predict", {
        url: previewUrl,
      });

      if (
        !flaskResponse.data.predictions ||
        flaskResponse.data.predictions.length === 0
      ) {
        return res
          .status(404)
          .json({ message: "No genres predicted from the audio." });
      }

      // Map common genre variations
      const genreMap = {
        hiphop: "rap",
        classical: "classical",
        rock: "rock",
        pop: "pop",
        reggae: "reggae",
        disco: "disco",
        country: "country",
        jazz: "jazz",
        blues: "blues",
        metal: "metal",
      };

      let primaryGenre = flaskResponse.data.predictions[0];
      primaryGenre = genreMap[primaryGenre] || primaryGenre;
      console.log("Primary genre for search:", primaryGenre);

      try {
        const accessToken = req.user.access_token;

        // Try multiple search strategies
        const searchStrategies = [
          { q: `genre:${primaryGenre}` },
          { q: primaryGenre }, // Simple genre search
          { q: `genre:${primaryGenre} year:2015-2024` }, // Add year range for more modern results
        ];

        let recommendedTracks = [];

        // Try each search strategy until we get results
        for (const strategy of searchStrategies) {
          console.log("Trying search strategy:", strategy);
          const limit = 50;
          const maxOffset = 1000; // Maximum offset for search
          const randomOffset = Math.floor(Math.random() * maxOffset); // Pick a random offset

          const searchResponse = await axios.get(
            "https://api.spotify.com/v1/search",
            {
              headers: { Authorization: `Bearer ${accessToken}` },
              params: {
                ...strategy,
                type: "track",
                limit: 50,
                market: "US",
              },
            }
          );

          if (searchResponse.data.tracks?.items?.length > 0) {
            // Filter out the seed track and any existing seed tracks
            const seedTrackIds = [
              trackId,
              ...seedTracks.map((track) => track.id),
            ];
            recommendedTracks = searchResponse.data.tracks.items
              .filter((track) => !seedTrackIds.includes(track.id))
              .map((track) => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                albumArt: track.album.images[0]?.url,
                previewUrl: track.preview_url,
                uri: track.uri,
                duration_ms: track.duration_ms,
                popularity: track.popularity,
                explicit: track.explicit,
                artistId: track.artists[0].id,
              }));

            if (recommendedTracks.length > 0) {
              break; // Exit loop if we found tracks
            }
          }
        }

        if (recommendedTracks.length === 0) {
          console.log("No tracks found with any search strategy");
          return res.status(404).json({
            message: "No tracks found for the predicted genre",
            genre: primaryGenre,
          });
        }

        return res.status(200).json({
          message: `Recommendations based on predicted genres: ${flaskResponse.data.predictions.join(
            ", "
          )}`,
          primaryGenre,
          allGenres: flaskResponse.data.predictions,
          tracks: recommendedTracks,
        });
      } catch (spotifyError) {
        console.error("Spotify API error details:", {
          status: spotifyError.response?.status,
          statusText: spotifyError.response?.statusText,
          data: spotifyError.response?.data,
        });
        throw new Error(
          `Failed to fetch tracks from Spotify: ${
            spotifyError.response?.data?.error?.message || spotifyError.message
          }`
        );
      }
    } catch (error) {
      console.error("Error in getRecommendations:", error.message);
      res.status(500).json({
        error: "Failed to fetch recommendations",
        details: error.message,
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

  getUserPlaylists: async (req, res) => {
    try {
      const accessToken = req.user.access_token;

      const response = await axios.get(
        "https://api.spotify.com/v1/me/playlists",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          params: {
            limit: 50, // Adjust this number based on how many playlists you want to fetch
          },
        }
      );

      // Add total tracks count for each playlist
      const playlistsWithTracks = response.data.items.map((playlist) => ({
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        images: playlist.images,
        tracks: {
          total: playlist.tracks.total,
        },
        owner: playlist.owner,
        public: playlist.public,
        collaborative: playlist.collaborative,
        uri: playlist.uri,
      }));

      res.status(200).json({
        items: playlistsWithTracks,
        total: response.data.total,
        limit: response.data.limit,
        offset: response.data.offset,
      });
    } catch (error) {
      console.error(
        "Error fetching playlists:",
        error.response?.data || error.message
      );
      res.status(error.response?.status || 500).json({
        error: "Failed to fetch playlists",
        details: error.response?.data?.error || error.message,
      });
    }
  },
};

module.exports = spotifyController;
