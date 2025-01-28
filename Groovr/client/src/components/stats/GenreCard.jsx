import { Box, Paper, Typography, Chip, Button, Skeleton } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { keyframes } from "@mui/system";

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const GenreCard = ({ genres = [], isLoading, onClick }) => (
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
        "& .genre-chip": {
          transform: "translateX(5px)",
        },
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
        <ShowChartIcon
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
        Top Genres
      </Typography>
    </Box>

    {isLoading ? (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, flex: 1 }}>
        {[80, 60, 70].map((width, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            width={`${width}%`}
            height={40}
            sx={{
              borderRadius: 2,
              bgcolor: alpha("#fff", 0.1),
              animation: `${shimmer} 2s infinite linear`,
              backgroundImage: `linear-gradient(90deg, 
                ${alpha("#fff", 0.05)} 0%, 
                ${alpha("#fff", 0.1)} 50%, 
                ${alpha("#fff", 0.05)} 100%
              )`,
              backgroundSize: "200% 100%",
            }}
          />
        ))}
      </Box>
    ) : (
      <>
        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 1.5, flex: 1 }}
        >
          {genres.slice(0, 5).map((genre, index) => (
            <Chip
              key={index}
              label={genre
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
              className="genre-chip"
              sx={{
                bgcolor: alpha("#6366F1", 0.1),
                color: "#fff",
                fontSize: "0.95rem",
                height: "44px",
                py: 2.5,
                px: 1,
                fontWeight: 500,
                letterSpacing: "0.3px",
                borderRadius: "6px",
                transition: "all 0.3s ease",
                border: `1px solid ${alpha("#6366F1", 0.2)}`,
                background: `linear-gradient(135deg, ${alpha(
                  "#6366F1",
                  0.1
                )} 0%, ${alpha("#6366F1", 0.2)} 100%)`,
                "& .MuiChip-label": {
                  px: 2,
                  py: 3,
                },
                "&:hover": {
                  bgcolor: alpha("#6366F1", 0.25),
                  transform: "translateX(8px)",
                  boxShadow: `0 4px 12px ${alpha("#6366F1", 0.3)}`,
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: "4px",
                },
              }}
            />
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
          View all genres
        </Button>
      </>
    )}
  </Paper>
);

export default GenreCard;
