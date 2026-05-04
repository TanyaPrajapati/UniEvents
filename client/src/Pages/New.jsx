import { useState } from "react";
import { useNavigate } from "react-router-dom";

function New() {
  const navigate = useNavigate();

  const [event, setEvent] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    deadline: "",
    price: "",
    maxAttendees: "",
    location: "",
    image: null,
  });

  const generateDescription = async () => {
    try {
      console.log("SENDING:", event);

      const res = await fetch(
        "http://localhost:3000/api/generate-description",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: event.title,
            category: event.category,
            location: event.location,
            date: event.date,
          }),
        },
      );

      const data = await res.json();

      console.log("AI DATA:", data);

      setEvent((prev) => ({
        ...prev,
        description: data.description,
      }));
    } catch (err) {
      console.log("FRONTEND ERROR:", err);
      alert("AI generation failed ");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setEvent({ ...event, image: files[0] });
    } else {
      setEvent({ ...event, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let key in event) {
      formData.append(key, event[key]);
    }

    try {
      const res = await fetch("http://localhost:3000/api/events", {
        method: "POST",
        body: formData, 
      });

      const data = await res.json();

      if (data.message === "Event Created") {
        alert("Event Created ");
        navigate("/events");
      } else {
        alert("Error creating event ");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong ");
    }
  };
  return (
    <div className="create-event-wrapper">
      <div className="form-card">
        <h3>Create a New Event</h3>

        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Event Title"
            onChange={handleChange}
            required
          />
          <textarea
            className="form-control"
            rows="4"
            value={event.description}
            onChange={(e) =>
              setEvent({
                ...event,
                description: e.target.value,
              })
            }
          />
          <button
            type="button mb-2"
            className="btn btn-info"
            onClick={generateDescription}
          >
            Generate Description with AI 
          </button> 
          <input
            name="category"
            placeholder="Category"
            onChange={handleChange}
            required
          />

          <label style={{ color: "white" }}>Event Day</label>
          <input type="date" name="date" onChange={handleChange} required />

          <label style={{ color: "white" }}>Registration Deadline</label>
          <input type="date" name="deadline" onChange={handleChange} required />

          <input
            type="number"
            name="price"
            placeholder="Price ₹"
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="maxAttendees"
            placeholder="Total Seats"
            onChange={handleChange}
          />
          <input
            type="file"
            style={{ border: "solid white", background: "white" }}
            name="image"
            onChange={handleChange}
            required
          />

          <input
            name="location"
            placeholder="Location"
            onChange={handleChange}
            required
          />

          <button type="submit">Add Event</button>
        </form>
      </div>
    </div>
  );
}

export default New;
