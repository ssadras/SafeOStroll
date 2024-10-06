import React, { useEffect, useRef, useState, useContext } from 'react';
import LocationListener from './LocationListener'; 
import { UserContext } from '../UserContext';

const HereMap = () => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useContext(UserContext);

  useEffect(() => {
    const map = initializeMap();
    setMapInstance(map);

    const handleResize = () => {
      if (map) {
        map.getViewPort().resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (map) {
        map.dispose(); // Cleanup the map instance if necessary
      }
    };
  }, []);

  const initializeMap = () => {
    const H = window.H;

    const platform = new H.service.Platform({
      apikey: 'DNmL97HWjNYSsJvnI8e-ootShOo4_sOJfXI0HfqPaQ0',
    });

    const defaultLayers = platform.createDefaultLayers();

    const map = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
      center: { lat: 52.52, lng: 13.4050 },
      zoom: 4,
      pixelRatio: window.devicePixelRatio || 1,
    });

    // Ensure map is not null before creating behavior and UI
    if (map) {
      new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
      H.ui.UI.createDefault(map, defaultLayers);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(userLocation);
          map.setZoom(14);
          const userMarker = new H.map.Marker(userLocation);
          map.addObject(userMarker);
        },
        (error) => {
          console.error('Geolocation error:', error);
        },
        { enableHighAccuracy: true }
      );
    }

    const hardCodedMembers = [
      {
        full_name: 'Quebec Location',
        latitude: 43.792051,
        longitude: -79.195528,
      },
      {
        full_name: 'Alberta Location',
        latitude: 43.784437,
        longitude: -79.183840,
      },
    ];

    hardCodedMembers.forEach((member) => {
      const memberLocation = {
        lat: member.latitude,
        lng: member.longitude,
      };

      const marker = new H.map.Marker(memberLocation);
      map.addObject(marker); // Use the local map instance to add the marker
    });

    return map; 
  };

  const handleDistress = () => {
    console.log('Distress');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0 }}>
      <h1 style={{ color: '#ff5959' }}>Map</h1>
      
      <LocationListener />

      <div ref={mapRef} style={{ width: '100%', maxWidth: '1000px', height: '700px', border: '2px solid #ccc', borderRadius: '10px', position: 'relative', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}></div>

      {loading && <p>Loading members...</p>} {/* Loading message */}

      <button onClick={handleDistress} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '1rem', backgroundColor: '#ff5959', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}>
        Distress
      </button>
      <footer style={{ marginTop: '20px' }}>
        <p></p>
      </footer>
    </div>
  );
};

export default HereMap;
