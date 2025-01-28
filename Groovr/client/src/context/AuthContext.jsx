import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [spotifyToken, setSpotifyToken] = useState(null);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem("spotify_token");
    if (token) {
      setSpotifyToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const login = () => {
    // We'll implement this later with Spotify OAuth
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("spotify_token");
    setIsAuthenticated(false);
    setSpotifyToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        spotifyToken,
        login,
        logout,
        setSpotifyToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
