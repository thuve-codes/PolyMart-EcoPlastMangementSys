import React, { useState, useEffect } from 'react';
import './RecyclingTrackingPage.css';
import Tracking from "./Components/Tracking";


// Recycling Centers Data
const RecyclingCenters = [
  { id: 1, name: "Green Earth Recycling", status: "Open", rating: 4.5, description: "A trusted center for recycling plastic, metal, and glass waste." },
  { id: 2, name: "Eco Drop-Off", status: "Closed", rating: 4.2, description: "An easy drop-off location for e-waste and household recyclables." },
  { id: 3, name: "Sustainable Hub", status: "Open", rating: 4.7, description: "A comprehensive recycling center promoting a zero-waste lifestyle." },
  { id: 4, name: "GreenCycle Depot", status: "Open", rating: 4.3, description: "Specializing in paper and cardboard recycling for businesses." },
];

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


   const [favorites, setFavorites] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredCenters, setFilteredCenters] = useState(RecyclingCenters);
  
    // Load favorites from local storage
    useEffect(() => {
      const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
      setFavorites(savedFavorites);
    }, []);
  
    // Toggle favorite status
    const toggleFavorite = (id) => {
      let updatedFavorites = favorites.includes(id)
        ? favorites.filter((fav) => fav !== id)
        : [...favorites, id];
  
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    };
  
    // Search functionality
    useEffect(() => {
      setFilteredCenters(
        RecyclingCenters.filter((center) =>
          center.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }, [search]);
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
      <aside className="sidebar">
        <Tracking />
      </aside>
      <div className="container">
      <h1>Nearby Recycling Centers ♻️</h1>

      {/* 🔍 Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a recycling center..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 📋 Recycling Centers List */}
      <div className="recycling-list">
        {filteredCenters.map((center) => (
          <div key={center.id} className="recycling-item">
            <div>
              <h3>{center.name}</h3>
              <p className={`status ${center.status.toLowerCase()}`}>
                {center.status === "Open" ? "✅ Open" : "❌ Closed"}
              </p>
              <p>{center.description}</p>
              <p>⭐ {center.rating}</p>
            </div>

            {/* ❤️ Favorite Button */}
            <button className={`favorite-btn ${favorites.includes(center.id) ? "active" : ""}`} onClick={() => toggleFavorite(center.id)}>
              {favorites.includes(center.id) ? "❤️" : "🤍"}
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
     
  );
};

export default RecyclingTrackingPage;
