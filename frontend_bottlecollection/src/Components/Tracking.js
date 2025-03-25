import { useState } from "react";
import "./Tracking.css";

function Tracking() {
  const [status, setStatus] = useState("Pending");
  const statuses = ["Pending", "Scheduled", "Picked Up", "Completed"];
  const statusIndex = statuses.indexOf(status);

  return (
    <div className="tracking-container">
      <h3>Pickup Tracking</h3>
      <div className="progress-bar">
        {statuses.map((stage, index) => (
          <div key={index} className={`progress-step ${index <= statusIndex ? "active" : ""}`}>
            {stage}
          </div>
        ))}
      </div>
      <button onClick={() => setStatus(statuses[statusIndex + 1] || "Completed")} disabled={status === "Completed"}>
        Update Status
      </button>
    </div>
  );
}

export default Tracking;
