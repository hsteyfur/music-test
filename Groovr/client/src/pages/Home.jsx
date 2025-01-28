import { Box, Button, Typography, Container, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { loginWithSpotify } from "../services/spotifyApi";
import Logo from "../assets/logo.png";

// Import custom font in your index.css or App.css:
// @import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');

function Home() {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated accent */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "40%",
          height: "100%",
          background:
            "linear-gradient(135deg, transparent, rgba(99, 102, 241, 0.03))",
          filter: "blur(100px)",
        }}
      />

      {/* Logo in top left corner */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: "20px", md: "20px" },
          left: { xs: "20px", md: "20px" },
          zIndex: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: "Righteous, cursive",
            fontSize: { xs: "2rem", md: "2.5rem" },
            background: "linear-gradient(90deg, #6366F1 0%, #A855F7 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.05em",
          }}
        >
          Groovr
        </Typography>
      </Box>

      <Container maxWidth="lg">
        <Grid
          container
          sx={{
            minHeight: "100vh",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "#FFFFFF",
                  mb: 3,
                  lineHeight: 1.1,
                }}
              >
                Discover Your Next
                <br />
                <Box
                  component="span"
                  sx={{
                    background:
                      "linear-gradient(90deg, #6366F1 0%, #A855F7 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Favorite Track
                </Box>
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  maxWidth: "600px",
                  mb: 5,
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                {isAuthenticated
                  ? "Your personalized music journey awaits. Start exploring new tracks tailored to your taste."
                  : "Experience a new way to discover music. Connect with Spotify to unlock your personalized recommendations."}
              </Typography>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {isAuthenticated ? (
                  <Button
                    variant="outlined"
                    onClick={handleLogout}
                    sx={{
                      borderColor: "#EF4444",
                      color: "#EF4444",
                      borderWidth: 2,
                      borderRadius: "12px",
                      px: 4,
                      py: 1.5,
                      fontSize: "1rem",
                      textTransform: "none",
                      fontWeight: 500,
                      "&:hover": {
                        borderColor: "#DC2626",
                        background: "rgba(239, 68, 68, 0.05)",
                        borderWidth: 2,
                      },
                    }}
                  >
                    Logout
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={loginWithSpotify}
                    sx={{
                      background:
                        "linear-gradient(90deg, #6366F1 0%, #A855F7 100%)",
                      borderRadius: "12px",
                      px: 4,
                      py: 1.5,
                      fontSize: "1rem",
                      textTransform: "none",
                      fontWeight: 500,
                      boxShadow: "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #4F46E5 0%, #9333EA 100%)",
                        boxShadow: "0 4px 20px rgba(99, 102, 241, 0.2)",
                        color: "#FFFFFF",
                      },
                    }}
                  >
                    Connect with Spotify
                  </Button>
                )}
              </motion.div>
            </motion.div>
          </Grid>

          {/* Decorative element with vinyl record animation */}
          <Box
            sx={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: "30%",
              height: "70%",
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))",
              borderRadius: "30px",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={Logo}
              sx={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </Box>
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;
