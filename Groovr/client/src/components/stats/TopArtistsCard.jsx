import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  Skeleton,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { keyframes } from "@mui/system";

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const TopArtistsCard = ({ artists = [], isLoading, onClick }) => (
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
        background: `linear-gradient(135deg, ${alpha("#fff", 0.05)} 0%, ${alpha(
          "#6366F1",
          0.08
        )} 100%)`,
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
        <FavoriteIcon
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
        Top Artists
      </Typography>
    </Box>

    {isLoading ? (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, flex: 1 }}>
        {[...Array(4)].map((_, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 1.5,
              borderRadius: 2,
            }}
          >
            <Skeleton
              variant="circular"
              width={48}
              height={48}
              sx={{
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
                width="60%"
                sx={{ bgcolor: alpha("#fff", 0.1) }}
              />
              <Skeleton
                variant="text"
                width="40%"
                sx={{ bgcolor: alpha("#fff", 0.1) }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    ) : (
      <>
        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 1.5, flex: 1 }}
        >
          {artists.slice(0, 3).map((artist) => (
            <Box
              key={artist.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1.5,
                borderRadius: 2,
                background: alpha("#6366F1", 0.1),
                border: `1px solid ${alpha("#6366F1", 0.2)}`,
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateX(8px)",
                  background: alpha("#6366F1", 0.15),
                  boxShadow: `0 4px 12px ${alpha("#6366F1", 0.3)}`,
                },
              }}
              onClick={(e) => {
                e.stopPropagation();
                // Handle artist click - show modal
              }}
            >
              <Avatar
                src={artist.images?.[0]?.url}
                alt={artist.name}
                sx={{
                  width: 48,
                  height: 48,
                  border: `2px solid ${alpha("#6366F1", 0.3)}`,
                  boxShadow: `0 0 10px ${alpha("#6366F1", 0.2)}`,
                }}
              />
              <Box>
                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                >
                  {artist.name}
                </Typography>
                <Typography
                  sx={{
                    color: alpha("#fff", 0.7),
                    fontSize: "0.85rem",
                  }}
                >
                  {artist.genres?.slice(0, 2).join(", ")}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
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
          View all artists
        </Button>
      </>
    )}
  </Paper>
);

export default TopArtistsCard;
