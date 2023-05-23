import "./styles.css"
import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AllMovies } from "./allMovies.jsx"
import { NavBar } from "./navBar.jsx"
import { Search } from "./searchPage.jsx"


export default function App() {
    return (
        <Router>
            <div>
                <NavBar />
                <Routes>
                    <Route path="/all-movies" element={<AllMovies />} />
                    <Route path="/search-movies" element={<Search />} />
                </Routes>
            </div>
        </Router>
    )
}


