const MyPromise = require("./dist/promise.cjs.js");
module.exports = {
  resolved: MyPromise.resolve,
  rejected: MyPromise.reject,
  deferred: () => {
    const result = {};
    result.promise = new MyPromise((resolve, reject) => {
      result.resolve = resolve;
      result.reject = reject;
    });
    return result;
  }
};
