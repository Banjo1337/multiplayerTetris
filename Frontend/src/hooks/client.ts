import axios from "axios";

export const axiosClient = axios.create({
	baseURL: "https://localhost:7076/api/",
	headers: {
		"Content-type": "application/json",
	},
	withCredentials: true,
});
