import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../services/spotifyApi";
import Header from "../components/Header";
import StatsSection from "../components/StatsSection";
import { Navigate } from "react-router-dom";

const Discover = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated) return;

      try {
        const userData = await getUserProfile();
        setUser(userData);
      } catch (error) {
        if (error.message === "UNAUTHORIZED") {
          // Handle unauthorized error - maybe redirect to login
          console.error("Session expired");
        } else {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
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
      <Box sx={{ pt: 10 }}>
        <StatsSection />
      </Box>
    </Box>
  );
};

export default Discover;
