import {
  Box,
  Typography,
  IconButton,
  ListItem,
  Tooltip,
  Button,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { createPlaylist } from "../../services/spotifyApi";

const SelectedTracksPanel = ({
  tracks = [],
  onTrackRemove,
  onTracksReorder,
}) => {
  const onCreatePlaylist = async (tracks) => {
    try {
      // Get the first track's artist to fetch their genre
      const firstTrack = tracks[0];
      const response = await fetch(
        `http://localhost:5001/api/artists/${firstTrack.artistId}`,
        {
          credentials: "include",
        }
      );
      const artistData = await response.json();

      // Use the first genre, or "Mixed" if no genres are found
      const mainGenre = artistData.genres?.[0]?.split(" ")[0] || "Mixed";
      const capitalizedGenre =
        mainGenre.charAt(0).toUpperCase() + mainGenre.slice(1);

      const playlistName = `My Groovr ${capitalizedGenre} Playlist`;
      const description = "Created with Groovr - Your Personal Music Matcher";

      const trackUris = tracks.map((track) => track.uri);
      const createResponse = await createPlaylist(
        playlistName,
        description,
        trackUris
      );

      console.log("Playlist created:", createResponse);
      // You might want to show a success message or redirect to the playlist
    } catch (error) {
      console.error("Error creating playlist:", error);
      // Handle error (show error message to user)
    }
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
        display: "flex",
        flexDirection: "column",
        mt: 4,
        minWidth: "300px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#fff",
            fontWeight: 600,
          }}
        >
          Selected Tracks
        </Typography>
        <Typography
          sx={{
            color: alpha("#fff", 0.7),
            fontSize: "0.875rem",
          }}
        >
          {tracks.length} tracks
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          mb: 3,
          "&::-webkit-scrollbar": {
            display: "none",
          },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {tracks.length === 0 ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ color: alpha("#fff", 0.5) }}>
              Swipe right on tracks you like to add them to your playlist
            </Typography>
          </Box>
        ) : (
          <Reorder.Group
            as="ul"
            axis="y"
            values={tracks}
            onReorder={onTracksReorder}
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            <AnimatePresence>
              {tracks.map((track) => (
                <Reorder.Item
                  key={track.id}
                  value={track}
                  as="li"
                  whileDrag={{
                    scale: 1.05,
                    boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                  }}
                  style={{
                    listStyle: "none",
                    margin: "0 0 8px 0",
                    padding: 0,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    layout
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        p: 1,
                        borderRadius: 2,
                        background: alpha("#fff", 0.03),
                        border: `1px solid ${alpha("#fff", 0.05)}`,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          background: alpha("#fff", 0.05),
                          transform: "translateX(4px)",
                          "& .track-actions": {
                            opacity: 1,
                          },
                        },
                      }}
                    >
                      <DragIndicatorRoundedIcon
                        sx={{
                          color: alpha("#fff", 0.3),
                          cursor: "grab",
                          "&:active": { cursor: "grabbing" },
                        }}
                      />

                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1,
                          overflow: "hidden",
                          flexShrink: 0,
                          position: "relative",
                          "&:hover .play-overlay": {
                            opacity: 1,
                          },
                        }}
                      >
                        <img
                          src={track.albumArt}
                          alt={track.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <Box
                          className="play-overlay"
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: alpha("#000", 0.5),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0,
                            transition: "opacity 0.2s ease",
                            cursor: "pointer",
                          }}
                        >
                          <PlayArrowRoundedIcon
                            sx={{ color: "#fff", fontSize: 20 }}
                          />
                        </Box>
                      </Box>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          noWrap
                          sx={{
                            color: "#fff",
                            fontWeight: 500,
                          }}
                        >
                          {track.name}
                        </Typography>
                        <Typography
                          noWrap
                          sx={{
                            color: alpha("#fff", 0.7),
                            fontSize: "0.875rem",
                          }}
                        >
                          {track.artist}
                        </Typography>
                      </Box>

                      <Box
                        className="track-actions"
                        sx={{
                          opacity: 0,
                          transition: "opacity 0.2s ease",
                        }}
                      >
                        <Tooltip title="Remove track">
                          <IconButton
                            size="small"
                            onClick={() => onTrackRemove(track.id)}
                            sx={{
                              color: alpha("#fff", 0.7),
                              "&:hover": {
                                color: "#ef4444",
                                background: alpha("#ef4444", 0.1),
                              },
                            }}
                          >
                            <DeleteRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </motion.div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        )}
      </Box>

      <Button
        fullWidth
        variant="contained"
        startIcon={<PlaylistAddRoundedIcon />}
        disabled={tracks.length === 0}
        onClick={() => onCreatePlaylist(tracks)}
        sx={{
          background: "linear-gradient(45deg, #6366F1 30%, #818CF8 90%)",
          borderRadius: "12px",
          textTransform: "none",
          fontSize: "0.9rem",
          fontWeight: 600,
          padding: "12px",
          boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
          transition: "all 0.2s ease-in-out",
          border: `1px solid ${alpha("#fff", 0.1)}`,
          backdropFilter: "blur(8px)",
          "&:hover": {
            background: "linear-gradient(45deg, #4F46E5 30%, #6366F1 90%)",
            transform: "translateY(-1px)",
            boxShadow: "0 6px 16px rgba(99, 102, 241, 0.3)",
          },
          "&:active": {
            transform: "translateY(1px)",
            boxShadow: "0 2px 8px rgba(99, 102, 241, 0.2)",
          },
          "&.Mui-disabled": {
            background: alpha("#6366F1", 0.1),
            color: alpha("#fff", 0.4),
            border: `1px solid ${alpha("#fff", 0.05)}`,
            boxShadow: "none",
          },
          "& .MuiButton-startIcon": {
            marginRight: "8px",
          },
        }}
      >
        Create Playlist
      </Button>
    </Box>
  );
};

export default SelectedTracksPanel;
