import { ref } from 'vue';
import { authenticate } from '../infrastructure/authenticate';

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

export function useAuthenticate() {
  const loading = ref(false);
  const result = ref<AuthResponse | null>(null);
  const error = ref<Error | null>(null);

  const auth = async (credentials: Credentials) => {
    loading.value = true;
    error.value = null;
    try {
      result.value = await authenticate(credentials);
      if (result.value && result.value.success) {
        sessionStorage.setItem('authToken', result.value.datos.token);
      }
    } catch (err) {
      error.value = err as Error;
      result.value = null;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    result,
    error,
    auth,
  };
}
