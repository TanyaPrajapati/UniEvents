import { Link } from "react-router-dom";
import { useEffect, useState } from "react";


function Navbar() {
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const checkRole = () => {
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", checkRole);

    return () => window.removeEventListener("storage", checkRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setRole(null);
    window.location.href = "/";
  };

  return (
    <nav className="navbar navbar-expand-md custom-navbar sticky-top">
      <div className="container-fluid px-4">

        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="/logo.png"
            alt="logo"
            className="nav-logo"
          />
          
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav ms-auto align-items-center gap-3">

            
            {role === "student" && (
              <>
                <Link className="nav-link custom-link" to="/">
                  Home
                </Link>
                <Link className="nav-link custom-link" to="/events">
                  Explore Events
                </Link>

                <button
                  className="btn logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}

            
            {role === "faculty" && (
              <>
                <Link className="nav-link custom-link" to="/">
                  Home
                </Link>
                <Link className="nav-link custom-link" to="/admin">
                  Dashboard
                </Link>
                <Link className="nav-link custom-link" to="/events/new">
                  Host Event
                </Link>

                <button
                  className="btn logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}

            
            {!role && (
              <>
                <Link className="nav-link custom-link" to="/">
                  Home
                </Link>
                <Link className="nav-link custom-link" to="/events">
                  Explore Events
                </Link>
                <Link className="nav-link custom-link" to="/login">
                  Login
                </Link>
                <Link className="nav-link custom-link" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;