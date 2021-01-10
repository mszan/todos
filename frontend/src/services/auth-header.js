// AUTHENTICATION HEADER
// Get auth header for request
export default function authHeader() {
    // Get data from local storage
    const username = localStorage.getItem('username');
    const accessToken = localStorage.getItem('accessToken');

    // Check if data exists
    if (username && accessToken) {
        // Return header
        return {
            'Authorization': "Bearer " + accessToken,
            'Content-Type':  'application/json',
        };
    } else {
        // Return empty dict
        return {};
    }
}