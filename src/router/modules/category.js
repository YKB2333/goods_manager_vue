/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'
const routes = {
  path: '/category',
  name: 'Category',
  component: Layout,
  redirect: {
    name: 'CategoryManager'
  },
  meta: {
    title: '分类管理',
    icon: 'category'
  },
  children: [
    {
      path: '/categoryManager',
      name: 'CategoryManager',
      component: () => import('@/views/category'),
      meta: {
        title: '分类管理',
        noCache: true
      }
    }
  ]
}
export default routes
