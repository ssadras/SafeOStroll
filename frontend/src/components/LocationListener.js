import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';  // Import UserContext

const LocationListener = () => {
    const { userId } = useContext(UserContext); // Get userId from context

    useEffect(() => {
        const sendLocation = async (latitude, longitude) => {
            try {
                // Send a POST request with user_id, latitude, and longitude
                const response = await axios.post('http://localhost:8000/api/location/set/', {
                    user_id: userId,
                    latitude: latitude,
                    longitude: longitude,
                });

                console.log('Location sent successfully:', response.data);
            } catch (error) {
                console.error('Error sending location:', error);
            }
        };

        const startLocationTracking = () => {
            if (navigator.geolocation) {
                // Update location every 10 seconds
                const intervalId = setInterval(() => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const latitude = position.coords.latitude;
                            const longitude = position.coords.longitude;
                            console.log('User location:', latitude, longitude);
                            
                            // Call the function to send the location
                            sendLocation(latitude, longitude);
                        },
                        (error) => {
                            console.error('Geolocation error:', error);
                        },
                        { enableHighAccuracy: true }
                    );
                }, 10000); // 10 seconds

                return () => clearInterval(intervalId); // Cleanup the interval on unmount
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        };

        const intervalId = startLocationTracking();

        return () => {
            clearInterval(intervalId);
        };
    }, [userId]); // Run effect when userId changes

    return null; // No UI component to render
};

export default LocationListener;