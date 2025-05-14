import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";

// Configuración base de Axios
const config: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_URL, // Tu URL base
  timeout: 5000, // Tiempo máximo de espera en milisegundos
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// Crear una instancia de Axios con la configuración
const api: AxiosInstance = axios.create(config);

// Exportar la instancia configurada
export default api;
