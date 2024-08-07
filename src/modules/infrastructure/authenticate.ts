import axios, { AxiosInstance } from "axios";

interface Credentials {
  user: string;
  password: string;
}

interface AuthResponse {
  datos: any;
  success: boolean;
  mensaje: string;
  errores?: string[];
}

export async function authenticate({ user, password }: Credentials): Promise<AuthResponse> {
  try {
    const baseURL = process.env.VUE_APP_API_URL;
    const response = await axios.post(`${baseURL}/login/authenticate`, {
      User: user,
      Password: password
    });
    if (response.status === 200) {
      console.log('Autenticación exitosa:', response.data);  // Log cuando la autenticación es exitosa
      return {
        datos: response.data,
        success: true,
        mensaje: 'Autenticación exitosa'
      };
    } else {
      console.error('Respuesta no exitosa:', response); // Log si la respuesta no es exitosa
      throw new Error('Error de autenticación');
    }
  } catch (err: any) {
    console.error('Error en authenticate:', err); // Log para errores capturados
    return {
      datos: null,
      success: false,
      mensaje: err.response ? err.response.data.mensaje : "Error de red",
      errores: [err.message || "Error de red"]
    };
  }
}
