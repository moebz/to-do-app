const API_URL = process.env.REACT_APP_API_URL;

const axios = require('axios');

const axiosInst = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getTasks = async () => {  
  try {
    const response = await axiosInst.get(`/api/tasks`);
    console.log("getTasks.data", response);
    return response.data;
  } catch (error) {
    console.log("getTasks.catch.error", error);
  }
};

const startEdit = async (id) => {
  try {
    console.log("startEdit.id", id);
    const response = await axiosInst.get(`/api/task/${id}`);
    console.log("startEdit.setState.response", response);
    return response.data;
  } catch (error) {
    console.log("startEdit.catch.error", error);
  }
};

const saveEdition = async (id, content) => {
  try {
    console.log("saveEdition.id", id);
    return await axiosInst.patch(`/api/task/${id}`, {
      content,      
    });
  } catch (error) {
    console.log("saveEdition.catch.error", error);
  }
};

const saveTask = async (content) => {
  try {
    console.log("saveTask");
    return await axiosInst.post(`/api/task`, {
      content      
    });
  } catch (error) {
    console.log("saveTask.catch.error", error);
  }
};

const deleteTask = async (id) => {
  try {
    console.log("deleteTask.id", id);
    return await axiosInst.delete(`/api/task/${id}`);
  } catch (error) {
    console.log("saveTask.catch.error", error);
  }
};

module.exports = {
  getTasks,
  startEdit,
  saveEdition,
  saveTask,
  deleteTask,
};
