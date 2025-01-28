const getSpotifyToken = async (req) => {
  // In a real application, you might want to check if the token is expired
  // and refresh it if necessary
  const token = req.session.access_token;

  if (!token) {
    throw new Error("No access token found");
  }

  return token;
};

module.exports = { getSpotifyToken };
