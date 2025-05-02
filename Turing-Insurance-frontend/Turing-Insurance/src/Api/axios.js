// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // or whatever your backend route prefix is
  withCredentials: true, // if needed
});

export default instance;
