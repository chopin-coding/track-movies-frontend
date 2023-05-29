import "./styles.css";
import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NavBar } from "./navBar.jsx";
import { Search } from "./searchPage.jsx";

export default function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/search-movies" element={<Search />} />
        </Routes>
      </div>
    </Router>
  );
}
