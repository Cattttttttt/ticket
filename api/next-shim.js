const AV = require('leanengine')

const { tickDelayNotify } = require('../next/api/dist')
const events = require('../next/api/dist/events').default

AV.Cloud.define('delayNotify', () => {
  // XXX: 由于还不能在 next 里定义云函数，先通过 legacy 的云函数调用 next 里的方法来发送 delay notification
  tickDelayNotify()
})

module.exports = { events }
