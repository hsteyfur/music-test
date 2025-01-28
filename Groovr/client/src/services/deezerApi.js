import axios from "axios";

export const fetchDeezerPreview = async (trackName, artistName) => {
  try {
    console.log("Fetching preview for:", { trackName, artistName });

    if (!trackName || !artistName) {
      console.error("Missing required parameters:", { trackName, artistName });
      return null;
    }

    // Call the proxy endpoint on your backend
    const response = await axios.get("http://localhost:5001/api/deezer-proxy", {
      params: {
        track: trackName,
        artist: artistName,
      },
    });

    const tracks = response.data.data;
    if (tracks && tracks.length > 0) {
      const previewUrl = tracks[0].preview;
      console.log("Preview URL:", previewUrl);
      return previewUrl;
    } else {
      console.log("No matching tracks found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching Deezer preview:", error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request:", error.message);
    }
    return null;
  }
};
