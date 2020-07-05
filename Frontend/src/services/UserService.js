import axios from 'axios';

export default {

    loginUser: async function (email, password) { 
        try {
            const response = await axios
                .post(
                    "https://europe-west3-twirrer-app.cloudfunctions.net/api/login", {
                        params:
                            { 'email': email, 'password': password }
                }
            )
            return response.data
        }
        catch (error) {
            throw error
        }
    },

    signupUser: async function (userName, email, password, confirmPassword) {
        try {
            const response = await axios
                .post(
                    "https://europe-west3-twirrer-app.cloudfunctions.net/api/login", {
                        params:
                        {
                            "userName": userName,
                            "email": email,
                            "password": password,
                            "confirmPassword": confirmPassword
                        }
                }
                )
            return response.data
        }
        catch (error) {
            throw error
        }
    },

    logoutUser: async function () {
        try {
            const response = await axios
                .get(
                    "https://europe-west3-twirrer-app.cloudfunctions.net/api/logout"
                )
            return response.data
        }
        catch (error) {
            throw error
        }
    },

    // not finished!
    getAuthenticatedUser: async function (token) {
        try {
            const response = await axios
                .get(
                    "https://europe-west3-twirrer-app.cloudfunctions.net/api/getAuthenticatedUser"
                )
            return response.data
        }
        catch (error) {
            throw error
        }
    }


}