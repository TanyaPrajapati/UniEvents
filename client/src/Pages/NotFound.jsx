import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #111827, #1f2937)",
        color: "white",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "80px", fontWeight: "bold" }}>404</h1>
      <h3>Oops! Page Not Found</h3>
      <p>The page you are looking for does not exist.</p>

      <Link to="/" className="btn btn-primary mt-3">
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;