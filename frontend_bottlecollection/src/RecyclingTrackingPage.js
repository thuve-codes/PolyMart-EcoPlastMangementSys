import React, { useState, useEffect } from 'react';
import './RecyclingTrackingPage.css';

// Dummy data for demonstration
const dummyPickupRequests = [
  { id: 1, status: 'Scheduled', time: '2025-03-25 14:00', recycler: 'John Doe' },
  { id: 2, status: 'In Progress', time: '2025-03-25 15:00', recycler: 'Jane Smith' },
  { id: 3, status: 'Completed', time: '2025-03-24 10:30', recycler: 'John Doe' },
];

const dummyRecyclingHistory = [
  { id: 1, date: '2025-03-23', weight: '10kg', material: 'Plastic', user: 'John Doe' },
  { id: 2, date: '2025-03-20', weight: '5kg', material: 'Glass', user: 'Jane Smith' },
  { id: 3, date: '2025-03-18', weight: '15kg', material: 'Paper', user: 'John Doe' },
];

const RecyclingTrackingPage = ({ userName }) => {
  const [pickupRequests, setPickupRequests] = useState(dummyPickupRequests);

  // Filter pickup requests based on the user
  const userPickupRequests = pickupRequests.filter(request => request.recycler === userName);

  // Filter recycling history based on the user
  const userRecyclingHistory = dummyRecyclingHistory.filter(history => history.user === userName);

  // Simulating real-time tracking updates for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedRequests = userPickupRequests.map(request => {
        if (request.status === 'Scheduled') {
          return { ...request, status: 'In Progress' };
        } else if (request.status === 'In Progress') {
          return { ...request, status: 'Completed' };
        }
        return request;
      });
      setPickupRequests(updatedRequests);
    }, 5000); // Update every 5 seconds for demo purposes

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [userPickupRequests]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Recycling Pickup Tracking & History</h1>

      {/* Real-Time Tracking Section */}
      <section>
        <h2>Real-Time Pickup Tracking</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Scheduled Time</th>
              <th>Status</th>
              <th>Recycler</th>
            </tr>
          </thead>
          <tbody>
            {userPickupRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.time}</td>
                <td>{request.status}</td>
                <td>{request.recycler}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>Pickup status is updated in real-time. Please refresh the page or wait for updates.</p>
      </section>

      {/* Recycling History Section */}
      <section>
        <h2>Your Recycling History</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Weight</th>
              <th>Material</th>
            </tr>
          </thead>
          <tbody>
            {userRecyclingHistory.map((history) => (
              <tr key={history.id}>
                <td>{history.id}</td>
                <td>{history.date}</td>
                <td>{history.weight}</td>
                <td>{history.material}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>Here’s a summary of all your past recycling contributions.</p>
      </section>
    </div>
  );
};

export default RecyclingTrackingPage;
