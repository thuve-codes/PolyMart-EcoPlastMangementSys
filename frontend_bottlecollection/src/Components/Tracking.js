import { useState, useEffect } from "react";
import "./Tracking.css";

function Tracking() {
  const [bottleId, setBottleId] = useState(""); // Bottle ID input state
  const [status, setStatus] = useState(""); // Initially leave status empty
  const [bottleData, setBottleData] = useState(null); // Store fetched bottle data
  const statuses = ["Picked Up", "Completed"]; // Status stages
  const statusIndex = statuses.indexOf(status); // Determine the current status index

  // Use useEffect to fetch bottle data when bottleId changes
  useEffect(() => {
    if (!bottleId) return; // Don't fetch if bottleId is empty

    const fetchBottleData = async () => {
      try {
        const response = await fetch(`http://localhost:5002/api/pickups/${bottleId}`);
        if (response.ok) {
          const data = await response.json();
          setBottleData(data);
          setStatus(data.status); // Set the status from the fetched bottle data
        } else {
          console.error("Bottle not found");
        }
      } catch (error) {
        console.error("Error fetching bottle data:", error);
      }
    };

    fetchBottleData(); // Call the function to fetch the data
  }, [bottleId]); // Dependency on bottleId to trigger the effect

  // Update the bottle's status in the database
  const updateStatus = async () => {
    if (status === "Completed") return; // Don't update if already completed

    const newStatus = statuses[statusIndex + 1] || "Completed"; // Get the next status

    try {
      const response = await fetch(`http://localhost:5002/api/pickups/${bottleId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }), // Send the new status to the backend
      });

      if (response.ok) {
        setStatus(newStatus); // Update status in the component
        setBottleData((prevData) => ({ ...prevData, status: newStatus })); // Update the status in the frontend
      } else {
        console.error("Error updating status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="tracking-container">
      <h3>Pickup Tracking</h3>

      {/* Input field to paste the bottleId */}
      <input
        type="text"
        placeholder="Enter Bottle ID"
        value={bottleId}
        onChange={(e) => setBottleId(e.target.value)} // Update bottleId on change
      />
      <button onClick={() => setBottleId(bottleId)}>Fetch Bottle Data</button>

      {/* Display bottle data if available */}
      {bottleData && (
        <div className="bottle-details">
          <p><strong>Name:</strong> {bottleData.name}</p>
          <p><strong>Status:</strong> {bottleData.status}</p>
          {/* Additional fields like contact, address, etc. can be displayed here */}
        </div>
      )}

      {/* Display the progress bar showing status stages */}
      <div className="progress-bar">
        {statuses.map((stage, index) => (
          <div
            key={index}
            className={`progress-step ${index <= statusIndex ? "active" : ""}`}
          >
            {stage}
          </div>
        ))}
      </div>

      <button
        onClick={updateStatus}
        disabled={status === "Completed" || !bottleId || !bottleData} // Disable if already completed or bottle not fetched
      >
        Update Status
      </button>
    </div>
  );
}

export default Tracking;
