import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import LocationListener from './LocationListener'; // Import your LocationListener component
import { UserContext } from '../UserContext'; // Make sure to import your UserContext

const HereMap = () => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null); // State to hold the map instance
  const [members, setMembers] = useState([]); // State to hold the list of members
  const { userId } = useContext(UserContext); // Move useContext here to get userId

  useEffect(() => {
    // Initialize the map
    const map = initializeMap();
    setMapInstance(map);

    // Resize the map when the window size changes
    const handleResize = () => {
      if (map) {
        map.getViewPort().resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      // Cleanup the event listener on component unmount
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const addMemberMarkers = useCallback((members) => {
    const H = window.H;
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

    members.forEach((member, index) => {
      const memberLocation = {
        lat: member.latitude,
        lng: member.longitude,
      };

      console.log(`Adding marker for: ${member.full_name} at ${memberLocation.lat}, ${memberLocation.lng}`); // Log location

      const icon = new H.map.Icon(
        `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="${colors[index % colors.length]}" viewBox="0 0 16 16"><path d="M8 0a8 8 0 0 0-8 8c0 3.5 3.5 8 8 8s8-4.5 8-8a8 8 0 0 0-8-8zm0 12.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"/></svg>`
      );

      const marker = new H.map.Marker(memberLocation);
      marker.setIcon(icon);
      mapInstance.addObject(marker);

      const bubble = new H.ui.InfoBubble(memberLocation, { content: member.full_name });
      const ui = H.ui.UI.createDefault(mapInstance, mapInstance.getBaseLayer());
      ui.addBubble(bubble);
    });
  }, [mapInstance]); // Adding mapInstance as a dependency

  useEffect(() => {
    if (mapInstance && userId) {
      fetch('http://localhost:8000/api/member/get-members-around-user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          if (data.members) {
            setMembers(data.members);
            addMemberMarkers(data.members); // Call addMemberMarkers with the fetched members
          } else {
            console.error('No members found');
          }
        })
        .catch((error) => console.error('Error fetching members:', error));
    }
  }, [mapInstance, userId, addMemberMarkers]); // Include addMemberMarkers in the dependency array

  const initializeMap = () => {
    const H = window.H;

    const platform = new H.service.Platform({
      apikey: 'DNmL97HWjNYSsJvnI8e-ootShOo4_sOJfXI0HfqPaQ0',
    });

    const defaultLayers = platform.createDefaultLayers();

    const map = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
      center: { lat: 52.52, lng: 13.4050 }, // Default location (Berlin)
      zoom: 14,
      pixelRatio: window.devicePixelRatio || 1,
    });

    // Add map interaction (pan, zoom, etc.)
    new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    H.ui.UI.createDefault(map, defaultLayers);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Center map on the user's location
          map.setCenter(userLocation);
          map.setZoom(14);

          // Add a marker at the user's location
          const userMarker = new H.map.Marker(userLocation);
          map.addObject(userMarker);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert(`Geolocation failed: ${error.message}`);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }

    return map; // Return the map instance
  };

  const handleDistress = () => {
    console.log('Distress');
  };

  return (
    <div
      style={{
        display: 'flex', // Use Flexbox for centering
        flexDirection: 'column', // Stack the map and button vertically
        justifyContent: 'center', // Center-align vertically
        alignItems: 'center', // Center-align horizontally
        width: '100%',
        height: '100vh', // Full viewport height
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      <h1 style={{ color: '#ff5959' }}>Here Map</h1>

      {/* Include the Location Listener here */}
      <LocationListener />

      <div
        ref={mapRef}
        style={{
          width: '100%', // Full width
          maxWidth: '1000px', // Maximum width of 1000px for the map
          height: '700px', // Fixed height of 700px for the map
          border: '2px solid #ccc',
          borderRadius: '10px',
          position: 'relative',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      ></div>

      <button
        onClick={handleDistress}
        style={{
          marginTop: '20px', // Space between the map and the button
          padding: '10px 20px', // Padding inside the button
          fontSize: '1rem', // Font size for the button text
          backgroundColor: '#ff5959', // Red color for the distress button
          color: '#fff', // White text color
          border: 'none', // Remove border
          borderRadius: '8px', // Rounded corners
          cursor: 'pointer', // Change cursor on hover
          transition: 'background-color 0.3s ease',
        }}
      >
        Distress
      </button>
      <footer style={{ marginTop: '20px' }}>
        <p></p>
      </footer>
    </div>
  );
};

export default HereMap;