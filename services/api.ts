import axios from "axios";

const BASE_URL = "http://192.168.0.150:4000"; // PC ubuntu

export const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
});
