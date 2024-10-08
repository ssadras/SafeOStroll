import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';  // Import UserContext

const NotificationListener = () => {
    const [newNotifications, setNewNotifications] = useState([]);
    const { userId } = useContext(UserContext);  // Access the global userId from context
    
    useEffect(() => {
        // Function to check the backend for new notifications
        const checkForNotifications = async () => {
            if (!userId) return;  // If userId is not available, skip the API call

            try {
                // Send a POST request with user_id in the body
                console.log("user")
                const response = await axios.post('http://localhost:8000/api/notification/get_new/', {
                    user_id: userId  // Send user_id in the request body
                });
                
                const { notifications } = response.data;
                console.log("New notifications:", notifications);

                if (notifications.length > 0) {
                    alert("You have new notifications!");
                    setNewNotifications(notifications);  // Optionally store them
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        // Set up polling every 10 seconds
        const intervalId = setInterval(checkForNotifications, 10000);

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, [userId]);  // Dependency array includes userId so it updates when the userId changes

    return (
        <div>
            {newNotifications.length > 0 && (
                <ul>
                    {newNotifications.map(notification => (
                        <li key={notification.id}>
                            {notification.title}: {notification.content}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NotificationListener;