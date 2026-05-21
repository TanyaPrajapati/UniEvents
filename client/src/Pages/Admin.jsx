import { useEffect, useState } from "react";


function Admin() {
  const [events, setEvents] = useState([]);

  const fetchEvents = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/register-user`)
      .then((res) => res.json())
      .then((data) => setEvents(data));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const deleteEvent = async (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    await fetch(`${process.env.REACT_APP_API_URL}/api/events/${id}`, {
      method: "DELETE",
    });

    setEvents(events.filter((e) => e._id !== id));
  };

  const exportCSV = async (eventId) => {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/admin/event/${eventId}/registrations`
    );

    const data = await res.json();

    const csv = [
      ["Name", "Email"],
      ...data.map((r) => [r.name, r.email]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "participants.csv";
    a.click();
  };

  return (
    <div className="admin-page">
      <div className="container py-5">
        <h2 className="dashboard-title">Admin Dashboard</h2>

        <div className="row">
          {events.map((e) => (
            <div key={e._id} className="col-md-6 col-lg-4 mb-4">
              <div className="dashboard-card">
                <h4>{e.title}</h4>

                <p className="attendees-text">
                  👥 {e.attendees} / {e.maxAttendees}
                </p>

                <button
                  className="btn dashboard-btn view-btn"
                  onClick={() =>
                    (window.location.href = `/admin/event/${e._id}`)
                  }
                >
                  View Participants
                </button>

                <button
                  className="btn dashboard-btn export-btn"
                  onClick={() => exportCSV(e._id)}
                >
                  Export Participants
                </button>

                <button
                  className="btn dashboard-btn delete-btn"
                  onClick={() => deleteEvent(e._id)}
                >
                  Delete Event
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;