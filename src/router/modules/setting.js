/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'
const routes = {
  path: '/setting',
  name: 'Setting',
  component: Layout,
  redirect: '/setting/cacheManager',
  meta: {
    title: '系统管理',
    icon: 'setting'
  },
  children: [
    {
      path: 'cacheManager',
      name: 'CacheManager',
      component: () => import('@/views/setting/cacheManager'),
      meta: {
        title: ' 缓存管理',
        noCache: true
      }
    },
    {
      path: 'versionManager',
      name: 'VersionManager',
      component: () => import('@/views/setting/version-manager'),
      meta: {
        title: '版本管理',
      }
    }
  ]
}
export default routes
