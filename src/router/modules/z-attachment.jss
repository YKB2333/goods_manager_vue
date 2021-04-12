/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'
const routes = {
  path: '/attachment',
  name: 'Attachment',
  component: Layout,
  redirect: {
    name: 'AttachmentIndex'
  },
  meta: {
    title: '附件列表',
    icon: 'attachment'
  },
  children: [
    {
      path: '/attachment/index',
      name: 'AttachmentIndex',
      component: () => import('@/views/attachment'),
      meta: {
        title: '附件列表',
        noCache: true
      }
    }
  ]
}
export default routes
