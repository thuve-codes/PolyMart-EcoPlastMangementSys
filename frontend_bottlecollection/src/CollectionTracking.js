import { useState } from "react";
import "./CollectionTracking.css";

// Dummy Data for Agents & Requests
const agents = [
  { id: 1, name: "Agent John", location: "Downtown" },
  { id: 2, name: "Agent Sarah", location: "Uptown" },
  { id: 3, name: "Agent Mike", location: "Suburbs" }
];

const initialRequests = [
  { id: 101, user: "Alice", location: "Downtown", status: "Requested", assignedAgent: null },
  { id: 102, user: "Bob", location: "Uptown", status: "Requested", assignedAgent: null },
  { id: 103, user: "Charlie", location: "Suburbs", status: "Requested", assignedAgent: null }
];

function CollectionTracking() {
  const [requests, setRequests] = useState(initialRequests);

  // Function to assign the nearest agent
  const assignAgent = (requestId) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) => {
        if (req.id === requestId && !req.assignedAgent) {
          // Find an available agent in the same location
          const nearestAgent = agents.find((agent) => agent.location === req.location);
          if (nearestAgent) {
            return { ...req, assignedAgent: nearestAgent.name, status: "Assigned" };
          }
        }
        return req;
      })
    );
  };

  // Function to update request status
  const updateStatus = (requestId) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) => {
        if (req.id === requestId) {
          if (req.status === "Assigned") return { ...req, status: "Out for Pickup" };
          if (req.status === "Out for Pickup") return { ...req, status: "Completed" };
        }
        return req;
      })
    );
  };

  return (
    <div className="tracking-container">
      <h1>Collection Requests</h1>

      <table className="tracking-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Location</th>
            <th>Assigned Agent</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td>{req.user}</td>
              <td>{req.location}</td>
              <td>{req.assignedAgent || "Not Assigned"}</td>
              <td>{req.status}</td>
              <td>
                {!req.assignedAgent && (
                  <button className="assign-btn" onClick={() => assignAgent(req.id)}>
                    Assign Agent
                  </button>
                )}
                {req.assignedAgent && req.status !== "Completed" && (
                  <button className="update-btn" onClick={() => updateStatus(req.id)}>
                    Update Status
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CollectionTracking;
