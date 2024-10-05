import React, { useEffect, useRef } from 'react';

const HereMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Dynamically load the HERE Maps API script
    const loadMap = () => {
      const script = document.createElement('script');
      script.src = `https://js.api.here.com/v3/3.1/mapsjs-core.js`;
      script.async = true;
      script.onload = () => initializeMap();
      document.body.appendChild(script);
    };

    const initializeMap = () => {
      const H = window.H;
      
      if (H && H.service) {
        const platform = new H.service.Platform({
          apikey: '***REMOVED***', // Replace with your actual API key
        });

        const defaultLayers = platform.createDefaultLayers();

        const map = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
          center: { lat: 52.5200, lng: 13.4050 }, // Example: Berlin coordinates
          zoom: 14,
          pixelRatio: window.devicePixelRatio || 1,
        });

        // Add map interaction
        const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
        H.ui.UI.createDefault(map, defaultLayers);

        // Add a marker at the center of the map
        const marker = new H.map.Marker({ lat: 52.5200, lng: 13.4050 });
        map.addObject(marker);
      } else {
        console.error('HERE Maps API is not available.');
      }
    };

    loadMap();

    // Cleanup function to remove the map when the component unmounts
    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div>
      <div ref={mapRef} style={{ width: '100%', height: '500px' }} />
    </div>
  );
};

export default HereMap;
