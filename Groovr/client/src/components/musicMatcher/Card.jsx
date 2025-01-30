import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, IconButton, LinearProgress } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import ThumbDownRoundedIcon from "@mui/icons-material/ThumbDownRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import { fetchDeezerPreview } from "../../services/deezerApi";

const Card = ({ track, onSwipe, isPlaying, onPlayPause, hasPreview }) => {
  const [audio, setAudio] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef();

  // Stop and reset audio when track changes
  useEffect(() => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setAudio(null);
      onPlayPause(false);
    }
  }, [track]);

  useEffect(() => {
    const loadPreview = async () => {
      setIsLoading(true);
      const url = await fetchDeezerPreview(track.name, track.artist);
      setPreviewUrl(url);
      setIsLoading(false);
    };
    loadPreview();
  }, [track]);

  const updateProgress = () => {
    if (audio) {
      const currentProgress = (audio.currentTime / audio.duration) * 100;
      setProgress(currentProgress);
      animationRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const stopPreview = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      onPlayPause(false);
    }
  };

  const handlePlayPause = () => {
    if (!previewUrl) return;

    if (!audio) {
      const newAudio = new Audio(previewUrl);
      newAudio.addEventListener("ended", () => {
        onPlayPause(false);
        setAudio(null);
        setProgress(0);
        cancelAnimationFrame(animationRef.current);
      });
      setAudio(newAudio);
      newAudio.play();
      onPlayPause(true);
      animationRef.current = requestAnimationFrame(updateProgress);
    } else {
      audio.pause();
      audio.currentTime = 0;
      setAudio(null);
      setProgress(0);
      onPlayPause(false);
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Cleanup animation and audio on unmount or track change
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        setProgress(0);
      }
    };
  }, [audio, track]);

  const handleSwipe = (direction) => {
    stopPreview();
    onSwipe(direction);
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragEnd={(e, { offset, velocity }) => {
        const swipe = offset.x;
        if (Math.abs(swipe) > 100) {
          handleSwipe(swipe > 0 ? "right" : "left");
        }
      }}
      style={{
        position: "relative",
        cursor: "grab",
      }}
    >
      <Box
        sx={{
          width: 320,
          borderRadius: 4,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
          backdropFilter: "blur(10px)",
          border: `1px solid ${alpha("#fff", 0.1)}`,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Album Art */}
        <Box
          sx={{
            width: "100%",
            height: 320,
            backgroundImage: `url(${track.albumArt})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Track Info */}
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              fontWeight: 600,
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {track.name}
          </Typography>
          <Typography
            sx={{
              color: alpha("#fff", 0.7),
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {track.artist}
          </Typography>

          {/* Controls */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <IconButton
              onClick={() => handleSwipe("left")}
              sx={{
                color: "#ef4444",
                "&:hover": { background: alpha("#ef4444", 0.1) },
              }}
            >
              <ThumbDownRoundedIcon />
            </IconButton>

            <IconButton
              onClick={handlePlayPause}
              disabled={!previewUrl || isLoading}
              sx={{
                position: "relative",
                overflow: "hidden",
                color: previewUrl ? "#fff" : alpha("#fff", 0.3),
                "&:hover": {
                  background: previewUrl ? alpha("#fff", 0.1) : "none",
                },
                cursor: previewUrl ? "pointer" : "not-allowed",
                "&::before": audio
                  ? {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(-45deg, #22c55e, #4ade80, #22c55e, #4ade80)",
                      backgroundSize: "200% 200%",
                      animation: "gradient 2s ease infinite",
                      maskImage: `linear-gradient(90deg, black ${progress}%, transparent ${progress}%)`,
                      WebkitMaskImage: `linear-gradient(90deg, black ${progress}%, transparent ${progress}%)`,
                      opacity: 0.3,
                    }
                  : {},
                "@keyframes gradient": {
                  "0%": {
                    backgroundPosition: "0% 50%",
                  },
                  "50%": {
                    backgroundPosition: "100% 50%",
                  },
                  "100%": {
                    backgroundPosition: "0% 50%",
                  },
                },
              }}
            >
              {audio ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
            </IconButton>

            <IconButton
              onClick={() => handleSwipe("right")}
              sx={{
                color: "#22c55e",
                "&:hover": { background: alpha("#22c55e", 0.1) },
              }}
            >
              <ThumbUpRoundedIcon />
            </IconButton>
          </Box>

          {/* Progress Bar */}
          {isPlaying && (
            <Box sx={{ mt: 3 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 2,
                  borderRadius: 1,
                  "& .MuiLinearProgress-bar": {
                    background: "linear-gradient(to right, #6366F1, #818CF8)",
                  },
                  backgroundColor: alpha("#fff", 0.1),
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default Card;
