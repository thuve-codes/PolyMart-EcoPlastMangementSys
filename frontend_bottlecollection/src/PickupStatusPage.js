import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PickupStatusPage.css';

const PickupStatusPage = () => {
  const [pickupRequests, setPickupRequests] = useState([]);
  const [userNotifications, setUserNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading spinner control

  // Fetch pickup requests from server
  useEffect(() => {
    const fetchPickupRequests = async () => {
      try {
        setIsLoading(true); // Start loading

        // Get the logged-in user's email (assuming it's stored in localStorage)
        const userEmail = localStorage.getItem('userEmail');  // or sessionStorage, depending on your setup

        if (!userEmail) {
          console.log('User is not logged in!');
          window.location.href = '/login'; // Redirect to login page if email is missing
          return;
        }

        // Fetch pickup requests using the logged-in user's email
        const response = await axios.get('http://localhost:5002/api/status/pickup-requests', {
          params: {
            email: userEmail,  // Pass the email as a query parameter
          },
        });

        // Sort pickup requests by pickupDate (newest first)
        const sortedPickups = response.data.sort((a, b) => new Date(b.pickupDate) - new Date(a.pickupDate));
        setPickupRequests(sortedPickups);

        // Create notifications based on pickup data
        const notifications = sortedPickups.map((request) => ({
          id: request._id,
          message: `Pickup request at ${request.address} for ${request.bottleType} created on ${new Date(request.createdAt).toLocaleString()}`,
          type: request.status === 'Available' ? 'pending' : 'scheduled',
        }));
        setUserNotifications(notifications);
      } catch (error) {
        console.error('Error fetching pickup requests:', error);
      } finally {
        setIsLoading(false); // Done loading
      }
    };

    fetchPickupRequests();
  }, []);

  // Handle notification click (remove on click)
  const handleNotificationClick = (id) => {
    const updatedNotifications = userNotifications.filter(notification => notification.id !== id);
    setUserNotifications(updatedNotifications);
  };

  return (
    <div className="pickup-status-page">
      <h1>Pickup Request Status & Notifications</h1>

      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
          {/* Pickup Requests Table */}
          <section>
            <h2>Current Pickup Requests</h2>
            <table className="pickup-requests-table">
              <thead>
                <tr>
                  <th>Tracking ID</th>
                  <th>Location</th>
                  <th>Material</th>
                  <th>Weight</th>
                  <th>Status</th>
                  <th>Created Time</th> {/* Updated column name */}
                </tr>
              </thead>
              <tbody>
                {pickupRequests.map((request) => (
                  <tr key={request._id} className={`status-${request.status?.toLowerCase()}`}>
                    <td>{request._id}</td>
                    <td>{request.address}</td>
                    <td>{request.bottleType}</td>
                    <td>{request.weight}kg</td>
                    <td>{request.status}</td>
                    <td>{new Date(request.createdAt).toLocaleString()}</td> {/* Display createdAt */}
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
                  <p>{notification.message}</p> {/* Updated notification message */}
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default PickupStatusPage;
