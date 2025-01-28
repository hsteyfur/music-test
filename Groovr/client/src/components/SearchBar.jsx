import { useState } from "react";
import { Paper, InputBase, IconButton, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: 600,
        mx: "auto",
        "&:hover": {
          background: "rgba(255, 255, 255, 0.15)",
        },
      }}
    >
      <InputBase
        sx={{
          ml: 1,
          flex: 1,
          color: "white",
          "& input::placeholder": {
            color: "rgba(255, 255, 255, 0.5)",
          },
        }}
        placeholder="Search for a song..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <IconButton type="submit" sx={{ p: "10px", color: "white" }}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

export default SearchBar;
