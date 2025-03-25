import { useState } from "react";
import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  // Function to send a notification
  const sendNotification = (message) => {
    setNotifications((prevNotifications) => [...prevNotifications, message]);
  };

  return (
    <div className="notification-container">
      <h1>Notifications</h1>

      <button onClick={() => sendNotification("Your collection request has been accepted!")}>
        Notify: Request Accepted
      </button>

      <button onClick={() => sendNotification("Your collection has been completed!")}>
        Notify: Collection Completed
      </button>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <p>No new notifications</p>
        ) : (
          notifications.map((note, index) => <div key={index} className="notification-item">{note}</div>)
        )}
      </div>
    </div>
  );
}

export default Notifications;
