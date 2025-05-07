import React, { useState, useEffect } from 'react';
import './RecyclingTrackingPage.css';
import Tracking from "./Components/Tracking";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RecyclingCenters = [
  { id: 1, name: "Green Earth Recycling", status: "Open", rating: 4.5, description: "A trusted center for recycling plastic, metal, and glass waste.", address: "123 Green St, Eco City" },
  { id: 2, name: "Eco Drop-Off", status: "Closed", rating: 4.2, description: "An easy drop-off location for e-waste and household recyclables.", address: "456 Eco Rd, Green Town" },
  { id: 3, name: "Urban Recycling Hub", status: "Open", rating: 4.7, description: "Central location for recycling paper, plastic, and electronics.", address: "789 Urban Ave, Metro City" },
  { id: 4, name: "Neighborhood Green Center", status: "Open", rating: 4.4, description: "Community recycling center for everyday waste items.", address: "321 Community Dr, Suburbia" },
  { id: 5, name: "RecycleIt Center", status: "Closed", rating: 4.3, description: "Specializes in recycling batteries, light bulbs, and electronics.", address: "654 Recycle Blvd, Tech City" },
  { id: 6, name: "EcoWaste Solutions", status: "Closed", rating: 4.0, description: "Offering solutions for electronic waste and appliance recycling.", address: "333 EcoWaste St, Green Plains" },
];

const RecyclingTrackingPage = () => {
  const [pickupRequests, setPickupRequests] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCenters, setFilteredCenters] = useState(RecyclingCenters);

  const userEmail = localStorage.getItem('userEmail') || '';

  useEffect(() => {
    const fetchPickupRequests = async () => {
      try {
        if (userEmail) {
          const response = await fetch(`http://localhost:5002/api/collections/pickup-requests/${userEmail}`);
          const data = await response.json();
          console.log("Received pickup requests:", data);  // Add this log
          setPickupRequests(data);
        }
      } catch (error) {
        console.error('Error fetching pickup requests:', error);
      }
    };
    

    fetchPickupRequests();
  }, [userEmail]);

  const userPickupRequests = pickupRequests.filter(request => request.email === userEmail);
  console.log("Filtered Pickup Requests:", userPickupRequests);


  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const toggleFavorite = (id) => {
    const updatedFavorites = favorites.includes(id)
      ? favorites.filter((fav) => fav !== id)
      : [...favorites, id];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  useEffect(() => {
    setFilteredCenters(
      RecyclingCenters.filter((center) =>
        center.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedRequests = pickupRequests.map(request => {
        if (request.recyclerEmail === userEmail) {
          let newStatus = request.status;
          if (request.status === 'Scheduled') {
            newStatus = 'In Progress';
            toast.info(`Pickup ID ${request.id} is now In Progress 🚚`, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          } else if (request.status === 'In Progress') {
            newStatus = 'Completed';
            toast.success(`Pickup ID ${request.id} has been Completed ✅`, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
          return { ...request, status: newStatus };
        }
        return request;
      });
      setPickupRequests(updatedRequests);
    }, 5000);

    return () => clearInterval(interval);
  }, [pickupRequests, userEmail]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Recycling Pickup Tracking & History</h1>

      <ToastContainer />

      <section>
        <h2>Real-Time Pickup Tracking</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th>Tracking ID</th>
              <th>Scheduled Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {userPickupRequests.map((request) => (
              <tr key={request._id}>
                <td>{request._id}</td>
                <td>
                  {new Date(new Date(request.createdAt).getTime() + 6 * 60 * 60 * 1000).toLocaleString()}
                </td>

                <td>{request.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p>Pickup status is updated in real-time. Please refresh the page or wait for updates.</p>
      </section>

      <aside className="sidebar">
        <Tracking />
      </aside>

      <div className="container">
        <h1>Nearby Recycling Centers ♻️</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search for a recycling center..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

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
                <p><strong>Address:</strong> {center.address}</p>
              </div>

              <button
                className={`favorite-btn ${favorites.includes(center.id) ? "active" : ""}`}
                onClick={() => toggleFavorite(center.id)}
              >
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
