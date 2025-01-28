import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import { alpha, keyframes } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import { motion, AnimatePresence } from "framer-motion";
import { searchTracks } from "../../services/spotifyApi"; // Make sure this import exists
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

// Shimmer animation for loading state
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const SearchSection = ({ onSongSelect }) => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const searchSongs = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const { tracks } = await searchTracks(query);
        // tracks is already transformed by the backend
        setResults(tracks);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchSongs, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <Box sx={{ position: "relative", maxWidth: "600px", mx: "auto" }}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <TextField
          fullWidth
          placeholder="Search for a song..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: alpha("#fff", 0.7) }} />
              </InputAdornment>
            ),
            endAdornment: isSearching && (
              <InputAdornment position="end">
                <CircularProgress size={20} sx={{ color: "#6366F1" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: 56,
              background: alpha("#fff", 0.05),
              backdropFilter: "blur(10px)",
              borderRadius: 3,
              transition: "all 0.3s ease",
              border: `1px solid ${alpha("#fff", 0.1)}`,
              "&:hover, &.Mui-focused": {
                background: alpha("#fff", 0.08),
                border: `1px solid ${alpha("#6366F1", 0.5)}`,
                boxShadow: `0 0 20px ${alpha("#6366F1", 0.15)}`,
              },
              "& fieldset": { border: "none" },
            },
            "& .MuiOutlinedInput-input": {
              color: "#fff",
              fontSize: "1.1rem",
              "&::placeholder": {
                color: alpha("#fff", 0.5),
                opacity: 1,
              },
            },
          }}
        />
      </motion.div>

      <AnimatePresence>
        {isFocused && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Paper
              elevation={0}
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                mt: 1,
                background: "rgba(18, 18, 18, 0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                maxHeight: "300px",
                overflow: "auto",
                zIndex: 1000,
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "4px",
                },
              }}
            >
              {isSearching ? (
                <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                  <CircularProgress size={24} sx={{ color: "#6366F1" }} />
                </Box>
              ) : (
                results.map((track) => (
                  <Box
                    key={track.id}
                    onClick={() => onSongSelect(track)}
                    sx={{
                      p: 1.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: "rgba(255, 255, 255, 0.05)",
                        "& .play-button": {
                          opacity: 1,
                          transform: "scale(1)",
                        },
                      },
                      "&:not(:last-child)": {
                        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <img
                        src={track.albumArt}
                        alt={track.name}
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "6px",
                        }}
                      />
                      <IconButton
                        className="play-button"
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%) scale(0.8)",
                          opacity: 0,
                          transition: "all 0.2s ease",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                          },
                          padding: "4px",
                        }}
                        size="small"
                      >
                        <PlayArrowRoundedIcon
                          sx={{ color: "white", fontSize: "20px" }}
                        />
                      </IconButton>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        noWrap
                        sx={{
                          color: "white",
                          fontWeight: 500,
                          fontSize: "0.95rem",
                        }}
                      >
                        {track.name}
                      </Typography>
                      <Typography
                        noWrap
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          fontSize: "0.85rem",
                        }}
                      >
                        {track.artist}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        color: "rgba(255, 255, 255, 0.5)",
                        fontSize: "0.5rem",
                        whiteSpace: "nowrap",
                        background: "rgba(255, 255, 255, 0.1)",
                        padding: "2px 4px",
                        borderRadius: "2px",
                      }}
                    >
                      {track.explicit ? "E" : "C"}
                    </Typography>
                    <Typography
                      sx={{
                        color: "rgba(255, 255, 255, 0.5)",
                        fontSize: "0.85rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDuration(track.duration_ms)}
                    </Typography>
                  </Box>
                ))
              )}
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default SearchSection;
