import axios from "axios";

const API_URL = "http://localhost:5000/api/";

class AuthService {
    login(username, password) {
        return axios
            .post(API_URL + "login", {
                username,
                password
            })
            .then(response => {
                if (response.data.accessToken) {
                    let data = response.data
                    data["username"] = username
                    localStorage.setItem("user", JSON.stringify(data));
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
    }

    // register(username, email, password) {
    //     return axios.post(API_URL + "register", {
    //         username,
    //         email,
    //         password
    //     });
    // }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}

export default new AuthService();