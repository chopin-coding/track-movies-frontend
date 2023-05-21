import "./styles.css"
import * as React from "react"
import { getAll } from "./movieAPI.jsx"
import { useTable } from "react-table"

export function Table() {
    const [responseData, setResponseData] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        getAll().then((data) => {
            setResponseData(data)
            setLoading(false)
        })
    }, [])

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
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: responseData })

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="Movie Table">
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
                        prepareRow(row)
                        return (
                            <tr key={rowIndex} {...row.getRowProps()}>
                                {row.cells.map((cell, cellIndex) => (
                                    <td key={cellIndex} {...cell.getCellProps()}>
                                        {cell.render("Cell")}
                                    </td>
                                ))}
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
