import React, { useState, useEffect } from 'react';
import './RecyclerDashboard.css';

// Dummy data for available plastic waste pickup requests
const dummyPickupRequests = [
  { id: 1, location: 'Downtown', material: 'Plastic', weight: '20kg', status: 'Available' },
  { id: 2, location: 'Uptown', material: 'Plastic', weight: '15kg', status: 'Available' },
  { id: 3, location: 'Suburb', material: 'Plastic', weight: '25kg', status: 'Scheduled' },
];

// Dummy recycler info
const recyclerInfo = {
  name: 'John Doe',
  capacity: 50, // Maximum capacity for plastic waste collection (in kg)
};

const RecyclerDashboard = () => {
  const [pickupRequests, setPickupRequests] = useState(dummyPickupRequests);
  const [scheduledPickups, setScheduledPickups] = useState([]);
  const [availableCapacity, setAvailableCapacity] = useState(recyclerInfo.capacity);

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

  // Simulate fetching updated pickup requests (this would typically come from an API)
  useEffect(() => {
    // Example logic for updating the available pickup requests
    const interval = setInterval(() => {
      setPickupRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.status === 'Available' ? { ...request, status: 'In Progress' } : request
        )
      );
    }, 10000); // Update every 10 seconds for demo purposes

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

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
                    <button onClick={() => handleSchedulePickup(request)}>Schedule Pickup</button>
                  </td>
                </tr>
              ) : null
            )}
          </tbody>
        </table>
        <p>Click 'Schedule Pickup' to schedule a collection for an available request.</p>
      </section>

      {/* Scheduled Pickups Section */}
      <section>
        <h2>Your Scheduled Pickups</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Location</th>
              <th>Material</th>
              <th>Weight</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {scheduledPickups.map((pickup) => (
              <tr key={pickup.id}>
                <td>{pickup.id}</td>
                <td>{pickup.location}</td>
                <td>{pickup.material}</td>
                <td>{pickup.weight}</td>
                <td>{pickup.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>These are the pickups you have scheduled. Manage them as needed.</p>
      </section>
    </div>
  );
};

export default RecyclerDashboard;
