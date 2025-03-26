import React, { useState } from "react";
import "./notification.css";
import logo from "./assets/images/polymart-logo.png";

function Notification() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Plastic Waste Collection Event",
      time: "1 hour ago",
      message: "You earned 50 points for participating in the event!",
      read: false,
    },
    {
      id: 2,
      title: "Reward Redeemed",
      time: "Yesterday",
      message: "Your 100-point cashback has been processed successfully.",
      read: false,
    },
    {
      id: 3,
      title: "New Eco-Friendly Campaign",
      time: "2 days ago",
      message: "Join our new campaign to reduce plastic waste and earn rewards.",
      read: false,
    },
  ]);

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notif) => notif.id !== id)
    );
  };

  return (
    <div className="notification-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo-container">
          <img src={logo} alt="Polymart Logo" className="logo" />
        </div>
        <ul>
          <li><a href="/">Dashboard</a></li>
          <li><a href="/redeem">Redeem</a></li>
          <li><a href="/leaderboard">Leaderboard</a></li>
          <li><a href="/notifications" className="active">Notifications</a></li>
        </ul>
      </nav>

      {/* Notifications Section */}
      <div className="notification-container">
        <h1>Notifications</h1>
        <ul className="notification-list">
          {notifications.length === 0 ? (
            <p className="no-notifications">No new notifications</p>
          ) : (
            notifications.map((notif) => (
              <li
                key={notif.id}
                className={`notification-item ${notif.read ? "read" : ""}`}
                onClick={() => markAsRead(notif.id)}
              >
                <span className="notification-title">{notif.title}</span>
                <span className="notification-time">{notif.time}</span>
                <p>{notif.message}</p>
                <div className="notification-actions">
                  {!notif.read && (
                    <button 
                      className={`read-btn ${notif.read ? "read" : ""}`} 
                      onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }}
                    >
                      Mark as Read
                    </button>
                  )}
                  <button 
                    className="delete-btn" 
                    onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default Notification;
