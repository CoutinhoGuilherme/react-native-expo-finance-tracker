import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // IP da máquina rodando FastAPI
});

export default api;
