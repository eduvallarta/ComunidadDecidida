<template>
  <v-app>
    <v-main class="fill-height gradient-bg">
      <v-container fluid class="d-flex align-center justify-center fill-height">
        <v-row align="center" justify="center" class="w-100 no-gutters">
          <v-col cols="12" sm="10" md="6" lg="4">
            <v-card class="elevation-12 login-card">
              <v-img
                src="@/assets/comunidad-decidida.png"
                height="170"
                class="mx-auto clickable-image"
                @click="handleImageClick"
              ></v-img>
              <v-toolbar flat color="transparent">
                <v-toolbar-title class="form-title">INICIAR SESIÓN</v-toolbar-title>
              </v-toolbar>
              <v-card-subtitle class="form-subtitle">INTRODUCE TUS DATOS</v-card-subtitle>
              <v-card-text>
                <v-form @submit.prevent="login">
                  <v-text-field
                    label="Usuario"
                    prepend-inner-icon="mdi-account-circle-outline"
                    v-model="credentials.user"
                    outlined
                    dense
                    class="text-field modern-text-field"
                  ></v-text-field>
                  <v-text-field
                    label="Contraseña"
                    prepend-inner-icon="mdi-lock-outline"
                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    @click:append-inner="showPassword = !showPassword"
                    v-model="credentials.password"
                    outlined
                    dense
                    class="text-field modern-text-field"
                  ></v-text-field>
                </v-form>
                <v-alert v-model="errorLogin" type="warning" icon="mdi-alert" border="left" color="yellow darken-3" dark>{{ errorMessage }}</v-alert>
              </v-card-text>
              <v-card-actions class="button-container">
                  <v-btn
                    class="light-bulb-button narrow-button"
                    @mouseover="toggleLight"
                    @mouseleave="toggleLight"
                    @click="login"
                    depressed
                    large
                  >
                    <div v-if="loading" class="loading-container">
                      <v-progress-circular
                        indeterminate
                        color="#43b0e0"
                        size="64"
                      ></v-progress-circular>
                    </div>
                    <div v-else class="light-bulb-icon"></div>
                  </v-btn>
                  <div class="ingresar-text">Acceder</div>
                </v-card-actions>
              <v-card-text class="security-text">
                <v-icon left>mdi-lock</v-icon> Inicio de sesión seguro
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthenticate } from '../modules/web/use-authenticate';

export default {
  name: 'LoginComponent',
  setup() {
    const { auth, result, error } = useAuthenticate();
    const credentials = ref({ user: '', password: '' });
    const showPassword = ref(false);
    const errorLogin = ref(false);
    const errorMessage = ref('');
    const loading = ref(false);
    const router = useRouter();

    watch(errorLogin, (newVal) => {
      if (newVal) {
        setTimeout(() => {
          errorLogin.value = false;
        }, 5000);
      }
    });

    async function login() {
      console.log('Intento de inicio de sesión con:', credentials.value);

      if (!credentials.value.user) {
        errorMessage.value = 'Favor de capturar su usuario.';
        errorLogin.value = true;
        return;
      }
      if (!credentials.value.password) {
        errorMessage.value = 'Favor de capturar su contraseña.';
        errorLogin.value = true;
        return;
      }

      loading.value = true; // Iniciar carga

      try {
        await auth(credentials.value);
        console.log('Estado de result.value después de auth:', result.value);
        if (result.value && result.value.datos.success) {
          console.log('Autenticación exitosa:', result.value.datos);
          errorLogin.value = false;
          router.push({ name: 'information' });
          loading.value = false;
        } else {
          console.log('Autenticación fallida:', result.value.datos);
          errorMessage.value = result.value.datos.razon || 'Error desconocido en la autenticación.';
          errorLogin.value = true;
          loading.value = false;
        }
      } catch (e) {
        console.error('Error durante la autenticación:', e);
        errorMessage.value = e.message || 'Error desconocido durante la autenticación.';
        errorLogin.value = true;
        loading.value = false;
      }
    }

    function handleImageClick() {
      console.log('La imagen fue clickeada.');
    }

    function toggleLight() {
      console.log('Toggle light effect');
    }

    return { credentials, login, showPassword, handleImageClick, toggleLight, loading, errorLogin, errorMessage };
  }
};
</script>


<style scoped>
html, body, #app, .v-application {
  margin: 0;
  padding: 0;
  height: 100%;
}

.gradient-bg {
  background: linear-gradient(135deg, #f5f7fa 0%, #43b0e0 90%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.clickable-image {
  cursor: pointer;
}

.light-bulb-icon {
  background-image: url('@/assets/foco.png');
  width: 100px;
  height: 100px;
  background-size: cover;
  filter: grayscale(100%);
  transition: filter 0.3s, transform 0.3s;
}

.light-bulb-button:hover .light-bulb-icon {
  filter: brightness(1.5);
  transform: scale(1.1);
}

.v-btn {
  background-color: transparent !important;
  box-shadow: none !important;
  transition: background-color 0.3s !important;
  outline: none !important;
  border: none !important;
}

.v-btn:hover,
.v-btn:focus,
.v-btn:active {
  background-color: transparent !important;
  box-shadow: none !important;
  outline: none !important;
  border: none !important;
}

.narrow-button {
  width: 100px;
  height: 100px;
  margin: 0 auto;
}

.button-container {
  justify-content: center !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.ingresar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.ingresar-text {
  margin-top: 8px;
  font-size: 18px;
  font-weight: bold;
  color: #43b0e0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1.2px;
}

.security-text {
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-field {
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 5px;
}

.modern-text-field .v-input__prepend-inner,
.modern-text-field .v-input__append-inner {
  background-color: #f5f5f5;
  border-top-left-radius: 18px;
  border-bottom-left-radius: 8px;
}

.form-title {
  text-align: center;
  font-weight: bold;
  color: #43b0e0;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-size: 28px;
}

.form-subtitle {
  text-align: center;
  font-weight: bold;
  color: #43b0e0;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-size: 15px;
  margin-bottom: 20px;
}
</style>
