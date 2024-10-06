import React, { useEffect, useState } from 'react';

const LocationListener = () => {
    const [location, setLocation] = useState({ latitude: null, longitude: null });

    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setLocation({ latitude, longitude });
                        console.log('Location:', { latitude, longitude });
                    },
                    (error) => {
                        console.error('Error fetching location:', error);
                    }
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
            }
        };

        // Call getLocation immediately to get the user's initial location
        getLocation();

        // Set up polling every 10 seconds
        const intervalId = setInterval(getLocation, 10000);

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <h2>Location Listener</h2>
            {location.latitude && location.longitude ? (
                <p>
                    Latitude: {location.latitude}, Longitude: {location.longitude}
                </p>
            ) : (
                <p>Fetching location...</p>
            )}
        </div>
    );
};

export default LocationListener;
