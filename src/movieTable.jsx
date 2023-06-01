import React, { useState } from "react";
import { useTable } from "react-table";
import { PropTypes } from "prop-types";

export function Table({ data, onDelete, onUpdate, onCreate }) {
  const [selectedMovie, setSelectedMovie] = React.useState(null);
  const [statusMessage, setStatusMessage] = React.useState("");

  const [createMovieDisplay, setCreateMovieDisplay] = React.useState(null);
  const [createStatusMessage, setCreateStatusMessage] = React.useState("");

  const columns = React.useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Year",
        accessor: "release_year",
      },
      {
        Header: "Watched",
        accessor: "watched",
        Cell: ({ value }) => <input type="checkbox" checked={value} readOnly />,
        propTypes: {
          value: PropTypes.bool.isRequired,
        },
      },

      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="button-container">
            <button className="delete-button" onClick={() => handleDelete(row)}>
              🗑
            </button>
            <button
              className="edit-button"
              onClick={() => handleUpdateButton(row)}
            >
              🖉
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const handleDelete = (row) => {
    const { id } = row.original;
    if (window.confirm(`Delete movie ${id}?`)) {
      onDelete(id);
    }
  };

  const handleUpdateButton = (row) => {
    const { id, title, description, release_year, watched } = row.original;
    setStatusMessage("");
    setSelectedMovie({ id, title, description, release_year, watched });
  };

  const handleNewMovieButton = () => {
    setCreateMovieDisplay("create overlay active");
  };

  const handleCreate = (createParameters) => {
    try {
      onCreate(createParameters)
        .then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              handleCreateStatusMessageChange(`Movie created. ID: ${data.id}`);
            });
          } else if (response.status === 422) {
            response.json().then((validationData) => {
              console.log(validationData.detail[0].msg);
              handleCreateStatusMessageChange("Invalid create parameters.");
            });
          } else {
            throw new Error(
              "Error: " + response.status + " " + response.statusText
            );
          }
        })
        .catch((error) => {
          console.error("Error creating movie: ", error);
        });
    } catch (error) {
      console.log(`Error creating movie: ${error}`);
    }
  };

  const handleSave = (movie) => {
    try {
      const fixedUpdateParameters = {
        id: movie.id,
        title: movie.title,
        description: movie.description,
        release_year: movie.release_year,
        watched: movie.watched,
      };
      onUpdate(fixedUpdateParameters)
        .then((response) => {
          if (response.ok) {
            handleStatusMessageChange("Updated successfully");
          } else if (response.status === 422) {
            response.json().then((validationData) => {
              console.log(validationData.detail[0].msg);
              handleStatusMessageChange("Invalid update parameters.");
            });
          } else if (response.status === 404) {
            response.json().then((validationData) => {
              console.log(validationData.message);
              handleStatusMessageChange(
                "No movies with the given ID was found."
              );
            });
          } else {
            throw new Error(
              "Error: " + response.status + " " + response.statusText
            );
          }
        })
        .catch((error) => {
          console.error("Error updating movie: ", error);
        });
    } catch (error) {
      console.error("Error updating movie:", error);
    }
  };

  const handleCancel = () => {
    setSelectedMovie(null);
  };

  const handleCreateCancel = () => {
    setCreateMovieDisplay(null);
  };

  const handleStatusMessageChange = (message) => {
    setStatusMessage(message);
  };

  const handleCreateStatusMessageChange = (message) => {
    setCreateStatusMessage(message);
  };

  function UpdateOverlay({ movie, onSave, onCancel, statusMessage }) {
    const id = movie.id;
    const [titleValue, setTitleValue] = useState(movie.title);
    const [descriptionValue, setDescriptionValue] = useState(movie.description);
    const [releaseYearValue, setReleaseYearValue] = useState(
      movie.release_year
    );
    const [watchedValue, setWatchedValue] = useState(movie.watched);

    const handleTitleValueChange = (event) => {
      setTitleValue(event.target.value);
    };

    const handleDescriptionChange = (event) => {
      setDescriptionValue(event.target.value);
    };

    const handleReleaseYearValueChange = (event) => {
      const value = event.target.value;
      const intValue = value ? parseInt(value, 10) : null;
      setReleaseYearValue(intValue);
    };

    const handleWatchedValueChange = (event) => {
      const value = event.target.checked;
      setWatchedValue(value);
    };

    return (
      <div className="overlay">
        <div className="overlay-content">
          <h2>Update Movie</h2>
          <label>{statusMessage}</label>
          <div>
            <label htmlFor="update-title">Title:</label>
            <input
              id="update-title"
              type="text"
              defaultValue={titleValue}
              onChange={handleTitleValueChange}
            />
          </div>
          <div>
            <label htmlFor="update-description">Description:</label>
            <input
              id="update-description"
              type="text"
              defaultValue={descriptionValue}
              onChange={handleDescriptionChange}
            />
          </div>
          <div>
            <label htmlFor="update-release_year">Year:</label>
            <input
              id="update-release_year"
              type="text"
              defaultValue={releaseYearValue}
              onChange={handleReleaseYearValueChange}
            />
          </div>
          <div>
            <label htmlFor="update-watched">Watched:</label>
            <input
              id="update-watched"
              type="checkbox"
              checked={watchedValue}
              onChange={handleWatchedValueChange}
            />
          </div>
          <div>
            <label htmlFor="update-id">ID:</label>
            <input id="movie-ID" type="text" defaultValue={id} readOnly />
          </div>
          <div className="action-buttons">
            <button
              onClick={() =>
                onSave({
                  id: id,
                  title: titleValue,
                  description: descriptionValue,
                  release_year: releaseYearValue,
                  watched: watchedValue,
                })
              }
            >
              Update
            </button>
            <button onClick={onCancel}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  function CreateOverlay({ onCreate, onCreateCancel, createStatusMessage }) {
    const [titleValue, setTitleValue] = useState("");
    const [descriptionValue, setDescriptionValue] = useState("");
    const [releaseYearValue, setReleaseYearValue] = useState("");
    const [watchedValue, setWatchedValue] = useState(false);

    const handleTitleValueChange = (event) => {
      setTitleValue(event.target.value);
    };

    const handleDescriptionChange = (event) => {
      setDescriptionValue(event.target.value);
    };

    const handleReleaseYearValueChange = (event) => {
      const value = event.target.value;
      const intValue = value ? parseInt(value, 10) : null;
      setReleaseYearValue(intValue);
    };

    const handleWatchedValueChange = (event) => {
      const value = event.target.checked;
      setWatchedValue(value);
    };

    return (
      <div className="overlay">
        <div className="overlay-content">
          <h2>Create Movie</h2>
          <label>{createStatusMessage}</label>
          <div>
            <label htmlFor="create-title">Title:</label>
            <input
              id="create-title"
              type="text"
              defaultValue={titleValue}
              onChange={handleTitleValueChange}
            />
          </div>
          <div>
            <label htmlFor="create-description">Description:</label>
            <input
              id="create-description"
              type="text"
              defaultValue={descriptionValue}
              onChange={handleDescriptionChange}
            />
          </div>

          <div>
            <label htmlFor="create-release_year">Year:</label>
            <input
              id="create-release_year"
              type="text"
              defaultValue={releaseYearValue}
              onChange={handleReleaseYearValueChange}
            />
          </div>

          <div>
            <label htmlFor="create-watched">Watched:</label>
            <input
              id="create-watched"
              type="checkbox"
              checked={watchedValue}
              onChange={handleWatchedValueChange}
            />
          </div>

          <div>
            <button
              onClick={() =>
                onCreate({
                  title: titleValue,
                  description: descriptionValue,
                  release_year: releaseYearValue,
                  watched: watchedValue,
                })
              }
            >
              Create
            </button>
            <button onClick={onCreateCancel}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  CreateOverlay.propTypes = {
    onCreate: PropTypes.func.isRequired,
    onCreateCancel: PropTypes.func.isRequired,
    createStatusMessage: PropTypes.string.isRequired,
  };

  UpdateOverlay.propTypes = {
    movie: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    statusMessage: PropTypes.string.isRequired,
  };

  return (
    <div className="container">
      <div className="new-movie-button">
        <button onClick={handleNewMovieButton}>New Movie</button>
      </div>
      <div>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, columnIndex) => (
                  <th key={columnIndex} {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <tr key={rowIndex} {...row.getRowProps()}>
                  {row.cells.map((cell, cellIndex) => (
                    <td key={cellIndex} {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedMovie && (
        <UpdateOverlay
          movie={selectedMovie}
          onSave={handleSave}
          onCancel={handleCancel}
          statusMessage={statusMessage}
        />
      )}
      {createMovieDisplay && (
        <CreateOverlay
          onCreate={handleCreate}
          onCreateCancel={handleCreateCancel}
          createStatusMessage={createStatusMessage}
        />
      )}
    </div>
  );
}

Table.propTypes = {
  data: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};
