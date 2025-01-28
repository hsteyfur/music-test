import {
  Box,
  Modal,
  Typography,
  IconButton,
  Chip,
  Avatar,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

const ITEMS_PER_PAGE = 20;

const StatsModal = ({ open, onClose, title, data, type }) => {
  const [page, setPage] = useState(0);

  const paginatedData = data.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );
  const hasMore = data.length > (page + 1) * ITEMS_PER_PAGE;

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="stats-modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 600 },
          maxHeight: "80vh",
          bgcolor: "rgba(18, 18, 18, 0.95)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ color: "#fff" }}>
            {title}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {type === "genres" && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {paginatedData.map((genre, index) => (
              <Chip
                key={index}
                label={genre}
                sx={{
                  bgcolor: alpha("#6366F1", 0.1),
                  color: "#fff",
                  "&:hover": { bgcolor: alpha("#6366F1", 0.2) },
                }}
              />
            ))}
          </Box>
        )}

        {type === "artists" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {paginatedData.map((artist, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <Avatar
                  src={artist.images?.[0]?.url}
                  sx={{ width: 50, height: 50 }}
                />
                <Box>
                  <Typography sx={{ color: "#fff" }}>{artist.name}</Typography>
                  <Typography
                    sx={{ color: alpha("#fff", 0.7), fontSize: "0.875rem" }}
                  >
                    {artist.genres.slice(0, 2).join(", ")}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {type === "tracks" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {paginatedData.map((track, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <img
                  src={track.albumArt}
                  alt={track.name}
                  style={{ width: 50, height: 50, borderRadius: 4 }}
                />
                <Box>
                  <Typography sx={{ color: "#fff" }}>{track.name}</Typography>
                  <Typography
                    sx={{ color: alpha("#fff", 0.7), fontSize: "0.875rem" }}
                  >
                    {track.artist}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {hasMore && (
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Chip
              label="Load More"
              onClick={loadMore}
              sx={{
                bgcolor: alpha("#6366F1", 0.1),
                color: "#fff",
                cursor: "pointer",
                "&:hover": { bgcolor: alpha("#6366F1", 0.2) },
              }}
            />
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default StatsModal;
