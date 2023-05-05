import { createRouter, createWebHistory } from 'vue-router'
import LibraryView from '../views/LibraryView/LibraryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: {
        name: 'main'
      }
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('../views/MainView/MainView.vue'),
      redirect: {
        name: 'library'
      },
      children: [
        {
          path: '/main/library',
          name: 'library',
          component: () => import('../views/LibraryView/LibraryView.vue')
        },
        {
          path: '/main/overview',
          name: 'record',
          component: () => import('../views/OverviewView/OverviewView.vue')
        },
        {
          path: '/main/reading',
          name: 'reading',
          component: () => import('../views/ReadingView/ReadingView.vue')
        },
        {
          path: '/main/bookmark',
          name: 'bookmark',
          component: () => import('../views/BookmarkView/BookmarkView.vue')
        }
      ]
    }
  ]
})

export default router
