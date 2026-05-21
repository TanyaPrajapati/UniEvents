import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function AdminEvent() {
  const { id } = useParams();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/registrations`)
      .then(res => res.json())
      .then(data => setUsers(data));
  }, [id]);

  return (
    <div className="container mt-4">
      <h3>Participants</h3>

      {users.map((u) => (
        <div key={u._id} className="card p-2 mb-2">
          <p>Name: {u.name}</p>
          <p>Email: {u.email}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminEvent;