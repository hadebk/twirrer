import axios from "axios";

export default {
  PinnedPost: async function () {
    try {
      const response = await axios.get("/pinedPost");
      return response;
    } catch (error) {
      throw error;
    }
  },

  postsFirstFetch: async function () {
    try {
      const response = await axios.get("/postsFirstFetch");
      return response;
    } catch (error) {
      throw error;
    }
  },

  postsNextFetch: async function (lastKey) {
    try {
      const response = await axios.post("/postsNextFetch", lastKey);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getPostDetails: async function (postId) {
    try {
      const response = await axios.get(`/post/${postId}/get`);
      return response;
    } catch (error) {
      throw error;
    } 
  },

  addNewPost: async function (post, token) {
    try {
      const response = await axios.post("/addNewPost", post, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  uploadPostImage: async function (fromData, token) {
    try {
      const response = await axios.post("/uploadPostImage", fromData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  deletePost: async function (postId, token) {
    try {
      const response = await axios.delete(`/post/${postId}/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  LikePost: async function (postId, token) {
    try {
      const response = await axios.get(`/post/${postId}/like`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  unlikePost: async function (postId, token) {
    try {
      const response = await axios.get(`/post/${postId}/unlike`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  addComment: async function (postId, comment, token) {
    try {
      const response = await axios.post(`/post/${postId}/comment`, comment, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};
