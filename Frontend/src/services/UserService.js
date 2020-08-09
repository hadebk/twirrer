import axios from "axios";

export default {
  loginUser: async function (userData) {
    try {
      const response = await axios.post("/login", userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  signupUser: async function (userData) {
    try {
      const response = await axios.post("/signup", userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  logoutUser: async function () {
    try {
      const response = await axios.get("/logout");
      return response;
    } catch (error) {
      throw error;
    }
  },

  getAuthenticatedUser: async function (token) {
    try {
      const response = await axios.get("/getAuthenticatedUser", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getUserDetails: async function (userName) {
    try {
      const response = await axios.get(`/user/${userName}/getUserDetails`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  uploadProfileImage: async function (fromData, token) {
    try {
      const response = await axios.post("/uploadProfileImage", fromData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  uploadCoverImage: async function (fromData, token) {
    try {
      const response = await axios.post("/uploadCoverImage", fromData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  addUserDetails: async function (data, token) {
    try {
      const response = await axios.post("/addUserDetails", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  addFriend: async function (userName, token) {
    try {
      const response = await axios.get(`/user/${userName}/addFriend`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  unFriend: async function (userName, token) {
    try {
      const response = await axios.get(`/user/${userName}/unFriend`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  usersToAdd: async function (token) {
    try {
      const response = await axios.get("/usersToAdd", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) { 
      throw error;
    } 
  },

  markNotificationsAsRead: async function (notificationsIds, token) {
    try {
      const response = await axios.post(`/markNotificationsAsRead`, notificationsIds, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};
