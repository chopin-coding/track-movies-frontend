import React, { useState } from "react";
import { getByID, getByTitle } from "./movieAPI";
import { Table } from "./movieTable";

export function Search() {
  const [searchType, setSearchType] = useState("title");
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const handleSearchValueChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearch = async () => {
    try {
      let results = [];
      if (searchType === "title") {
        results = await getByTitle(searchValue);
      } else if (searchType === "id") {
        results = await getByID(searchValue);
      }
      setSearchResults(results);
    } catch (error) {
      console.error("Error occurred during search:", error);
      setSearchResults([]);
    }
  };

  return (
    <div>
      <div>
        <label>
          Search by:
          <select value={searchType} onChange={handleSearchTypeChange}>
            <option value="title">Title</option>
            <option value="id">ID</option>
          </select>
        </label>
        <input
          type="text"
          value={searchValue}
          onChange={handleSearchValueChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <Table data={searchResults} />
    </div>
  );
}
