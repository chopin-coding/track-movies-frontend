import React, { useEffect, useState } from "react";
import { getByFields } from "./movieAPI";
import { Table } from "./movieTable";

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
    handleSearch();
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      let results = [];
      let total = 0;

      if (searchType === "fields") {
        const skip = (currentPage - 1) * resultsPerPage;
        results = await getByFields(
          titleValue,
          releaseYearValue,
          watchedValue,
          skip,
          resultsPerPage
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
  }, [currentPage, resultsPerPage]);

  function SearchByFieldsComponent() {
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
  }

  function SearchByIDComponent() {
    return (
      <div>
        <label>
          ID
          <input type="text" value={idValue} onChange={handleIdValueChange} />
        </label>
      </div>
    );
  }

  function PaginationComponent() {
    return (
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange("prev")}
        >
          Previous
        </button>
        <span>Current Page {currentPage}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange("next")}
        >
          Next
        </button>
        <span>Total Pages {totalPages}</span>
      </div>
    );
  }

  function SearchTypeSelectionComponent() {
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

        {searchType === "fields" && <SearchByFieldsComponent />}

        {searchType === "id" && <SearchByIDComponent />}
      </div>
    );
  }

  function ResultsPerPageRender() {
    return (
      <div className="results-per-page">
        <label>
          Results per page:
          <select value={resultsPerPage} onChange={handleResultsPerPageChange}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>
    );
  }

  return (
    <div className="container">
      <div>
        <SearchTypeSelectionComponent />
        <button onClick={handleSearch}>Search</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Table data={searchResults} />
          <PaginationComponent />
          <ResultsPerPageRender />
        </>
      )}
    </div>
  );
}
