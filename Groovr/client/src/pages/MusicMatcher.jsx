import { useEffect, useState } from "react";
import { Box, Typography, Container } from "@mui/material";
import { alpha } from "@mui/material/styles";

// We'll create these components next
import SearchSection from "../components/musicMatcher/SearchSection";
import MatchingSection from "../components/musicMatcher/MatchingSection";
import PlaylistPanel from "../components/musicMatcher/PlaylistPanel";
import { getUserProfile } from "../services/spotifyApi";
import SelectedTracksPanel from "../components/musicMatcher/SelectedTracksPanel";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { fetchDeezerPreview } from "../services/deezerApi";

const MusicMatcher = () => {
  const { isAuthenticated } = useAuth();
  const [selectedSong, setSelectedSong] = useState(null);
  const [isMatching, setIsMatching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [seedSongs, setSeedSongs] = useState([]);
  const [playlist, setPlaylist] = useState({
    name: "My New Playlist",
    description: "Created with Groovr",
    tracks: [],
  });
  const [user, setUser] = useState(null);
  const [currentGenre, setCurrentGenre] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);

  const handleSongSelect = async (track) => {
    try {
      const previewUrl = await fetchDeezerPreview(track.name, track.artist);
      if (!previewUrl) {
        console.log("Preview not available.");
      }

      // Add to seed songs with pending genre
      setSeedSongs((prev) => [...prev, { ...track, genre: "pending" }]);

      // Add the selected song to playlist automatically if it's not already there
      setPlaylist((prev) => ({
        ...prev,
        tracks: prev.tracks.some((t) => t.id === track.id)
          ? prev.tracks
          : [...prev.tracks, track],
      }));

      setSelectedSong(track);
      setIsMatching(true);
      setShowSearch(false);
    } catch (error) {
      console.error("Error handling song selection:", error);
    }
  };

  const handleGenreUpdate = (songId, genre) => {
    console.log(`Updating genre for song ${songId} to ${genre}`);
    setSeedSongs((prev) =>
      prev.map((song) => (song.id === songId ? { ...song, genre } : song))
    );
  };

  const handleChangeClick = () => {
    setShowSearch(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#000",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Gradient Circle Background */}
      <Box
        sx={{
          position: "absolute",
          width: "60vw",
          height: "60vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0) 70%)",
          filter: "blur(40px)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />
      <Header user={user} />

      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          flex: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        {!selectedSong || showSearch ? (
          // Initial Search View or Change Song View
          <Box
            sx={{
              width: "100%",
              maxWidth: "600px",
              mx: "auto",
              textAlign: "center",
              transform: "translateY(-5vh)",
            }}
          >
            {!selectedSong ? (
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  background:
                    "linear-gradient(90deg, #6366F1 0%, #A855F7 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "'Righteous', cursive",
                  cursor: "pointer",
                  letterSpacing: "0.5px",
                  mb: 3,
                  fontSize: { xs: "3.5rem", md: "5.5rem" },
                }}
              >
                GROOVR
              </Typography>
            ) : null}

            <Typography
              sx={{
                color: alpha("#fff", 0.7),
                mb: 6,
                fontSize: { xs: "1rem", md: "1.1rem" },
                lineHeight: 1.6,
                maxWidth: "500px",
                mx: "auto",
              }}
            >
              {!selectedSong
                ? "Start by selecting a song you love, and we'll help you discover similar tracks to create your perfect playlist."
                : "Select another song to add more recommendations to your playlist."}
            </Typography>

            <SearchSection onSongSelect={handleSongSelect} />
          </Box>
        ) : (
          // Matching View with Side Panels
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "300px 1fr 300px",
              gap: 3,
              height: "calc(100vh - 100px)",
              width: "100%",
            }}
          >
            <PlaylistPanel
              playlist={playlist}
              onPlaylistUpdate={setPlaylist}
              seedSongs={seedSongs}
            />

            <MatchingSection
              selectedSong={selectedSong}
              isMatching={isMatching}
              onMatch={(track) => {
                setPlaylist((prev) => ({
                  ...prev,
                  tracks: [...prev.tracks, track],
                }));
              }}
              onChangeClick={handleChangeClick}
              onGenreUpdate={handleGenreUpdate}
              currentGenre={currentGenre}
              seedSongs={seedSongs}
            />

            <SelectedTracksPanel
              tracks={playlist.tracks}
              seedSongs={seedSongs}
              onTrackRemove={(trackId) => {
                setPlaylist((prev) => ({
                  ...prev,
                  tracks: prev.tracks.filter((t) => t.id !== trackId),
                }));
                setSeedSongs((prev) => prev.filter((s) => s.id !== trackId));
              }}
              onTracksReorder={(newTracks) => {
                setPlaylist((prev) => ({
                  ...prev,
                  tracks: newTracks,
                }));
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default MusicMatcher;
