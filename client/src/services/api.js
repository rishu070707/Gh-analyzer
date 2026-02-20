import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/repo';

export const analyzeRepo = async (url, token) => {
    try {
        const headers = token ? { 'x-github-token': token } : {};
        const response = await axios.post(`${API_BASE_URL}/analyze`, { url }, { headers });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};
