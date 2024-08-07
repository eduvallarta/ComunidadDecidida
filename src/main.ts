import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router'; // Importa el enrutador

const app = createApp(App);

app.use(vuetify);
app.use(router); // Usa el enrutador

app.mount('#app');
