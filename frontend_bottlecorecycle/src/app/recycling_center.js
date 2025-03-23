import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { FaMapMarkerAlt, FaStar, FaDirections, FaHeart, FaSearch } from "react-icons/fa";


const recyclingCenters = [
    { id: 1, name: "Green Earth Recycling", lat: 40.7128, lng: -74.006, status: "Open", rating: 4.5 },
    { id: 2, name: "Eco Drop-Off", lat: 40.7306, lng: -73.9352, status: "Closed", rating: 4.2 },
    { id: 3, name: "Sustainable Hub", lat: 40.742, lng: -73.987, status: "Open", rating: 4.7 },
  ];
  
  export default function NearbyRecyclingCenters() {
    const [favorites, setFavorites] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredCenters, setFilteredCenters] = useState(recyclingCenters);
  
    useEffect(() => {
      const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
      setFavorites(savedFavorites);
    }, []);
  
    const toggleFavorite = (id) => {
      let updatedFavorites = favorites.includes(id)
        ? favorites.filter((fav) => fav !== id)
        : [...favorites, id];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    };
  
    useEffect(() => {
      setFilteredCenters(
        recyclingCenters.filter((center) =>
          center.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }, [search]);
  
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <h1 className="text-2xl font-bold text-center text-green-600 dark:text-green-400">
          Nearby Recycling Centers
        </h1>
  
        {/* Search Bar */}
        <div className="flex items-center bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md mt-4">
          <FaSearch className="text-gray-500 mx-2" />
          <input
            type="text"
            placeholder="Search for a center..."
            className="flex-grow p-2 outline-none bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
  
        {/* Map View */}
        <MapContainer center={[40.7128, -74.006]} zoom={12} className="h-80 w-full mt-4 rounded-lg shadow-lg">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {filteredCenters.map((center) => (
            <Marker key={center.id} position={[center.lat, center.lng]}>
              <Popup>
                <div className="text-center">
                  <h2 className="font-bold text-green-600">{center.name}</h2>
                  <p className={`text-sm ${center.status === "Open" ? "text-green-500" : "text-red-500"}`}>
                    {center.status}
                  </p>
                  <p className="text-yellow-500 flex items-center justify-center">
                    <FaStar /> {center.rating}
                  </p>
                  <div className="flex justify-around mt-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 flex items-center"
                    >
                      <FaDirections className="mr-1" /> Directions
                    </a>
                    <button
                      onClick={() => toggleFavorite(center.id)}
                      className={`text-red-500 ${favorites.includes(center.id) ? "text-red-700" : ""}`}
                    >
                      <FaHeart />
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
  
        {/* List View */}
        <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-green-600 dark:text-green-400">List of Recycling Centers</h2>
          {filteredCenters.map((center) => (
            <div key={center.id} className="flex justify-between items-center p-2 border-b dark:border-gray-600">
              <div>
                <h3 className="font-bold text-gray-700 dark:text-white">{center.name}</h3>
                <p className={`text-sm ${center.status === "Open" ? "text-green-500" : "text-red-500"}`}>
                  {center.status}
                </p>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-500 flex items-center">
                  <FaStar /> {center.rating}
                </span>
                <button
                  onClick={() => toggleFavorite(center.id)}
                  className={`ml-3 text-red-500 ${favorites.includes(center.id) ? "text-red-700" : ""}`}
                >
                  <FaHeart />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }