import { useState, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { getUserStats } from "../services/spotifyApi";

// Import our new components
import GenreCard from "./stats/GenreCard";
import RecentlyPlayedCard from "./stats/RecentlyPlayedCard";
import TopArtistsCard from "./stats/TopArtistsCard";
import ListeningTimeCard from "./stats/ListeningTimeCard";
import StatsModal from "./stats/StatsModal";

function StatsSection() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    data: [],
    type: "",
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getUserStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (type) => {
    let title = "";
    let data = [];

    switch (type) {
      case "genres":
        title = "Your Top Genres";
        data = stats.topGenres;
        break;
      case "artists":
        title = "Your Top Artists";
        data = stats.topArtists;
        break;
      case "tracks":
        title = "Recently Played";
        data = stats.recentlyPlayed;
        break;
      default:
        return;
    }

    setModalContent({ title, data, type });
    setModalOpen(true);
  };

  return (
    <Box
      sx={{
        py: 4,
        px: { xs: 2, sm: 4 },
        background:
          "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 600,
          color: "#fff",
          textShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      >
        Your Listening Stats
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <GenreCard
            genres={stats?.topGenres || []}
            isLoading={isLoading}
            onClick={() => handleCardClick("genres")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <RecentlyPlayedCard
            tracks={stats?.recentlyPlayed || []}
            isLoading={isLoading}
            onClick={() => handleCardClick("tracks")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TopArtistsCard
            artists={stats?.topArtists || []}
            isLoading={isLoading}
            onClick={() => handleCardClick("artists")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ListeningTimeCard
            time={stats?.listeningTime || "0h"}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>

      <StatsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent.title}
        data={modalContent.data}
        type={modalContent.type}
      />
    </Box>
  );
}

export default StatsSection;
