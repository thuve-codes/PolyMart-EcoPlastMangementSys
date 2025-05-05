import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

// Fix marker icon paths (common issue with Leaflet in Webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function EcoLocation() {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await axios.get('/api/locations');
      console.log("Fetched locations:", res.data); // Debugging
      setLocations(res.data);
    } catch (err) {
      console.error('Error fetching locations', err);
      setError("Failed to load locations. Please try again.");
    }
  };

  const saveLocation = async (lat, lng) => {
    const name = prompt('Enter recycling center name:');
    if (name) {
      try {
        await axios.post('/api/locations', { name, latitude: lat, longitude: lng });
        fetchLocations(); // Refresh after saving
      } catch (err) {
        console.error('Error saving location', err);
        setError("Failed to save location.");
      }
    }
  };

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        saveLocation(lat, lng);
      }
    });
    return null;
  }

  return (
    <div>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <MapContainer center={[7.9271, 79.8612]} zoom={9} style={{ height: "100vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        
        {locations.map(loc => {
          // Ensure coordinates are valid
          const lat = parseFloat(loc.latitude);
          const lng = parseFloat(loc.longitude);

          if (!lat || !lng) {
            console.warn(`Invalid location data: ${loc.name}`);
            return null; // Skip invalid locations
          }

          return (
            <Marker key={loc._id} position={[lat, lng]}>
              <Popup>{loc.name}</Popup>
            </Marker>
          );
        })}

        <MapClickHandler />
      </MapContainer>
    </div>
  );
}

export default EcoLocation;
