import "./styles.css";
import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NavBar } from "./navBar.jsx";
import { Search } from "./searchPage.jsx";
import { About } from "./about.jsx";

export default function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <hr />
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/About" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}
