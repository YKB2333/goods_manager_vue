/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'
const routes = {
  path: '/productPrice',
  name: 'ProductPrice',
  component: Layout,
  redirect: '/productPrice/priceList',
  meta: {
    title: '商品价格',
    icon: 'product-price'
  },
  children: [
    {
      path: 'priceList',
      name: 'ProductPriceList',
      component: () => import('@/views/productPrice/priceList'),
      meta: {
        title: ' 商品价格清单',
        noCache: true
      }
    },
    {
      path: 'priceMaintaining',
      name: 'ProductPriceMaintaining',
      component: () => import('@/views/productPrice/priceMaintaining'),
      hidden: true,
      meta: {
        title: '商品价格清单维护',
        noCache: true
      }
    }
  ]
}
export default routes
