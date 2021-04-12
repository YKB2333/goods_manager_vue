/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'
const routes = {
  path: '/productlist',
  name: 'ProductList',
  component: Layout,
  redirect: '/productlist/release',
  meta: {
    title: '商品管理',
    icon: 'product'
  },
  children: [
    {
      path: 'means',
      name: 'ProductMeans',
      component: () => import('@/views/productList/ProductMeans'),
      meta: {
        title: '商品资料',
        noCache: true,
      }
    },
    {
      path: 'recycle',
      name: 'ProductRecycle',
      component: () => import('@/views/productList/recycle'),
      meta: {
        title: '回收站',
        noCache: true,
      }
    },
    {
      path: 'improt',
      name: 'ProductImport',
      component: () => import('@/views/productList/import'),
      meta: {
        title: '批量导入',
        noCache: false,
      }
    },
    {
      path: 'costPrice',
      name: 'CostPrice',
      component: () => import('@/views/productList/cost-price/CostPrice'),
      meta: {
        title: '商品成本价管理',
        noCache: true,
      }
    },
    // competitiveProducts
    {
      path: 'competitiveProducts',
      name: 'CompetitiveProducts',
      component: () => import('@/views/productList/competitiveProducts'),
      meta: {
        title: '市面竞品资料',
        noCache: true,
      }
    },
    {
      path: 'competitiveProducts/edit',
      name: 'editCompetitiveProducts',
      component: () => import('@/views/productList/competitiveProducts/edit'),
      hidden: true,
      meta: {
        title: '市面竞品新增/编辑',
        noCache: true,
        hideInTagsView: false
      }
    },
    {
      path: 'develop',
      name: 'developProduct',
      component: () => import('@/views/productList/developProduct'),
      meta: {
        title: '研发新品资料',
        noCache: true,
      }
    },
    {
      path: 'check',
      name: 'ProductCheck',
      component: () => import('@/views/productList/check'),
      meta: {
        title: '商品复核',
        noCache: true,
      }
    },
    {
      path: 'develop/add',
      name: 'editNewProduct',
      component: () => import('@/views/productList/developProduct/edit'),
      hidden: true,
      meta: {
        title: '研发新品新增',
        noCache: true,
        hideInTagsView: false
      }
    },
    {
      path: 'develop/edit',
      name: 'editNewProduct',
      component: () => import('@/views/productList/developProduct/edit'),
      hidden: true,
      meta: {
        title: '研发新品编辑',
        noCache: true,
        hideInTagsView: false
      }
    },
    {
      path: 'maintainingEdit',
      name: 'ProductMaintainingEdit',
      component: () => import('@/views/productList/maintaining/edit_'),
      hidden: true,
      meta: {
        title: '商品编辑',
        noCache: true,
        hideInTagsView: false
      }
    },
    {
      path: 'onSaleStatistic',
      name: 'OnSaleStatistic',
      component: () => import('@/views/productList/onSaleStatistic'),
      hidden: true,
      meta: {
        title: '上架商品信息统计',
        noCache: true,
        hideInTagsView: false
      }
    },
    {
      path: 'checkedStatistic',
      name: 'CheckedStatistic',
      component: () => import('@/views/productList/checkedStatistic'),
      hidden: true,
      meta: {
        title: '商品审核信息统计',
        noCache: true,
        hideInTagsView: false
      }
    },
    {
      path: 'maintainingAdd',
      name: 'ProductMaintainingAdd',
      component: () => import('@/views/productList/maintaining/add_'),
      hidden: true,
      meta: {
        title: '商品添加',
        noCache: true,
        hideInTagsView: false
      }
    },
    {
      path: 'importMaintainingEdit',
      name: 'importProductMaintainingEdit',
      component: () => import('@/views/productList/maintaining/importEdit'),
      hidden: true,
      meta: {
        title: '导入商品编辑',
        noCache: true,
        hideInTagsView: false
      }
    },
    {
      path: 'relationTagSpu',
      name: 'relationTagSpu',
      component: () => import('@/views/productList/spuTag/relationSpu'),
      hidden: true,
      meta: {
        title: '标签关联商品',
        noCache: true,
        hideInTagsView: false
      }
    },
  ]
}
export default routes
