const PromiseH = require('./dist/promiseh.umd')

PromiseH.deferred = function() {
  // 延迟对象
  let defer = {}
  defer.promise = new PromiseH((resolve, reject) => {
    defer.resolve = resolve
    defer.reject = reject
  })
  return defer
}

module.exports = PromiseH
