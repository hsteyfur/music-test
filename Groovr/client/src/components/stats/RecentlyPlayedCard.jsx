import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  Skeleton,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import { keyframes } from "@mui/system";

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const RecentlyPlayedCard = ({ tracks = [], isLoading, onClick }) => {
  // Ensure tracks is an array
  const trackList = Array.isArray(tracks) ? tracks : [];

  return (
    <Paper
      elevation={0}
      onClick={onClick}
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
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${alpha("#fff", 0.05)}`,
        "&:hover": {
          transform: "translateY(-4px)",
          background: `linear-gradient(135deg, ${alpha(
            "#fff",
            0.05
          )} 0%, ${alpha("#6366F1", 0.08)} 100%)`,
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${alpha(
            "#6366F1",
            0.3
          )}, transparent)`,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2.5 }}>
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
          <AccessTimeIcon
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
          Recently Played
        </Typography>
      </Box>

      {isLoading ? (
        <List sx={{ p: 0, flex: 1 }}>
          {[...Array(3)].map((_, i) => (
            <ListItem key={i} sx={{ px: 0 }}>
              <Skeleton
                variant="rectangular"
                width={40}
                height={40}
                sx={{
                  borderRadius: 1.5,
                  mr: 2,
                  animation: `${shimmer} 2s infinite linear`,
                  backgroundImage: `linear-gradient(90deg, 
                    ${alpha("#fff", 0.05)} 0%, 
                    ${alpha("#fff", 0.1)} 50%, 
                    ${alpha("#fff", 0.05)} 100%
                  )`,
                  backgroundSize: "200% 100%",
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Skeleton
                  variant="text"
                  width="80%"
                  sx={{ bgcolor: alpha("#fff", 0.1) }}
                />
                <Skeleton
                  variant="text"
                  width="60%"
                  sx={{ bgcolor: alpha("#fff", 0.1) }}
                />
              </Box>
            </ListItem>
          ))}
        </List>
      ) : trackList.length > 0 ? (
        <>
          <List sx={{ p: 0, flex: 1 }}>
            {trackList.slice(0, 5).map((track) => (
              <ListItem
                key={track.id}
                sx={{
                  px: 0,
                  py: 1,
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: alpha("#fff", 0.03),
                    transform: "translateX(4px)",
                  },
                  "&:hover .play-button": {
                    opacity: 1,
                    transform: "translate(-50%, -50%) scale(1)",
                  },
                }}
              >
                <Box sx={{ position: "relative", mr: 2 }}>
                  <img
                    src={track.albumArt}
                    alt={track.name}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      border: `1px solid ${alpha("#fff", 0.1)}`,
                    }}
                  />
                  <IconButton
                    className="play-button"
                    size="small"
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
                      padding: "4px",
                    }}
                  >
                    <PlayArrowRounded sx={{ color: "white", fontSize: 20 }} />
                  </IconButton>
                </Box>
                <ListItemText
                  primary={track.name}
                  secondary={track.artist}
                  primaryTypographyProps={{
                    noWrap: true,
                    sx: {
                      color: "#fff",
                      fontWeight: 500,
                      fontSize: "0.95rem",
                    },
                  }}
                  secondaryTypographyProps={{
                    noWrap: true,
                    sx: {
                      color: alpha("#fff", 0.7),
                      fontSize: "0.85rem",
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
          <Button
            variant="text"
            endIcon={
              <MoreHorizIcon
                sx={{
                  transition: "transform 0.3s ease",
                  ".MuiButton-root:hover &": {
                    transform: "translateX(4px)",
                  },
                }}
              />
            }
            sx={{
              color: alpha("#fff", 0.7),
              py: 1,
              mt: "auto",
              fontWeight: 500,
              letterSpacing: "0.5px",
              transition: "all 0.3s ease",
              "&:hover": {
                color: "#fff",
                background: alpha("#fff", 0.05),
                transform: "translateX(4px)",
              },
            }}
          >
            View all tracks
          </Button>
        </>
      ) : (
        <Typography sx={{ color: alpha("#fff", 0.7) }}>
          No recently played tracks
        </Typography>
      )}
    </Paper>
  );
};

export default RecentlyPlayedCard;
