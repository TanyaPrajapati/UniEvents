import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      
      <section
        style={{
          minHeight: "90vh",
          background:
            "linear-gradient(135deg, #0f172a, #1e293b, #334155)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 20px",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            
            
            <div className="col-md-6">
              <h1
                style={{
                  fontSize: "3.5rem",
                  fontWeight: "700",
                  marginBottom: "20px",
                }}
              >
                Discover Amazing <br />
                Campus Events 
              </h1>

              <p
                style={{
                  fontSize: "1.2rem",
                  color: "#cbd5e1",
                  marginBottom: "30px",
                }}
              >
                Join workshops, fests, hackathons, cultural nights,
                and networking events happening in your university.
              </p>

              <button
                className="btn btn-light me-3 px-4 py-2"
                onClick={() => navigate("/events")}
              >
                Explore Events
              </button>

              <button
                className="btn btn-outline-light px-4 py-2"
                onClick={() => navigate("/register")}
              >
                Get Started
              </button>
            </div>

            <div className="col-md-6 text-center mt-4 mt-md-0">
              <img
                src="/images/home.png"
                alt="events"
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  borderRadius: "20px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      
      <section className="container py-5">
        <h2 className="text-center mb-5 fw-bold">
          Why Choose UniEvents?
        </h2>

        <div className="row">
          <div className="col-md-4 mb-4">
            <div
              className="card shadow border-0 h-100"
              style={{ borderRadius: "20px" }}
            >
              <div className="card-body text-center p-4">
                <h3>🎯</h3>
                <h5>Easy Registration</h5>
                <p className="text-muted">
                  Register for any event in just one click.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div
              className="card shadow border-0 h-100"
              style={{ borderRadius: "20px" }}
            >
              <div className="card-body text-center p-4">
                <h3>📅</h3>
                <h5>Track Events</h5>
                <p className="text-muted">
                  Never miss deadlines and important dates.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div
              className="card shadow border-0 h-100"
              style={{ borderRadius: "20px" }}
            >
              <div className="card-body text-center p-4">
                <h3>🚀</h3>
                <h5>Grow Network</h5>
                <p className="text-muted">
                  Connect with students, faculty, and speakers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

     
      <section
        style={{
          background: "#0f172a",
          color: "white",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h2 className="fw-bold mb-3">
          Ready to Join the Next Big Event?
        </h2>

        <button
          className="btn btn-light px-4 py-2"
          onClick={() => navigate("/events")}
        >
          Explore Now
        </button>
      </section>
    </div>
  );
}

export default Home;