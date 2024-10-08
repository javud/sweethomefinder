// src/components/Search.js
import React from "react";
import "../styles/search.scss"; // Import styles for the Search component

function Search() {
  return (
    <div className="search-button">
      <input
        type="text"
        placeholder="Search"
        className="search-input"
      />
      <span className="search-icon">🔍</span>
    </div>
  );
}

export default Search;
