<template>
  <div class="plr8">
    <div class="row">
      <div>
        <img
          class="main-img"
          :src="goods.skuTitleImage || goods.spuTitleImage || require('@/assets/images/logo.png')"
          alt="加载图片失败"
        />
      </div>
      <div class="ml10" style="width: 100%">
        <p class="fs16 fw550">{{goods.name}}</p>
        <div class="row">
          <p class="flex-1">分类：{{goods.cateName}}</p>
          <p class="flex-1">品牌：{{goods.brandName}}</p>
        </div>
        <div class="row">
          <p class="flex-1">NC编码：{{goods.skuSn}}</p>
          <p class="flex-1">首次入库时间：{{goods.firstInBoundDate | formatDate('Y/M/D h:m:s')}}</p>
        </div>
      </div>
    </div>
    <div class="mt10">
      <div class="row">
        <p class="flex-1 ellipsis">提交人： {{goods.creator}}</p>
        <p class="flex-3">申请时间：{{goods.createDate | formatDate('Y/M/D h:m:s')}}</p>
      </div>
      <div class="row">
        <p class="flex-1 ellipsis">审核人： {{goods.approver}}</p>
        <p class="flex-3">审批时间：{{goods.approval_date | formatDate('Y/M/D h:m:s')}}</p>
      </div>
    </div>
    <p>审核状态： {{checkMap[goods.checkedStatus]}}</p>
    <p class="pt10 fs16 fw550">商品修改记录</p>
    <el-table
      :data="list"
      border
      style="width: 535px"
      :span-method="spanMethod"
      :show-header="false"
      :row-class-name="tableRowClassName"
    >
      <el-table-column align="center" prop="col" label=" " width="80" />
      <el-table-column align="center" prop="value" label="属性" />
      <el-table-column align="center" prop="old" label="原值" width="150" />
      <el-table-column align="center" prop="new" label="新值" width="150" />
    </el-table>
    <div v-if="goods.skuReviewAttas && goods.skuReviewAttas.length">
      <p class="pt10 fs16 fw550">凭证</p>
      <el-image
        v-for="item in goods.skuReviewAttas"
        :key="item.id"
        class="mlr8 mt8"
        style="width: 120px; height: 120px"
        :src="item.attaUrl"
        fit="cover"
        :preview-src-list="goods.skuReviewAttas"
      ></el-image>
    </div>
  </div>
</template>

<script>
import numbro from 'numbro'
export default {
  name: 'CheckRecordDetail',

  props: {
    goods: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      attrs: [
        {
          key: 'CodeBar',
          value: '商品条码'
        },
        {
          key: 'ShelfLife',
          value: '保质期（天）'
        },
        {
          key: 'WholesaleSpec',
          value: '箱规'
        },
        {
          key: 'SkuLength',
          value: '长（mm）',
          col: '单品' // 标志合并字符串
        },
        {
          key: 'SkuWeight',
          value: '宽（mm）',
          col: '单品'
        },
        {
          key: 'SkuHeight',
          value: '高(mm)',
          col: '单品'
        },
        {
          key: 'Unitvolume',
          value: '体积（立方米）',
          col: '单品'
        },
        {
          key: 'SkuScale',
          value: '重量（KG）',
          col: '单品'
        },
        {
          key: 'LongCartonSize',
          value: '长（mm）',
          col: '外箱' // 标志合并字符串
        },
        {
          key: 'WidthCartonSize',
          value: '宽（mm）',
          col: '外箱'
        },
        {
          key: 'HighCartonSize',
          value: '高(mm)',
          col: '外箱'
        },
        {
          key: 'CartonVolum',
          value: '体积（立方米）',
          col: '外箱'
        },
        {
          key: 'CartonScale',
          value: '重量（KG）',
          col: '外箱'
        }
      ],
      checkMap: {
        0: '复核中',
        1: '复核通过',
        2: '复核不通过'
      }
    }
  },

  computed: {
    list() {
      let res = this.attrs
        .filter((v) => this.goods['new' + v.key] !== this.goods['old' + v.key])
        .map((v, i, arr) => {
          const defaultSpan = {
            rowspan: 1,
            colspan: 1
          }
          let spanList = [
            {
              rowspan: 0,
              colspan: 0
            },
            {
              rowspan: 1,
              colspan: 2
            },
            _.cloneDeep(defaultSpan),
            _.cloneDeep(defaultSpan)
          ]
          if (v.col) {
            spanList[1] = _.cloneDeep(defaultSpan)
            if (arr.findIndex((item) => item.col === v.col) === i) {
              spanList[0] = {
                rowspan: arr.reduce(
                  (count, item) => (item.col === v.col ? count + 1 : count),
                  0
                ),
                colspan: 1
              }
            } else {
              spanList[0] = {
                rowspan: 0,
                colspan: 0
              }
            }
          }
          return {
            ...v,
            old: this.goods['old' + v.key],
            new: this.goods['new' + v.key],
            spanList
          }
        })
      res.unshift({
        value: '属性',
        old: '原值',
        new: '新值',
        spanList: [
          {
            rowspan: 0,
            colspan: 0
          },
          {
            rowspan: 1,
            colspan: 2
          },
          {
            rowspan: 1,
            colspan: 1
          },
          {
            rowspan: 1,
            colspan: 1
          }
        ]
      })

      return res
    }
  },

  methods: {
    spanMethod({ row, column, rowIndex, columnIndex }) {
      // ['wqeq', 'etewsa', 'sdga'].test()
      return row.spanList[columnIndex]
    },

    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'my-header'
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.main-img {
  width: 100px;
  height: 100px;
  object-fit: contain;
}
p {
  margin: 6px 0;
}
.el-table /deep/ .my-header {
  background: #f4f4f4;
  color: rgba(0, 0, 0, 0.8);
  pointer-events: none;
}
</style>