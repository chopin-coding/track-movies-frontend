import React, { useState, useEffect } from "react";
import { getByFields } from "./movieAPI";
import { Table } from "./movieTable";
import { PropTypes } from "prop-types";

export function Search() {
  const [searchType, setSearchType] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [titleValue, setTitleValue] = useState("");
  const [releaseYearValue, setReleaseYearValue] = useState("");
  const [watchedValue, setWatchedValue] = useState("");
  const [idValue, setIdValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleTitleValueChange = (event) => {
    setTitleValue(event.target.value);
  };

  const handleReleaseYearValueChange = (event) => {
    setReleaseYearValue(event.target.value);
  };

  const handleWatchedValueChange = (event) => {
    setWatchedValue(event.target.value);
  };

  const handleIdValueChange = (event) => {
    setIdValue(event.target.value);
  };

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const handleResultsPerPageChange = (event) => {
    const perPage = Number(event.target.value);
    setResultsPerPage(perPage);
    setCurrentPage(1);
  };

  const handlePageChange = (direction) => {
    let nextPage = currentPage;
    if (direction === "prev" && currentPage > 1) {
      nextPage = currentPage - 1;
    } else if (direction === "next" && currentPage < totalPages) {
      nextPage = currentPage + 1;
    }
    setCurrentPage(nextPage);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      let results = [];
      let total = 0;

      if (searchType === "fields") {
        const skip = (currentPage - 1) * resultsPerPage;
        const limit = resultsPerPage;
        results = await getByFields(
          titleValue,
          releaseYearValue,
          watchedValue,
          skip,
          limit
        );
        total = results.count;
        results = results.movies;
      } else if (searchType === "id") {
        // Handle search by ID
      }

      setSearchResults(results);
      setTotalPages(Math.ceil(total / resultsPerPage));
      setLoading(false);
    } catch (error) {
      console.error("Error occurred during search:", error);
      setSearchResults([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [currentPage, resultsPerPage]); // Trigger search when page or resultsPerPage changes

  const searchByFields = () => {
    return (
      <div>
        <label>
          Title
          <input
            type="text"
            value={titleValue}
            onChange={handleTitleValueChange}
          />
        </label>
        <label>
          Year
          <input
            type="text"
            value={releaseYearValue}
            onChange={handleReleaseYearValueChange}
          />
        </label>
        <label>
          Watched?
          <select value={watchedValue} onChange={handleWatchedValueChange}>
            <option value="">Select</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </label>
      </div>
    );
  };

  const searchByID = () => {
    return (
      <div>
        <label>
          ID
          <input type="text" value={idValue} onChange={handleIdValueChange} />
        </label>
      </div>
    );
  };

  const searchTypeSelection = () => {
    return (
      <div>
        <label htmlFor="search-type">Search by:</label>
        <select
          id="search-type"
          value={searchType}
          onChange={handleSearchTypeChange}
        >
          <option value="">Select</option>
          <option value="fields">Fields</option>
          <option value="id">ID</option>
        </select>

        {searchType === "fields" && searchByFields()}

        {searchType === "id" && searchByID()}
      </div>
    );
  };

  return (
    <div className="container">
      <div>
        {searchTypeSelection()}
        <button onClick={handleSearch}>Search</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Table data={searchResults} onPageChange={handlePageChange} />
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
            <span>{currentPage}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
          <div className="results-per-page">
            <label>
              Results per page:
              <select
                value={resultsPerPage}
                onChange={handleResultsPerPageChange}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </label>
          </div>
        </>
      )}
    </div>
  );
}
