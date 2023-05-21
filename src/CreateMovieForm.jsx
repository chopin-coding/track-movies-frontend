import { useState } from 'react'
import { createMovie } from "./movieAPI.jsx"

export default function CreateMovieForm () {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [year, setYear] = useState('')
    const [watched, setWatched] = useState(false)

    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value)
    }

    const handleYearChange = (event) => {
        setYear(event.target.value)
    }

    const handleWatchedChange = (event) => {
        setWatched(event.target.checked)
    }

    const movieData = {
        title: title,
        description: description,
        release_year: year,
        watched: watched
    }

    const resetFields = () => {
        setTitle('')
        setDescription('')
        setYear('')
        setWatched(false)
    }

    function handleCreateMovie () {
        return createMovie(movieData)
    }

    return (
        <div className="create-movie-container">
            <label htmlFor="title">Title:</label>
            <input type="text" id="title" value={title} onChange={handleTitleChange} />

            <label htmlFor="description">Description:</label>
            <textarea id="description" value={description} onChange={handleDescriptionChange} />

            <label htmlFor="year">Year:</label>
            <input type="number" id="year" value={year} onChange={handleYearChange} />

            <label htmlFor="watched">Watched:</label>
            <input type="checkbox" id="watched" checked={watched} onChange={handleWatchedChange} />

            <button onClick={resetFields}>Reset fields</button>
            <button onClick={handleCreateMovie}>Create</button>
        </div>
    )
}