import { useEffect, useState } from "react";
import { Box, Grid, Container } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { getUserProfile, getUserPlaylists } from "../services/spotifyApi";
import Header from "../components/Header";
import StatsSection from "../components/StatsSection";
import PlaylistsCard from "../components/stats/PlaylistsCard";
import { Navigate } from "react-router-dom";

const Discover = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;

      try {
        const [userData, playlistsData] = await Promise.all([
          getUserProfile(),
          getUserPlaylists(),
        ]);
        setUser(userData);
        setPlaylists(playlistsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoadingPlaylists(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #0A0A0A 0%, #1A1A1A 100%)",
        color: "white",
      }}
    >
      <Header user={user} />
      <Container maxWidth="xl" sx={{ pt: 10 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StatsSection />
          </Grid>
          <Grid item xs={12}>
            <PlaylistsCard
              playlists={playlists}
              isLoading={isLoadingPlaylists}
              onClick={() => {
                /* Handle click to show all playlists */
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Discover;
