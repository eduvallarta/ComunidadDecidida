import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/components/LoginComponent.vue'),
    meta: {
      allUser: true,
    },
  },
  {
    path: '/information',
    name: 'information',
    component: () => import('@/components/TagsView.vue'),
    meta: {
      root: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL || '/'),
  routes,
});

// Rutas con permiso (puedes añadir lógica de autorización aquí si es necesario)
router.beforeEach((to, from, next) => {
  // Permite todas las rutas sin comprobación de autorización.
  next();
});

export default router;
