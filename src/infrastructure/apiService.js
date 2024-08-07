import axios from 'axios';

const apiService = axios.create({
    baseURL: 'https://localhost:44377/asociado', // Reemplaza esta URL con la URL base de tu API
    headers: {
    'Content-Type': 'application/json'
  }
});

export default apiService;
