import { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Tooltip,
  Button,
  Stack,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import ThumbDownRoundedIcon from "@mui/icons-material/ThumbDownRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import ChangeCircleRoundedIcon from "@mui/icons-material/ChangeCircleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { fetchDeezerPreview } from "../../services/deezerApi";
import { pre } from "framer-motion/client";
import Card from "./Card";

const MatchingSection = ({
  selectedSong,
  isMatching,
  onMatch,
  onChangeClick,
  onGenreUpdate,
  currentGenre,
  seedSongs = [],
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const progressInterval = useRef(null);
  const [isChangingSong, setIsChangingSong] = useState(false);
  const [error, setError] = useState(null);
  const fetchController = useRef(null);

  // Store the callback function in a ref to prevent infinite loops
  const onGenreUpdateRef = useRef(onGenreUpdate);
  useEffect(() => {
    onGenreUpdateRef.current = onGenreUpdate;
  }, [onGenreUpdate]);

  // Store seedSongs in a ref to prevent dependency changes
  const seedSongsRef = useRef(seedSongs);
  useEffect(() => {
    seedSongsRef.current = seedSongs;
  }, [seedSongs]);

  const fetchRecommendations = useCallback(async () => {
    if (!selectedSong) return;

    // Cancel any existing fetch
    if (fetchController.current) {
      fetchController.current.abort();
    }
    fetchController.current = new AbortController();

    setIsLoading(true);
    setError(null);
    try {
      const previewUrl = await fetchDeezerPreview(
        selectedSong.name,
        selectedSong.artist
      );

      if (!previewUrl) {
        throw new Error("No preview URL available for this track");
      }

      const response = await fetch(
        `http://localhost:5001/api/recommendations/${selectedSong.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            previewUrl,
            seedTracks:
              seedSongsRef.current?.filter(
                (song) => song.id !== selectedSong.id
              ) || [],
          }),
          signal: fetchController.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();

      if (!data.tracks || data.tracks.length === 0) {
        throw new Error(
          "No recommendations found for this combination of songs"
        );
      }

      if (data.primaryGenre) {
        onGenreUpdateRef.current(selectedSong.id, data.primaryGenre);
      }

      setRecommendations(data.tracks);
      setCurrentIndex(0);
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }
      console.error("Error fetching recommendations:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSong]); // Only depend on selectedSong

  // Single useEffect for fetching
  useEffect(() => {
    if (selectedSong) {
      fetchRecommendations();
    }

    return () => {
      if (fetchController.current) {
        fetchController.current.abort();
      }
    };
  }, [selectedSong, fetchRecommendations]);

  const handleSwipe = (direction) => {
    if (direction === "right") {
      onMatch(recommendations[currentIndex]);
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePlayPause = useCallback(() => {
    const currentTrack = recommendations[currentIndex];
    if (!currentTrack?.previewUrl) {
      console.log("No preview available");
      return;
    }

    if (!audioRef.current) {
      // Use the Deezer preview URL
      const previewUrl = currentTrack.previewUrl; // This should be the Deezer preview URL
      audioRef.current = new Audio(previewUrl);
      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false);
        setProgress(0);
        clearInterval(progressInterval.current);
      });
    }

    if (isPlaying) {
      audioRef.current.pause();
      clearInterval(progressInterval.current);
    } else {
      // Play the Deezer preview
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      });
      progressInterval.current = setInterval(() => {
        if (audioRef.current) {
          setProgress((audioRef.current.currentTime / 30) * 100); // Deezer previews are 30 seconds
        }
      }, 100);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, recommendations, currentIndex]);

  // Reset audio when track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    setIsPlaying(false);
    setProgress(0);
  }, [currentIndex]);

  const handleRetry = () => {
    fetchRecommendations();
  };

  const LoadingState = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <CircularProgress
        size={60}
        sx={{
          color: "#6366F1",
          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
          },
        }}
      />
      <Typography
        sx={{
          color: alpha("#fff", 0.7),
          textAlign: "center",
          maxWidth: "300px",
        }}
      >
        {isChangingSong
          ? "Finding recommendations based on your seed songs..."
          : "Analyzing song and finding matches..."}
      </Typography>
    </motion.div>
  );

  const ErrorState = ({ message, onRetry, onChangeClick }) => (
    <Box sx={{ textAlign: "center", p: 3 }}>
      <Typography sx={{ color: alpha("#fff", 0.7), mb: 2 }}>
        {message}
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          onClick={onRetry}
          variant="outlined"
          startIcon={<RefreshRoundedIcon />}
          sx={{
            color: "#6366F1",
            borderColor: "#6366F1",
            "&:hover": {
              borderColor: "#4F46E5",
              background: alpha("#6366F1", 0.1),
            },
          }}
        >
          Retry
        </Button>
        <Button
          onClick={onChangeClick}
          variant="outlined"
          startIcon={<ChangeCircleRoundedIcon />}
          sx={{
            color: "#6366F1",
            borderColor: "#6366F1",
            "&:hover": {
              borderColor: "#4F46E5",
              background: alpha("#6366F1", 0.1),
            },
          }}
        >
          Change Song
        </Button>
      </Stack>
    </Box>
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 3,
        }}
      >
        <CircularProgress
          size={60}
          sx={{
            color: "#6366F1",
            filter: "drop-shadow(0 0 10px rgba(99, 102, 241, 0.3))",
          }}
        />
        <Typography
          sx={{
            color: alpha("#fff", 0.7),
            textAlign: "center",
            maxWidth: 400,
          }}
        >
          Finding similar tracks to "{selectedSong.name}"...
        </Typography>
      </Box>
    );
  }

  const currentTrack = recommendations[currentIndex];

  if (!currentTrack) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ color: "#fff", mb: 2 }}>
          No More Recommendations
        </Typography>
        <Typography sx={{ color: alpha("#fff", 0.7), maxWidth: 400 }}>
          We've gone through all our recommendations. Try searching for a
          different song!
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        position: "relative",
        pt: 8,
      }}
    >
      <AnimatePresence mode="sync">
        {currentGenre && !isLoading && (
          <motion.div
            key="genre"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              top: 20,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Tooltip
                title="This genre was detected from your seed song"
                arrow
                placement="top"
              >
                <Box
                  sx={{
                    background:
                      "linear-gradient(45deg, #6366F1 30%, #818CF8 90%)",
                    borderRadius: "20px",
                    padding: "8px 20px",
                    boxShadow: `0 4px 20px ${alpha("#6366F1", 0.3)}`,
                    border: `1px solid ${alpha("#fff", 0.2)}`,
                    cursor: "help",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      textTransform: "capitalize",
                    }}
                  >
                    {currentGenre}
                  </Typography>
                </Box>
              </Tooltip>

              <Tooltip title="Add another seed song" arrow placement="top">
                <IconButton
                  onClick={onChangeClick}
                  sx={{
                    color: alpha("#fff", 0.7),
                    "&:hover": {
                      color: "#fff",
                      background: alpha("#fff", 0.1),
                    },
                  }}
                >
                  <ChangeCircleRoundedIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="sync">
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={fetchRecommendations}
            onChangeClick={onChangeClick}
          />
        ) : recommendations.length === 0 ? (
          <EmptyState onChangeClick={onChangeClick} />
        ) : currentIndex >= recommendations.length ? (
          <EndState onChangeClick={onChangeClick} />
        ) : (
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Card
              track={recommendations[currentIndex]}
              onSwipe={handleSwipe}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              progress={progress}
              hasPreview={Boolean(recommendations[currentIndex]?.previewUrl)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

const EmptyState = ({ onChangeClick }) => (
  <Box sx={{ textAlign: "center", p: 3 }}>
    <Typography sx={{ color: alpha("#fff", 0.7), mb: 2 }}>
      No recommendations found. Try a different song!
    </Typography>
    <Button
      onClick={onChangeClick}
      variant="outlined"
      startIcon={<ChangeCircleRoundedIcon />}
      sx={{
        color: "#6366F1",
        borderColor: "#6366F1",
        "&:hover": {
          borderColor: "#4F46E5",
          background: alpha("#6366F1", 0.1),
        },
      }}
    >
      Change Song
    </Button>
  </Box>
);

const EndState = ({ onChangeClick }) => (
  <Box sx={{ textAlign: "center" }}>
    <Typography sx={{ color: alpha("#fff", 0.7), mb: 2 }}>
      That's all the recommendations we have!
    </Typography>
    <Button
      onClick={onChangeClick}
      variant="outlined"
      sx={{
        color: "#6366F1",
        borderColor: "#6366F1",
        "&:hover": {
          borderColor: "#4F46E5",
          background: alpha("#6366F1", 0.1),
        },
      }}
    >
      Add Another Song
    </Button>
  </Box>
);

export default MatchingSection;
