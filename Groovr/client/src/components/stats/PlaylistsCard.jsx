import {
  Box,
  Paper,
  Typography,
  IconButton,
  Skeleton,
  Grid,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import { keyframes } from "@mui/system";

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const PlaylistsCard = ({ playlists = [], isLoading, onClick }) => {
  const playlistList = Array.isArray(playlists) ? playlists : [];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: `linear-gradient(135deg, ${alpha("#fff", 0.03)} 0%, ${alpha(
          "#6366F1",
          0.05
        )} 100%)`,
        backdropFilter: "blur(10px)",
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${alpha("#fff", 0.05)}`,
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            background: alpha("#6366F1", 0.1),
            display: "flex",
            alignItems: "center",
            mr: 1.5,
          }}
        >
          <QueueMusicIcon
            sx={{
              color: "#6366F1",
              fontSize: 24,
              filter: "drop-shadow(0 2px 4px rgba(99, 102, 241, 0.3))",
            }}
          />
        </Box>
        <Typography
          variant="subtitle1"
          sx={{
            color: alpha("#fff", 0.9),
            fontWeight: 600,
            letterSpacing: "0.5px",
            textShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          Your Playlists
        </Typography>
      </Box>

      {/* Scrollable Content */}
      <Box
        sx={{
          overflow: "auto",
          "&::-webkit-scrollbar": {
            height: 6,
          },
          "&::-webkit-scrollbar-track": {
            background: alpha("#fff", 0.05),
            borderRadius: 3,
          },
          "&::-webkit-scrollbar-thumb": {
            background: alpha("#6366F1", 0.3),
            borderRadius: 3,
            "&:hover": {
              background: alpha("#6366F1", 0.5),
            },
          },
        }}
      >
        {isLoading ? (
          <Grid container spacing={2} sx={{ flexWrap: "nowrap", pb: 1 }}>
            {[...Array(6)].map((_, i) => (
              <Grid item key={i}>
                <Box
                  sx={{
                    width: 200,
                    height: 280,
                    borderRadius: 2,
                    background: alpha("#fff", 0.05),
                    p: 2,
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    width={168}
                    height={168}
                    sx={{
                      borderRadius: 2,
                      animation: `${shimmer} 2s infinite linear`,
                      backgroundImage: `linear-gradient(90deg, 
                        ${alpha("#fff", 0.05)} 0%, 
                        ${alpha("#fff", 0.1)} 50%, 
                        ${alpha("#fff", 0.05)} 100%
                      )`,
                      backgroundSize: "200% 100%",
                    }}
                  />
                  <Skeleton
                    variant="text"
                    width="80%"
                    sx={{ mt: 1, bgcolor: alpha("#fff", 0.1) }}
                  />
                  <Skeleton
                    variant="text"
                    width="60%"
                    sx={{ bgcolor: alpha("#fff", 0.1) }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : playlistList.length > 0 ? (
          <Grid container spacing={2} sx={{ flexWrap: "nowrap", pb: 1 }}>
            {playlistList.map((playlist) => (
              <Grid item key={playlist.id}>
                <Box
                  onClick={() => onClick(playlist)}
                  sx={{
                    width: 200,
                    height: 280,
                    borderRadius: 2,
                    background: alpha("#fff", 0.05),
                    p: 2,
                    mb: 2,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      background: alpha("#fff", 0.08),
                      "& .play-button": {
                        opacity: 1,
                        transform: "translate(-50%, -50%) scale(1)",
                      },
                    },
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <img
                      src={playlist.images?.[0]?.url}
                      alt={playlist.name}
                      style={{
                        width: "100%",
                        aspectRatio: "1",
                        borderRadius: 8,
                        border: `1px solid ${alpha("#fff", 0.1)}`,
                      }}
                    />
                    {/* Source Badge */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        background:
                          playlist.source === "groovr"
                            ? "linear-gradient(45deg, #6366F1 30%, #818CF8 90%)"
                            : alpha("#fff", 0.1),
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        color: "#fff",
                        fontWeight: 500,
                        textTransform: "capitalize",
                        backdropFilter: "blur(4px)",
                        border: `1px solid ${alpha("#fff", 0.1)}`,
                      }}
                    >
                      {playlist.source}
                    </Box>
                    <IconButton
                      className="play-button"
                      size="large"
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%) scale(0.8)",
                        opacity: 0,
                        transition: "all 0.2s ease",
                        bgcolor: alpha("#6366F1", 0.9),
                        "&:hover": {
                          bgcolor: "#6366F1",
                          transform:
                            "translate(-50%, -50%) scale(1.1) !important",
                        },
                      }}
                    >
                      <PlayArrowRounded sx={{ color: "white", fontSize: 30 }} />
                    </IconButton>
                  </Box>
                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: 500,
                      fontSize: "0.95rem",
                      mt: 1,
                      noWrap: true,
                    }}
                  >
                    {playlist.name}
                  </Typography>
                  <Typography
                    sx={{
                      color: alpha("#fff", 0.7),
                      fontSize: "0.85rem",
                      noWrap: true,
                    }}
                  >
                    {playlist.tracks.total} tracks
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography sx={{ color: alpha("#fff", 0.7) }}>
            No playlists found
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default PlaylistsCard;
