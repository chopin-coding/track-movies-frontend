import React, { useEffect, useState } from "react";
import {
  getByFields,
  deleteByID,
  getByID,
  updateByID,
  createMovie,
} from "./movieAPI";
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
  const [searchFailMessage, setSearchFailMessage] = useState("");

  const handleTitleValueChange = (event) => {
    setTitleValue(event.target.value);
  };

  const handleReleaseYearValueChange = (event) => {
    const value = event.target.value;
    const intValue = value !== "" ? parseInt(value, 10) : null;
    setReleaseYearValue(Number.isNaN(intValue) ? "" : intValue);
  };

  const handleWatchedValueChange = (event) => {
    const value = event.target.checked;
    setWatchedValue(value);
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

  const handleDelete = (id) => {
    const deleteResult = deleteByID(id);
    deleteResult
      ? console.log("Deleted successfully!") // replace with a notification
      : console.log("Delete unsuccessful."); // replace with a notification
  };

  const getSearchParameters = () => {
    const skipValue = (currentPage - 1) * resultsPerPage;
    let filteredValues = {
      title: null,
      release_year: null,
      watched: null,
      skip: skipValue,
      limit: resultsPerPage,
    };

    if (typeof titleValue === "string" && titleValue.length >= 2) {
      filteredValues["title"] = titleValue;
    }

    if (Number.isInteger(releaseYearValue)) {
      filteredValues["release_year"] = releaseYearValue;
    }

    if (typeof watchedValue === "boolean") {
      filteredValues["watched"] = watchedValue;
    }

    return filteredValues;
  };

  const handleUpdate = async (updateParameters) => {
    const id = updateParameters["id"];
    delete updateParameters["id"];
    return await updateByID(id, updateParameters);
  };

  const handleCreate = async (createParameters) => {
    return await createMovie(createParameters);
  };

  const handleIdSearch = async () => {
    if (idValue !== "") {
      try {
        setLoading(true);
        let results = [];
        await getByID(idValue)
          .then((response) => {
            if (response.ok) {
              handleSearchFailMessageChange("");
              return response.json().then((data) => {
                results.push(data);
                setSearchResults(results);
                setLoading(false);
              });
            } else if (response.status === 422) {
              response.json().then((validationData) => {
                console.log(validationData.detail[0].msg);
                handleSearchFailMessageChange(`Please enter a valid ID.`);
              });
            } else if (response.status === 404) {
              response.json().then((validationData) => {
                console.log(validationData.message);
                handleSearchFailMessageChange(
                  "No movies with the given ID was found."
                );
              });
            } else {
              // Handle other error scenarios
              throw new Error("Error: " + response.statusText);
            }
          })
          .catch((error) => {
            console.error("Error fetching all movies: ", error);
          });
        setSearchResults(results);
        setTotalPages(1);
        setLoading(false);
      } catch (error) {
        console.error("Error occurred during search:", error);
        setSearchResults([]);
        setLoading(false);
      }
    } else {
      handleSearchFailMessageChange("Please specify a movie ID.");
    }
  };

  const handleSearchFailMessageChange = (message) => {
    setSearchFailMessage(message);
  };
  const SearchFailMessageComponent = () => {
    return (
      <div className="container">
        <label>{searchFailMessage}</label>
      </div>
    );
  };

  const handleFieldSearch = async () => {
    try {
      setLoading(true);
      let results = [];
      let total = 0;
      await getByFields(getSearchParameters()).then((response) => {
        if (response.ok) {
          handleSearchFailMessageChange("");
          return response.json().then((data) => {
            results = data;
            total = results.count;
            results = results.movies;

            setSearchResults(results);
            setTotalPages(Math.ceil(total / resultsPerPage));
            setLoading(false);
          });
        } else if (response.status === 422) {
          response.json().then((validationData) => {
            setSearchResults([]);
            setLoading(false);
            console.log(validationData.detail[0].msg);
            handleSearchFailMessageChange(
              `${validationData.detail[0].loc[1]}: ${validationData.detail[0].msg}`
            );
          });
        } else if (response.status === 404) {
          response.json().then((validationData) => {
            setSearchResults([]);
            setLoading(false);
            console.log(validationData.message);
            handleSearchFailMessageChange(
              "No movies with the given parameters were found."
            );
          });
        } else {
          throw new Error("Error: " + response.statusText);
        }
      });
    } catch (error) {
      console.error("Error occurred during search:", error);
      setSearchResults([]);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchType === "fields") {
      await handleFieldSearch();
    } else if (searchType === "id") {
      await handleIdSearch();
    }
  };

  useEffect(() => {
    handleSearch();
  }, [currentPage, resultsPerPage]);

  function PaginationComponent() {
    return (
      <div className="container">
        <div>
          <span>Total {totalPages} pages</span>
        </div>
        <div>
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange("prev")}
          >
            〈
          </button>
          <span> {currentPage} </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange("next")}
          >
            〉
          </button>
        </div>
      </div>
    );
  }

  function ResultsPerPageRender() {
    return (
      <div>
        <div>
          <label htmlFor="results-per-page-select">Results per page</label>
          <select
            value={resultsPerPage}
            onChange={handleResultsPerPageChange}
            id="results-per-page-select"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div>
          <button className="search-button" onClick={handleSearch}>
            🔎︎
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div>
        <div className="search-type-selection">
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
        </div>

        {searchType === "fields" && (
          <div className="field-group">
            <div className="field">
              <label htmlFor="title-field">Title</label>
              <input
                type="title-field"
                defaultValue={titleValue}
                onChange={handleTitleValueChange}
                placeholder="Movie title"
              />
            </div>
            <div className="field">
              <label htmlFor="release_year-field">Year</label>
              <input
                type="release_year-field"
                value={releaseYearValue}
                onChange={handleReleaseYearValueChange}
                placeholder="Release year"
              />
            </div>
            <div className="field">
              <label htmlFor="create-watched">Watched</label>
              <input
                id="create-watched"
                type="checkbox"
                checked={watchedValue}
                onChange={handleWatchedValueChange}
              />
            </div>
          </div>
        )}

        {searchType === "id" && (
          <div className="field">
            <label>
              ID
              <input
                type="text"
                value={idValue}
                onChange={handleIdValueChange}
              />
            </label>
          </div>
        )}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ResultsPerPageRender />
          <SearchFailMessageComponent />
          <hr />
          <PaginationComponent />
          <Table
            data={searchResults}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onCreate={handleCreate}
          />
        </>
      )}
    </div>
  );
}
