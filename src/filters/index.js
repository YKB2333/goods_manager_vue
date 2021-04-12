// set function parseTime,formatTime to filter
export { parseTime, formatTime, formatDate, formatFileSize } from '@/utils'

function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/* 数字 格式化*/
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

export function toThousandFilter(number) {
  if (number == null || number == undefined) {
    return '0.00';
  }
  let numbro = require("numbro")
  return numbro(number).format({
    thousandSeparated: true,
    mantissa: 2
  })
}

export function toOrdinalFilter(number) {
  if (number == null || number == undefined) {
    return null;
  }
  let numbro = require("numbro")
  return numbro(number).format({
    output: "ordinal"
  })
}

export function toPercentFilter(number) {
  if (number == null || number == undefined) {
    return null;
  }
  let numbro = require("numbro")
  return numbro(number).format({
    output: "percent",
    mantissa: 2
  })
}

// 格式化操作日志的内容
export function formatLogContent(content) {
  let arr = content.split('=>')
  // console.log(arr)
  if (arr.length) {
    return arr[0]
  } else {
    return content
  }
}
