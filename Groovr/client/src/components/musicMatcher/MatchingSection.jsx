import { useState, useEffect, useRef } from "react";
import { Box, IconButton, Typography, CircularProgress } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import ThumbDownRoundedIcon from "@mui/icons-material/ThumbDownRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import { fetchDeezerPreview } from "../../services/deezerApi";
import { pre } from "framer-motion/client";

const MatchingSection = ({ selectedSong, isMatching, onMatch }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const previewUrl = await fetchDeezerPreview(selectedSong.name, selectedSong.artist) 
        if(!previewUrl) {
          console.error("No available URL");
           return ;
          }
        console.log("Fetching recommendations for track:", previewUrl);
        const response = await fetch(
          `http://localhost:5001/api/recommendations/${selectedSong.id}`,
          {method : "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "include",
            body : JSON.stringify({previewUrl}),
          }
        );

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("Failed to parse response:", text);
          throw new Error("Invalid response format");
        }

        if (!response.ok) {
          console.error("Response not ok:", response.status, data);
          if (data.spotifyError) {
            console.error("Spotify API Error:", data.spotifyError);
          }
          throw new Error(
            data.error || `HTTP error! status: ${response.status}`
          );
        }

        if (!data.tracks || !data.tracks.length) {
          console.log("No recommendations returned");
          setRecommendations([]);
          return;
        }

        console.log("Received recommendations:", data.tracks.length);
        setRecommendations(data.tracks);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        console.error("Error details:", error.message);
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedSong) {
      fetchRecommendations();
    }
  }, [selectedSong]);

  const handleSwipe = (dir) => {
    setDirection(dir);
    if (dir === "right") {
      onMatch(recommendations[currentIndex]);
    }

    // Reset for next card
    setTimeout(() => {
      setDirection(null);
      setCurrentIndex((prev) => prev + 1);
    }, 300);
  };

  const handlePlayPause = async () => {
    const currentTrack = recommendations[currentIndex];

    if (!audioRef.current) {
      // First time playing this track
      const previewUrl = await fetchDeezerPreview(
        currentTrack.name,
        currentTrack.artist
      );
      if (!previewUrl) {
        console.log("No preview available");
        return;
      }

      audioRef.current = new Audio(previewUrl);
      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false);
        setProgress(0);
        clearInterval(progressIntervalRef.current);
      });
    }

    if (isPlaying) {
      audioRef.current.pause();
      clearInterval(progressIntervalRef.current);
    } else {
      audioRef.current.play();
      // Update progress every 100ms
      progressIntervalRef.current = setInterval(() => {
        const currentProgress = (audioRef.current.currentTime / 30) * 100; // 30 seconds total
        setProgress(currentProgress);
      }, 100);
    }

    setIsPlaying(!isPlaying);
  };

  // Cleanup audio when changing tracks or unmounting
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setIsPlaying(false);
      setProgress(0);
    };
  }, [currentIndex]);

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
      }}
    >
      <AnimatePresence>
        <motion.div
          key={currentTrack.id}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            x: direction === "left" ? -300 : direction === "right" ? 300 : 0,
            rotate: direction === "left" ? -20 : direction === "right" ? 20 : 0,
          }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ width: "100%", maxWidth: 400 }}
        >
          <Box
            sx={{
              position: "relative",
              borderRadius: 4,
              overflow: "hidden",
              aspectRatio: "1",
              background: `linear-gradient(135deg, ${alpha(
                "#fff",
                0.1
              )} 0%, ${alpha("#6366F1", 0.1)} 100%)`,
              backdropFilter: "blur(10px)",
              border: `1px solid ${alpha("#fff", 0.1)}`,
              boxShadow: `0 8px 32px ${alpha("#000", 0.2)}`,
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                border: "2px solid #22c55e",
                borderRadius: "inherit",
                clipPath: `polygon(0 0, ${progress}% 0, ${progress}% 100%, 0 100%)`,
                transition: "clip-path 0.1s linear",
                zIndex: 2,
              },
            }}
          >
            <img
              src={currentTrack.albumArt}
              alt={currentTrack.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                p: 3,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
              }}
            >
              <Typography variant="h5" sx={{ color: "#fff", mb: 1 }}>
                {currentTrack.name}
              </Typography>
              <Typography sx={{ color: alpha("#fff", 0.7) }}>
                {currentTrack.artist}
              </Typography>
            </Box>
            <IconButton
              onClick={handlePlayPause}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                background: alpha("#000", 0.5),
                backdropFilter: "blur(4px)",
                "&:hover": { background: alpha("#000", 0.7) },
                zIndex: 3,
              }}
            >
              {isPlaying ? (
                <PauseRoundedIcon sx={{ color: "#fff" }} />
              ) : (
                <PlayArrowRoundedIcon sx={{ color: "#fff" }} />
              )}
            </IconButton>
          </Box>
        </motion.div>
      </AnimatePresence>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          mt: 4,
        }}
      >
        <IconButton
          onClick={() => handleSwipe("left")}
          sx={{
            width: 64,
            height: 64,
            background: alpha("#fff", 0.1),
            backdropFilter: "blur(10px)",
            "&:hover": {
              background: alpha("#ef4444", 0.2),
              transform: "scale(1.1)",
            },
          }}
        >
          <ThumbDownRoundedIcon sx={{ color: "#ef4444", fontSize: 28 }} />
        </IconButton>
        <IconButton
          onClick={() => handleSwipe("right")}
          sx={{
            width: 64,
            height: 64,
            background: alpha("#fff", 0.1),
            backdropFilter: "blur(10px)",
            "&:hover": {
              background: alpha("#22c55e", 0.2),
              transform: "scale(1.1)",
            },
          }}
        >
          <ThumbUpRoundedIcon sx={{ color: "#22c55e", fontSize: 28 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MatchingSection;
