import React, { useState } from "react";
import { useTable } from "react-table";
import { PropTypes } from "prop-types";

export function Table({ data, onPageChange, pageCount }) {
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();

  const handleResultsPerPageChange = (event) => {
    const perPage = Number(event.target.value);
    setResultsPerPage(perPage);
    setCurrentPage(1);
    onPageChange(1, perPage); // Trigger API call with new pagination parameters
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      onPageChange(prevPage, resultsPerPage); // Trigger API call with new pagination parameters
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    onPageChange(currentPage + 1, resultsPerPage); // Trigger API call with new pagination parameters
  };

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
      },
      {
        Header: "ID",
        accessor: "id",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div className="container">
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
      <div className="container">
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
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={handlePreviousPage}>
          Previous
        </button>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
}

Table.propTypes = {
  data: PropTypes.array.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
