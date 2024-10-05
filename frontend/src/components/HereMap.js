/* global H */

function initializeMap() {
    const platform = new H.service.Platform({
        apikey: '***REMOVED***' // Replace with your actual API key
    });

    // Obtain the default map types from the platform object
    const defaultLayers = platform.createDefaultLayers();

    // Instantiate (and display) a map object
    const map = new H.Map(
        document.getElementById('mapContainer'),
        defaultLayers.vector.normal.map,
        {
            zoom: 10,
            center: { lat: 52.5, lng: 13.4 } // Change to your desired coordinates
        }
    );

    // Create the default UI components
    const ui = H.ui.UI.createDefault(map, defaultLayers);

    // Create the behavior to handle map events
    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    // Optional: Add a marker at a specific location
    const marker = new H.map.Marker({ lat: 52.5, lng: 13.4 }); // Change to your desired coordinates
    map.addObject(marker);
}

// Call the initializeMap function when the window loads
window.onload = initializeMap;

export default Dashboard;