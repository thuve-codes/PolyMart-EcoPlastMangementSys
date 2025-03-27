import React, { useState, useEffect } from 'react';
import './PickupStatusPage.css';

// Dummy data for pickup requests
const dummyPickupRequests = [
  { id: 1, location: 'Hatton', material: 'Plastic', weight: '20kg', status: 'Pending', time: '2025-03-25 14:00' },
  { id: 2, location: 'Colombo', material: 'Plastic', weight: '15kg', status: 'In Progress', time: '2025-03-25 15:00' },
  { id: 3, location: 'Malabe', material: 'Plastic', weight: '25kg', status: 'Completed', time: '2025-03-24 10:30' },
];

// Dummy notification data
const notifications = [
  { id: 1, message: 'Your pickup request at Hatton has been confirmed. Estimated arrival time: 14:00.', type: 'confirmation' },
  { id: 2, message: 'Pickup in progress at Colombo. Estimated arrival in 15 minutes.', type: 'progress' },
  { id: 3, message: 'Pickup completed at Malabe. Thank you for your contribution!', type: 'completion' },
];

const PickupStatusPage = () => {
  const [pickupRequests, setPickupRequests] = useState(dummyPickupRequests);
  const [userNotifications, setUserNotifications] = useState(notifications);

  // Simulating real-time status updates
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedRequests = pickupRequests.map(request => {
        if (request.status === 'Pending') {
          return { ...request, status: 'In Progress' };
        } else if (request.status === 'In Progress') {
          return { ...request, status: 'Completed' };
        }
        return request;
      });
      setPickupRequests(updatedRequests);
    }, 10000); // Updates every 10 seconds for demo purposes

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [pickupRequests]);

  // Function to handle notifications
  const handleNotificationClick = (id) => {
    const updatedNotifications = userNotifications.filter(notification => notification.id !== id);
    setUserNotifications(updatedNotifications);
  };

  return (
    <div className="pickup-status-page">
      <h1>Pickup Request Status & Notifications</h1>

      {/* Pickup Requests Table */}
      <section>
        <h2>Current Pickup Requests</h2>
        <table className="pickup-requests-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Location</th>
              <th>Material</th>
              <th>Weight</th>
              <th>Status</th>
              <th>Scheduled Time</th>
            </tr>
          </thead>
          <tbody>
            {pickupRequests.map((request) => (
              <tr key={request.id} className={`status-${request.status.toLowerCase()}`}>
                <td>{request.id}</td>
                <td>{request.location}</td>
                <td>{request.material}</td>
                <td>{request.weight}</td>
                <td>{request.status}</td>
                <td>{request.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Notifications Section */}
      <section>
        <h2>Your Notifications</h2>
        <div className="notifications">
          {userNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification ${notification.type}`}
              onClick={() => handleNotificationClick(notification.id)}
            >
              <p>{notification.message}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PickupStatusPage;
