/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'
const routes = {
  path: '/report',
  name: 'Report',
  component: Layout,
  redirect: '/report/sales',
  meta: {
    title: '报表分析',
    icon: 'report'
  },
  children: [
    {
      path: 'sales',
      name: 'ReportSales',
      component: () => import('@/views/report/sales'),
      redirect: '/report/sales/brandCategory',
      meta: {
        title: '销售分析',
        noCache: true,
      },
      children:[
        {
          path: 'org',
          name: 'ReportSalesOrg',
          component: () => import('@/views/report/sales/org'),
          meta: {
            title: '销售组织业绩报表',
            noCache: true,
          },
        },
        {
          path: 'brandCategory',
          name: 'ReportSalesBrandCategory',
          component: () => import('@/views/report/sales/brandCategory'),
          meta: {
            title: '商品服务类型销量报表',
            noCache: true,
          },
        },
        {
          path: 'category',
          name: 'ReportSalesCategory',
          component: () => import('@/views/report/sales/category'),
          meta: {
            title: '商品品类销量报表',
            noCache: true,
          },
        },
        {
          path: 'brand',
          name: 'ReportSalesBrand',
          component: () => import('@/views/report/sales/brand'),
          meta: {
            title: '商品品牌销量报表',
            noCache: true,
          },
        },
        {
          path: 'goods',
          name: 'ReportSalesGoods',
          component: () => import('@/views/report/sales/goods'),
          meta: {
            title: '商品销量报表',
            noCache: true,
          },
        }
      ]
    },
    {
      path: 'customer',
      name: 'ReportCustomer',
      component: () => import('@/views/report/customer'),
      redirect: '/report/customer/consumeRank',
      meta: {
        title: '客户分析',
        noCache: true,
      },
      children:[
        {
          path: 'channel',
          name: 'ReportCustomerChannel',
          component: () => import('@/views/report/customer/channel'),
          meta: {
            title: '客户渠道分析报表',
            noCache: true,
          },
        },
        {
          path: 'consume',
          name: 'ReportCustomerConsume',
          component: () => import('@/views/report/customer/consume'),
          meta: {
            title: '客户分析报表',
            noCache: true,
          },
        },
        {
          path: 'ringGrowth',
          name: 'ReportCustomerRingGrowth',
          component: () => import('@/views/report/customer/ringGrowth'),
          meta: {
            title: '客户环比分析图表',
            noCache: true,
          },
        },
        {
          path: 'consumeRank',
          name: 'ReportCustomerConsumeRank',
          component: () => import('@/views/report/customer/consumeRank'),
          meta: {
            title: '客户销量排行',
            noCache: true,
          },
        },
      ]
    },
    {
      path: 'goods',
      name: 'ReportGoods',
      component: () => import('@/views/report/goods'),
      redirect: '/report/goods/salesRank',
      meta: {
        title: '商品分析',
        noCache: true,
      },
      children:[
        {
          path: 'ringGrowth',
          name: 'ReportGoodsRingGrowth',
          component: () => import('@/views/report/goods/ringGrowth'),
          meta: {
            title: '商品环比分析图表',
            noCache: true,
          }
        },
        {
          path: 'salesRank',
          name: 'ReportGoodsSalesRank',
          component: () => import('@/views/report/goods/salesRank'),
          meta: {
            title: '商品销量排行',
            noCache: true,
          }
        },
        {
          path: 'unknownGoods',
          name: 'ReportGoodsUnknownGoods',
          component: () => import('@/views/report/goods/unknownGoods'),
          meta: {
            title: '未分类的商品分析报表',
            noCache: true,
          }
        }
      ]
    }
  ]
}
export default routes
