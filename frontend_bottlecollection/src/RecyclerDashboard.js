import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import './RecyclerDashboard.css';


// Dummy recycler info
const recyclerInfo = {
  name: 'Dhanush',
  capacity: 50,
  email: 'dhanush@example.com',
};


const RecyclerDashboard = () => {
  const { email } = useParams();
  const [pickupRequests, setPickupRequests] = useState([]);
  const [scheduledPickups, setScheduledPickups] = useState([]);
  const [availableCapacity, setAvailableCapacity] = useState(recyclerInfo.capacity);
  const [recyclingHistory, setRecyclingHistory] = useState([]);

  // Fetch the scheduled pickups from the API
  const fetchScheduledPickups = async () => {
    try {
      const response = await fetch('/api/scheduled-pickups'); // Replace with your API endpoint
      const data = await response.json();
      setScheduledPickups(data); // Assume the data returned is an array of scheduled pickups
    } catch (error) {
      console.error('Error fetching scheduled pickups:', error);
    }
  };

  // Fetch available pickup requests (dummy data for now, replace with real API call)
  const fetchPickupRequests = async () => {
    try {
      const response = await fetch('/api/available-pickups'); // Replace with your API endpoint
      const data = await response.json();
      setPickupRequests(data); // Assume the data returned is an array of available pickup requests
    } catch (error) {
      console.error('Error fetching available pickups:', error);
    }
  };

  const fetchRecyclingHistory = async () => {
    try {
      const response = await fetch(`/api/recycling-history/${email}`);  // Pass email to fetch history
      const data = await response.json();
      setRecyclingHistory(data);
    } catch (error) {
      console.error('Error fetching recycling history:', error);
    }
  };
  
  

  // Handle scheduling pickup
  const handleSchedulePickup = (request) => {
    if (availableCapacity >= request.weight) {
      setScheduledPickups([...scheduledPickups, request]);
      setAvailableCapacity(availableCapacity - request.weight);

      // Update the status of the request to 'Scheduled'
      const updatedRequests = pickupRequests.map((r) =>
        r.id === request.id ? { ...r, status: 'Scheduled' } : r
      );
      setPickupRequests(updatedRequests);
    } else {
      alert('Not enough capacity to schedule this pickup.');
    }
  };

  useEffect(() => {
    if (email) {
    fetchPickupRequests();
    fetchScheduledPickups();
    fetchRecyclingHistory();
    }
  }, [email]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>{recyclerInfo.name}'s Recycler Dashboard</h1>

      {/* Recycler Info */}
      <section>
        <h2>Recycler Information</h2>
        <p>Name: {recyclerInfo.name}</p>
        <p>Capacity: {recyclerInfo.capacity} kg</p>
        <p>Available Capacity: {availableCapacity} kg</p>
      </section>

      {/* Available Pickup Requests Section */}
      <section>
        <h2>Available Pickup Requests</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Location</th>
              <th>Material</th>
              <th>Weight</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pickupRequests.map((request) =>
              request.status === 'Available' ? (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.location}</td>
                  <td>{request.material}</td>
                  <td>{request.weight}</td>
                  <td>{request.status}</td>
                  <td>
                    <button onClick={() => handleSchedulePickup(request)}>
                      Schedule Pickup
                    </button>
                  </td>
                </tr>
              ) : null
            )}
          </tbody>
        </table>
      </section>

      {/* Recycling History Section */}
      <section>
        <h2>Your Recycling History</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Material</th>
              <th>Weight</th>
              <th>Pickup Date</th>
              <th>Feedback</th>
              <th>Disposal Purpose</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {recyclingHistory.length > 0 ? (
              recyclingHistory.map((history) => (
                <tr key={history._id}>
                  <td>{history._id}</td>
                  <td>{history.bottleType}</td>
                  <td>{history.weight}</td>
                  <td>{new Date(history.pickupDate).toLocaleDateString()}</td>
                  <td>{history.feedback || 'No feedback'}</td>
                  <td>{history.disposalPurpose}</td>
                  <td>{history.points}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No recycling history available.</td>
              </tr>
            )}
          </tbody>

        </table>
      </section>
    </div>
  );
};

export default RecyclerDashboard;
