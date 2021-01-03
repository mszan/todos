import axios from "axios";

// Refreshes JWT
axios.interceptors.response.use(response => {
    // Response good
    return response
}, err => {
    // Response bad
    return new Promise((resolve, reject) => {
        const originalReq = err.config

        // If response is not present
        if (!err.response) {
            console.log("Response not present", err.config)
            return Promise.reject(err)
        }

        // If response returned 403
        if (err.response.status === 403 && err.config) {
            // Check if refreshToken is set and it correct.
            const refreshToken = localStorage.getItem("refreshToken")
            if(!refreshToken || refreshToken === "undefined") {
                //// LOGOUT ACTION - TODO: Optimise this to use AuthService.logout()
                // Delete localStorage
                localStorage.removeItem("username");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                // Redirect to homepage
                window.open(window.location.origin, "_self");
            }

            originalReq._retry = true
            // Get new tokens from server
            let res = fetch(process.env.REACT_APP_API_URL + 'token', {
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
                    originalReq.headers['Authorization'] = "Bearer " + localStorage.getItem("accessToken")

                    // Retry request
                    axios(originalReq)
                })
                .catch(err => {
                        console.log(err)
                        return Promise.resolve(res)
                    }
                )
            return Promise.resolve(res)
        }

        // If response returned 401
        if (err.response.status === 401) {
            throw Promise.reject(err)
        }

        // Else reject
        return Promise.reject(err);
    });
});

// Authenticates users
class AuthService {

    // Login user
    login(username, password) {
        return (
            axios.post(process.env.REACT_APP_API_URL + "login", {
                // Get JWT tokens from server
                username,
                password
            })

                // Set returned data in localStorage
                .then(response => {
                    if (response.data.accessToken && response.data.refreshToken) {
                        let data = response.data
                        localStorage.setItem("username", username);
                        localStorage.setItem("accessToken", data["accessToken"]);
                        localStorage.setItem("refreshToken", data["refreshToken"]);
                    }
                    return response.data;
                })

                .catch(err => {
                    return err
                })
        )
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