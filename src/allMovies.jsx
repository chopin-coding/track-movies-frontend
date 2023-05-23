import { useEffect, useState } from "react"
import { getAll } from "./movieAPI"
import { Table } from "./movieTable.jsx"

export function AllMovies() {
    const [responseData, setResponseData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAllMovies()
    }, [])

    async function getAllMovies() {
        try {
            const data = await getAll()
            setResponseData(data)
            setLoading(false)
        } catch (error) {
            console.error("Error occurred during data fetch:", error)
            setLoading(false)
        }
    }

    function handleRefreshClick() {
        setLoading(true)
        getAllMovies()
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <button onClick={handleRefreshClick}>Refresh</button>
            <Table data={responseData} />
        </div>
    )
}
