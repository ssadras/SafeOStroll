import React, { useEffect, useRef } from 'react';

const HereMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Call the initializeMap function when the component mounts
    const map = initializeMap();

    // Resize the map when the window size changes
    window.addEventListener('resize', () => {
      if (map) {
        map.getViewPort().resize();
      }
    });

    return () => {
      // Cleanup the event listener on component unmount
      window.removeEventListener('resize', () => {
        if (map) {
          map.getViewPort().resize();
        }
      });
    };
  }, []);

  const initializeMap = () => {
    console.log('Initializing map...');
    const H = window.H;

    const platform = new H.service.Platform({
      apikey: '***REMOVED***',
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

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0 }} // Full viewport size
    ></div>
  );
};

export default HereMap;