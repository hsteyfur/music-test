import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  InputBase,
  alpha,
  Popper,
  Paper,
  Fade,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ExploreIcon from "@mui/icons-material/Explore";
import { useAuth } from "../context/AuthContext";
import { searchTracks } from "../services/spotifyApi";
import debounce from "lodash/debounce";

function Header({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchAnchorEl, setSearchAnchorEl] = useState(null);
  const searchInputRef = useRef(null);

  const isDiscoverPage = location.pathname === "/discover";
  const isMusicMatcherPage = location.pathname === "/musicMatcher";

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async (query) => {
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        setLoading(true);
        const { tracks } = await searchTracks(query);
        setSearchResults(tracks);
        console.log(tracks[0]);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 300)
  ).current;

  useEffect(() => {
    if (searchQuery) {
      setSearchAnchorEl(searchInputRef.current);
      debouncedSearch(searchQuery);
    } else {
      setSearchAnchorEl(null);
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate("/");
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "rgba(10, 10, 10, 0.00)",
        backdropFilter: "blur(20px)",
        pt: 1.5,
      }}
    >
      <Toolbar
        sx={{
          px: { xs: 2, sm: 4 },
          pb: 1.5,
          display: "flex",
          gap: 5,
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 800,
            background: "linear-gradient(90deg, #6366F1 0%, #A855F7 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "'Righteous', cursive",
            cursor: "pointer",
            letterSpacing: "0.5px",
          }}
          onClick={() => navigate("/")}
        >
          GROOVR
        </Typography>

        {/* Search Bar - Only show if not on MusicMatcher page */}
        {!isMusicMatcherPage && (
          <Box
            sx={{
              position: "relative",
              borderRadius: 2,
              backgroundColor: alpha("#fff", 0.05),
              "&:hover": {
                backgroundColor: alpha("#fff", 0.08),
              },
              width: "100%",
              maxWidth: "600px",
              transition: "all 0.2s ease",
            }}
          >
            <Box
              sx={{
                padding: "0 16px",
                height: "100%",
                position: "absolute",
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SearchIcon sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
            </Box>
            <InputBase
              ref={searchInputRef}
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for songs..."
              sx={{
                color: "inherit",
                width: "100%",
                "& .MuiInputBase-input": {
                  padding: "10px 10px 10px 48px",
                  width: "100%",
                  color: "white",
                  fontSize: "0.95rem",
                  "&::placeholder": {
                    color: "rgba(255, 255, 255, 0.5)",
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>
        )}

        {/* Search Results Dropdown */}
        <Popper
          open={
            Boolean(searchAnchorEl) && (loading || searchResults.length > 0)
          }
          anchorEl={searchAnchorEl}
          transition
          placement="bottom-start"
          style={{
            width: searchAnchorEl?.offsetWidth,
            zIndex: 1400,
          }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={200}>
              <Paper
                sx={{
                  mt: 1,
                  background: "rgba(18, 18, 18, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  maxHeight: "400px",
                  overflow: "auto",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "4px",
                  },
                }}
              >
                {loading ? (
                  <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                    <CircularProgress size={24} sx={{ color: "#6366F1" }} />
                  </Box>
                ) : (
                  searchResults.map((track) => (
                    <Box
                      key={track.id}
                      sx={{
                        p: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          background: "rgba(255, 255, 255, 0.05)",
                          "& .play-button": {
                            opacity: 1,
                            transform: "scale(1)",
                          },
                        },
                      }}
                    >
                      <Box sx={{ position: "relative" }}>
                        <img
                          src={track.albumArt}
                          alt={track.name}
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "6px",
                          }}
                        />
                        <IconButton
                          className="play-button"
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%) scale(0.8)",
                            opacity: 0,
                            transition: "all 0.2s ease",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.7)",
                            },
                            padding: "4px",
                          }}
                          size="small"
                        >
                          <PlayArrowRoundedIcon
                            sx={{ color: "white", fontSize: "20px" }}
                          />
                        </IconButton>
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          noWrap
                          sx={{
                            color: "white",
                            fontWeight: 500,
                            fontSize: "0.95rem",
                          }}
                        >
                          {track.name}
                        </Typography>
                        <Typography
                          noWrap
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            fontSize: "0.85rem",
                          }}
                        >
                          {track.artist}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          color: "rgba(255, 255, 255, 0.5)",
                          fontSize: "0.5rem",
                          whiteSpace: "nowrap",
                          background: "rgba(255, 255, 255, 0.1)",
                          padding: "2px 4px",
                          borderRadius: "2px",
                        }}
                      >
                        {track.explicit ? "E" : "C"}
                      </Typography>
                      <Typography
                        sx={{
                          color: "rgba(255, 255, 255, 0.5)",
                          fontSize: "0.85rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatDuration(track.duration_ms)}
                      </Typography>
                    </Box>
                  ))
                )}
              </Paper>
            </Fade>
          )}
        </Popper>

        {/* Navigation Links */}
        {user && (
          <Box
            sx={{
              display: "flex",
              gap: 3,
              marginLeft: "auto",
              marginRight: 2,
            }}
          >
            <Box
              onClick={() => navigate("/discover")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <Typography
                sx={{
                  color: isDiscoverPage ? "#6366F1" : "white",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  opacity: 0.9,
                  display: { xs: "none", md: "block" },
                }}
              >
                Discover
              </Typography>
              <ExploreIcon
                sx={{ color: isDiscoverPage ? "#6366F1" : "white" }}
              />
            </Box>

            <Box
              onClick={() => navigate("/musicMatcher")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <Typography
                sx={{
                  color: isMusicMatcherPage ? "#6366F1" : "white",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  opacity: 0.9,
                  display: { xs: "none", md: "block" },
                }}
              >
                Tailor Playlist
              </Typography>
              <AutoAwesomeIcon
                sx={{ color: isMusicMatcherPage ? "#6366F1" : "white" }}
              />
            </Box>
          </Box>
        )}

        {/* Profile Section */}
        {user && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              background: alpha("#fff", 0.05),
              padding: "6px 16px",
              borderRadius: "100px",
              transition: "all 0.2s ease",
              "&:hover": {
                background: alpha("#fff", 0.08),
              },
            }}
          >
            <Typography
              sx={{
                color: "white",
                fontWeight: 500,
                fontSize: "0.95rem",
                display: { xs: "none", sm: "block" },
              }}
            >
              {user.display_name}
            </Typography>
            <IconButton
              onClick={handleMenu}
              sx={{
                p: 0,
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <Avatar
                alt={user.display_name}
                src={user.images?.[0]?.url}
                sx={{
                  width: 36,
                  height: 36,
                  border: "2px solid #6366F1",
                }}
              />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  background: "rgba(18, 18, 18, 0.95)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "12px",
                  minWidth: 180,
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/profile");
                }}
                sx={{
                  color: "#fff",
                  py: 1.5,
                  px: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                  }}
                />
                <Typography sx={{ fontWeight: 500 }}>Profile</Typography>
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  color: "#fff",
                  py: 1.5,
                  px: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <LogoutIcon sx={{ fontSize: 20, opacity: 0.8 }} />
                <Typography sx={{ fontWeight: 500 }}>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
