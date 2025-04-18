import axios from "axios";
export const API_BASE_URL = "https://server.swapify-app.com";

const jwt=localStorage.getItem("jwt");

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "authorization":`Bearer ${jwt}`,
        "Content-Type":"application/json"
    }
});