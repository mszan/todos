import axios from "axios";
const API_URL = "http://localhost:5000/api/";

// Refreshes JWT
axios.interceptors.response.use(response => {
    // Response good
    return response;
}, err => {
    // Response bad
    return new Promise((resolve, reject) => {
        const originalReq = err.config;
        // If response returned 403
        if ( err.response.status === 403 && err.config )
        {
            originalReq._retry = true;
            // Get new tokens from server
            let res = fetch(API_URL + 'token', {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                },
                redirect: 'follow',
                referrer: 'no-referrer',
                body: JSON.stringify({
                    refreshToken: localStorage.getItem("refreshToken")
                }),
            })
                .then(res => res.json())
                .then(res => {
                // Set new tokens in localStorage
                localStorage.setItem("accessToken", res.newAccessToken)
                localStorage.setItem("refreshToken", res.newRefreshToken)

                // Set new accessToken in original response
                originalReq.headers['Authorization'] = "Bearer " + localStorage.getItem("accessToken");

                // Retry request
                return axios(originalReq);
                })
            ;
            resolve(res);
        }
        return Promise.reject(err);
    });
});

// Authenticates users
class AuthService {

    // Logins user
    login(username, password) {
        return axios
            // Get JWT tokens from server
            .post(API_URL + "login", {
                username,
                password
            })

            // Set returned data in localStorage
            .then(response => {
                if (response.data.accessToken) {
                    let data = response.data
                    localStorage.setItem("username", username);
                    localStorage.setItem("accessToken", data["accessToken"]);
                    localStorage.setItem("refreshToken", data["refreshToken"]);
                }
                return response.data;
            })
            // .catch(TODO: wrong error handle)
    }

    // Logout user
    logout() {
        // Delete localStorage
        localStorage.removeItem("username");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // Redirect to homepage
        window.open(window.location.origin, "_self");
    }
}

export default new AuthService();