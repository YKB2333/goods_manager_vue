/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'
const routes = {
  path: '/questionnaire',
  name: 'Questionnaire',
  component: Layout,
  redirect: '/questionnaire/template',
  meta: {
    title: '问卷管理',
    icon: 'report'
  },
  children: [
    {
      path: 'questionnaire',
      name: 'Questionnaire',
      component: () => import('@/views/questionnaire/questionnaire'),
      meta: {
        title: '问卷列表',
        noCache: true,
      },
    },
    {
      path: 'questionnaire/edit',
      name: 'editQuestionnaire',
      component: () => import('@/views/questionnaire/questionnaire/edit'),
      meta: {
        title: '问卷新增/编辑',
        noCache: true,
      },
    },
    {
      path: 'template',
      name: 'Template',
      component: () => import('@/views/questionnaire/template'),
      meta: {
        title: '问卷模板管理',
        noCache: true,
      },
    }, 
    {
      path: 'template/edit',
      name: 'editTemplate',
      component: () => import('@/views/questionnaire/template/edit'),
      meta: {
        title: '问卷模板新增/编辑',
        noCache: true,
      },
    },
  ]
}
export default routes
