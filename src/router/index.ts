import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AdminView from '@/views/AdminView.vue'
import MonologView from '@/views/MonologView.vue'
import MonologPrivacyView from '@/views/MonologPrivacyView.vue'
import MonologTosView from '@/views/MonologTosView.vue'

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/admin', name: 'admin', component: AdminView },
    { path: '/monolog', name: 'monolog', component: MonologView },
    { path: '/monolog/privacy', name: 'monolog-privacy', component: MonologPrivacyView },
    { path: '/monolog/tos', name: 'monolog-tos', component: MonologTosView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
