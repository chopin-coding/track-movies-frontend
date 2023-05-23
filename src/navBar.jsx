import "./styles.css"
import { Link } from "react-router-dom"

export function NavBar () {
    return (
        <nav>
            <h3>Movie Tracker v1</h3>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/all-movies">All Movies</Link>
                </li>
                <li>
                    <Link to="/search-movies">Search Movies</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
            </ul>
        </nav>
    )
}