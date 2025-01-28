import { Box, Paper, Typography, Skeleton } from "@mui/material";
import { alpha } from "@mui/material/styles";
import AlbumIcon from "@mui/icons-material/Album";

const ListeningTimeCard = ({ time, isLoading }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      height: "100%",
      background: alpha("#fff", 0.03),
      backdropFilter: "blur(10px)",
      borderRadius: 3,
      transition: "all 0.3s ease",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <AlbumIcon sx={{ color: "#6366F1", fontSize: 28, mr: 1.5 }} />
      <Typography variant="subtitle1" sx={{ color: alpha("#fff", 0.7) }}>
        Listening Time
      </Typography>
    </Box>
    {isLoading ? (
      <Skeleton
        variant="text"
        width="60%"
        height={60}
        sx={{ bgcolor: alpha("#fff", 0.1) }}
      />
    ) : (
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(90deg, #6366F1 0%, #A855F7 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {time}
        </Typography>
        <Typography
          sx={{
            color: alpha("#fff", 0.7),
            mt: 1,
          }}
        >
          hours this month
        </Typography>
      </Box>
    )}
  </Paper>
);

export default ListeningTimeCard;
