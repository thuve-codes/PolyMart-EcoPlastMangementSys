import { useState, useEffect } from "react";
import "./RecycleCentersNearby.css"; 

// Recycling Centers Data
const RecyclingCenters = [
  { id: 1, name: "Green Earth Recycling", status: "Open", rating: 4.5, description: "A trusted center for recycling plastic, metal, and glass waste." },
  { id: 2, name: "Eco Drop-Off", status: "Closed", rating: 4.2, description: "An easy drop-off location for e-waste and household recyclables." },
  { id: 3, name: "Sustainable Hub", status: "Open", rating: 4.7, description: "A comprehensive recycling center promoting a zero-waste lifestyle." },
  { id: 4, name: "GreenCycle Depot", status: "Open", rating: 4.3, description: "Specializing in paper and cardboard recycling for businesses." },
];

export default function RecyclingCentersPage() {
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

  return (
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
  );
}
