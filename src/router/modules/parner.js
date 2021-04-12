/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const salessRouter = {
  path: '/parner',
  component: Layout,
  redirect: '/parner/brand',
  name: 'Parner',
  meta: {
    title: '合作伙伴管理',
    icon: 'brand'
  },
  children: [
    {
      path: 'brand',
      name: 'Brand',
      component: () => import('@/views/parner/brand'),
      meta: {
        title: '品牌管理'
      }
    }
  ]
}
export default salessRouter
