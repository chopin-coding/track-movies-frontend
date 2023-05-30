import React from "react";
import { useTable } from "react-table";
import { PropTypes } from "prop-types";

export function Table({ data, onDelete }) {
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
          <button onClick={() => handleDelete(row)}>Delete</button>
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

  return (
    <div className="container">
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
    </div>
  );
}

Table.propTypes = {
  data: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
};
