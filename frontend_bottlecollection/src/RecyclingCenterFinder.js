import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';

const RecyclingCenterFinder = () => {
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [searchBox, setSearchBox] = useState(null);
  const [center, setCenter] = useState({ lat: 40.748817, lng: -73.985428 }); // Default center (NYC)
  const [zoom, setZoom] = useState(12);

  const handleSearchBoxLoad = (ref) => setSearchBox(ref);

  const handlePlacesChanged = () => {
    const places = searchBox.getPlaces();
    const markers = places.map((place) => ({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    }));
    setPlaces(markers);
    if (places.length > 0) {
      setCenter({
        lat: places[0].geometry.location.lat(),
        lng: places[0].geometry.location.lng(),
      });
      setZoom(15);
    }
  };

  useEffect(() => {
    if (map) {
      const listener = google.maps.event.addListener(map, 'bounds_changed', () => {
        const bounds = map.getBounds();
        if (bounds) {
          const placesService = new google.maps.places.PlacesService(map);
          placesService.nearbySearch(
            {
              location: map.getCenter(),
              radius: 5000, // Search within 5km radius
              type: ['point_of_interest'], // Filter for places of interest, can customize further
            },
            (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                setPlaces(
                  results.map((place) => ({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    name: place.name,
                  }))
                );
              }
            }
          );
        }
      });

      return () => google.maps.event.removeListener(listener);
    }
  }, [map]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyBprvUkVDTTcgESvEGTdu9l2uKYG9uCGis" libraries={['places']} version="weekly">

      <div style={{ height: '100vh' }}>
        <GoogleMap
          id="recycling-map"
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={center}
          zoom={zoom}
          onLoad={(mapInstance) => setMap(mapInstance)}
        >
          <StandaloneSearchBox
            onLoad={handleSearchBoxLoad}
            onPlacesChanged={handlePlacesChanged}
          >
            <input
              type="text"
              placeholder="Search for recycling centers or drop-off points"
              style={{
                boxSizing: 'border-box',
                border: '1px solid transparent',
                width: '240px',
                height: '40px',
                padding: '0 12px',
                borderRadius: '3px',
                fontSize: '18px',
                outline: 'none',
                position: 'absolute',
                left: '50%',
                top: '10px',
                marginLeft: '-120px',
              }}
            />
          </StandaloneSearchBox>
          
          {places.map((place, index) => (
            <Marker key={index} position={{ lat: place.lat, lng: place.lng }} />
          ))}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default RecyclingCenterFinder;
