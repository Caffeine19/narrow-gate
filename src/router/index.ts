import { createRouter, createWebHistory } from 'vue-router'
import LibraryView from '../views/LibraryView/LibraryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'library',
      component: LibraryView
    },
    {
      path: '/reading',
      name: 'reading',
      component: () => import('../views/ReadingView/ReadingView.vue')
    }
  ]
})

export default router
