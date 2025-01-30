import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

const PlaylistPanel = ({ playlist, onPlaylistUpdate, seedSongs = [] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(playlist.name);
  const [editedDescription, setEditedDescription] = useState(
    playlist.description
  );

  const handleSave = () => {
    onPlaylistUpdate({
      ...playlist,
      name: editedName,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  return (
    <Box
      sx={{
        height: "100%",
        background: alpha("#fff", 0.03),
        backdropFilter: "blur(10px)",
        borderRadius: 3,
        p: 3,
        border: `1px solid ${alpha("#fff", 0.1)}`,
        mt: 4,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600 }}>
          Playlist Details
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip
            title="Edit your playlist name and description"
            arrow
            placement="top"
          >
            {isEditing ? (
              <IconButton onClick={handleSave} sx={{ color: "#22c55e" }}>
                <SaveRoundedIcon />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => setIsEditing(true)}
                sx={{ color: alpha("#fff", 0.7) }}
              >
                <EditRoundedIcon />
              </IconButton>
            )}
          </Tooltip>
          <Tooltip
            title={
              <Typography sx={{ p: 1, fontSize: "0.875rem" }}>
                Your playlist will be created with all the tracks you've
                collected. The order can be changed by dragging tracks in the
                Selected Tracks panel.
              </Typography>
            }
            arrow
            placement="top"
          >
            <IconButton sx={{ color: alpha("#fff", 0.5) }}>
              <HelpOutlineRoundedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Seed Songs Section with Help Text */}
      {seedSongs.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography sx={{ color: alpha("#fff", 0.7), fontSize: "0.9rem" }}>
              Seed Songs
            </Typography>
            <Tooltip
              title={
                <Typography sx={{ p: 1, fontSize: "0.875rem" }}>
                  Seed songs are the tracks you've selected to base
                  recommendations on. Each seed song adds its own flavor to the
                  recommendations.
                </Typography>
              }
              arrow
              placement="top"
            >
              <IconButton size="small" sx={{ color: alpha("#fff", 0.5) }}>
                <HelpOutlineRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {seedSongs.map((song, index) => (
              <Chip
                key={song.id}
                icon={<MusicNoteRoundedIcon />}
                label={`${song.name} - ${song.genre}`}
                sx={{
                  background:
                    "linear-gradient(45deg, #6366F1 30%, #818CF8 90%)",
                  color: "#fff",
                  border: `1px solid ${alpha("#fff", 0.2)}`,
                  "& .MuiChip-icon": { color: "#fff" },
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {isEditing ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            label="Playlist Name"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                background: alpha("#fff", 0.05),
                "& fieldset": { border: `1px solid ${alpha("#fff", 0.1)}` },
                "&:hover fieldset": {
                  border: `1px solid ${alpha("#fff", 0.2)}`,
                },
                "&.Mui-focused fieldset": {
                  border: `1px solid ${alpha("#6366F1", 0.5)}`,
                },
              },
              "& .MuiInputLabel-root": { color: alpha("#fff", 0.7) },
            }}
          />
          <TextField
            fullWidth
            label="Description"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            multiline
            rows={4}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                background: alpha("#fff", 0.05),
                "& fieldset": { border: `1px solid ${alpha("#fff", 0.1)}` },
                "&:hover fieldset": {
                  border: `1px solid ${alpha("#fff", 0.2)}`,
                },
                "&.Mui-focused fieldset": {
                  border: `1px solid ${alpha("#6366F1", 0.5)}`,
                },
              },
              "& .MuiInputLabel-root": { color: alpha("#fff", 0.7) },
            }}
          />
        </Box>
      ) : (
        <Box>
          <Typography sx={{ color: "#fff", fontSize: "1.2rem", mb: 1 }}>
            {playlist.name}
          </Typography>
          <Typography sx={{ color: alpha("#fff", 0.7) }}>
            {playlist.description}
          </Typography>
        </Box>
      )}

      <Button
        startIcon={<DeleteOutlineRoundedIcon />}
        sx={{
          color: "#ef4444",
          mt: "auto",
          alignSelf: "flex-start",
          "&:hover": { background: alpha("#ef4444", 0.1) },
        }}
      >
        Delete Playlist
      </Button>
    </Box>
  );
};

export default PlaylistPanel;
