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
  const [playlist, setPlaylist] = useState({
    name: "My New Playlist",
    description: "Created with Groovr",
    tracks: [],
  });
  const [user, setUser] = useState(null);

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
      // Get preview URL from Deezer
      const previewUrl = await fetchDeezerPreview(track.name, track.artist);
      if (!previewUrl) {
        console.log("Preview not available.");
        // Continue even if preview is not available
      }

      setSelectedSong(track);
      setIsMatching(true);
    } catch (error) {
      console.error("Error handling song selection:", error);
    }
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
        {!selectedSong ? (
          // Initial Search View
          <Box
            sx={{
              width: "100%",
              maxWidth: "600px",
              mx: "auto",
              textAlign: "center",
              transform: "translateY(-5vh)",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(90deg, #6366F1 0%, #A855F7 100%)",
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
              Start by selecting a song you love, and we'll help you discover
              similar tracks to create your perfect playlist.
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
            <PlaylistPanel playlist={playlist} onPlaylistUpdate={setPlaylist} />

            <MatchingSection
              selectedSong={selectedSong}
              isMatching={isMatching}
              onMatch={(track) => {
                setPlaylist((prev) => ({
                  ...prev,
                  tracks: [...prev.tracks, track],
                }));
              }}
            />

            <SelectedTracksPanel
              tracks={playlist.tracks}
              onTrackRemove={(trackId) => {
                setPlaylist((prev) => ({
                  ...prev,
                  tracks: prev.tracks.filter((t) => t.id !== trackId),
                }));
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
