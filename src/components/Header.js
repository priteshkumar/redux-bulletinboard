import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="Header">
      <h1>Redux blog</h1>
      <nav>
        <ul>
          <li>
            <Link to="/" className="navlink">Home</Link>
          </li>
          <li>
            <Link to="post" className="navlink">Post</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
