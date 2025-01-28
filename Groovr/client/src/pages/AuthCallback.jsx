import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { handleCallback } from "../services/spotifyApi";
import { useAuth } from "../context/AuthContext";

function AuthCallback() {
  const navigate = useNavigate();
  const { setSpotifyToken, login } = useAuth();
  const processedRef = useRef(false);

  useEffect(() => {
    const processCallback = async () => {
      // Prevent multiple processing attempts
      if (processedRef.current) return;
      processedRef.current = true;

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const error = urlParams.get("error");

        if (error) {
          throw new Error(`Spotify authorization error: ${error}`);
        }

        if (!code) {
          throw new Error("No authorization code received from Spotify");
        }

        // Exchange code for token
        const token = await handleCallback(code);

        if (!token) {
          throw new Error("No token received from server");
        }

        // Set token and login
        setSpotifyToken(token);
        login();

        // Clear the URL parameters
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        // Redirect to discover page
        navigate("/discover");
      } catch (error) {
        console.error("Authentication error:", error);
        // Redirect to home page after short delay
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    };

    processCallback();
  }, [navigate, setSpotifyToken, login]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#121212",
      }}
    >
      <CircularProgress
        sx={{
          color: "#6366f1",
          mb: 2,
        }}
      />
      <Typography
        variant="h6"
        sx={{
          color: "white",
          textAlign: "center",
          maxWidth: "400px",
          px: 2,
        }}
      >
        Connecting to Spotify...
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "rgba(255,255,255,0.7)",
          mt: 2,
          textAlign: "center",
          maxWidth: "400px",
          px: 2,
        }}
      >
        If you're not redirected automatically,{" "}
        <Box
          component="span"
          onClick={() => navigate("/")}
          sx={{
            color: "#6366f1",
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          click here
        </Box>{" "}
        to return home.
      </Typography>
    </Box>
  );
}

export default AuthCallback;
