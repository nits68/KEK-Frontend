import { type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('../pages/IndexPage.vue') }],
  },
  {
    path: '/editusers',
    component: () => import('../layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('../pages/EditUsers.vue') }],
  },
  {
    path: '/editcategories',
    component: () => import('../layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('../pages/EditCategories.vue') }],
  },
  {
    path: '/editproducts',
    component: () => import('../layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('../pages/EditProducts.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/ErrorNotFoundPage.vue'),
  },
];

export default routes;
