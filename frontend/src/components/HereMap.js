import React, { useEffect, useRef } from 'react';

const HereMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Call the initializeMap function when the component mounts
    const map = initializeMap();

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

  const initializeMap = () => {
    console.log('Initializing map...');
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
      console.log('Requesting user location...');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          console.log('User location obtained:', userLocation);

          // Center map on the user's location
          map.setCenter(userLocation);
          map.setZoom(14);

          // Add a marker at the user's location
          const userMarker = new H.map.Marker(userLocation);
          map.addObject(userMarker);

          // Ensure the marker is being added
          console.log('Marker added at user location:', userMarker);

          // Manually resize the map to ensure everything fits
          map.getViewPort().resize();
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert(`Geolocation failed: ${error.message}`);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.error('Geolocation not supported by this browser.');
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
    <p>
    </p>
    </footer>
</div>


  );
};

export default HereMap;
