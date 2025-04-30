import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

// Fix marker icons (Leaflet default icons issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function RecyclingCenterFinder() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await axios.get('/api/locations');
      setLocations(res.data);
    } catch (err) {
      console.error('Error fetching locations', err);
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
    <MapContainer center={[6.9271, 79.8612]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      {locations.map(loc => (
        <Marker key={loc._id} position={[loc.latitude, loc.longitude]}>
          <Popup>{loc.name}</Popup>
        </Marker>
      ))}
      <MapClickHandler />
    </MapContainer>
  );
}

export default RecyclingCenterFinder;
