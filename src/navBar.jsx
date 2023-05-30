import "./styles.css";
import { Link } from "react-router-dom";

export function NavBar() {
  return (
    <nav>
      <h3>Movie Tracker</h3>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </nav>
  );
}
