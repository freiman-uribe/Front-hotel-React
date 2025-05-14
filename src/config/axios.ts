import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

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

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Manejo de errores con respuesta del servidor
      const status = error.response.status;
      const message =
        (error.response.data as { message?: string })?.message || "Ocurrió un error inesperado.";
      // console.error(`Error ${status}: ${message}`);
      return Promise.reject({ status, message });
    } else if (error.request) {
      // Manejo de errores sin respuesta del servidor
      // console.error("Error: No se recibió respuesta del servidor.");
      return Promise.reject({
        status: null,
        message: "No se recibió respuesta del servidor.",
      });
    } else {
      // Manejo de errores de configuración o de red
      // console.error("Error: Ocurrió un problema al realizar la solicitud.");
      return Promise.reject({
        status: null,
        message: "Ocurrió un problema al realizar la solicitud.",
      });
    }
  }
);

// Exportar la instancia configurada
export default api;
