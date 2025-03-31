import { promiseState, resolver, ThenFn } from "../type";
import { isFunction, onRejectedPromise, } from "./utils";
import resolvePromise from "./resolvePromise";

export default class MyPromise {
  status: promiseState = 'pending'
  result = undefined
  onFulfilledFns: ThenFn[] = []
  onRejectedFns: ThenFn[] = []

  static resolve(value) {
    return new MyPromise((resolve, reject) => {
      resolve(value)
    })
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason)
    })
  }

  static all(promises: MyPromise[]) {
    return new MyPromise((resolve, reject) => {
      const results = [];
      let count = 0;
      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then((value) => {
          results[index] = value;
          count++;
          if (count == promises.length) resolve(results);
        }, reject)
      })
    })
  }

  static race(promises: MyPromise[]) {
    return new MyPromise((resolve, reject) => {
      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(resolve, reject)
      })
    })
  }

  static try(fn) {
    return new MyPromise(resolve => resolve(fn()))
  }

  static any(promises: MyPromise[]) {
    const result = []
    let count = 0;
    return new Promise((resolve, reject) => {
      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(resolve, err => {
          count++
          result.push(err)
          if (count === promises.length) reject(result)
        })
      })
    })
  }

  static allSettled(promises: any[]) {
    return MyPromise.all(
      promises.map(p => {
        return MyPromise.resolve(p).then(
          value => ({value, status: "fulfilled"}),
          reason => ({reason, status: "rejected"}),
        )
      })
    )
  }

  constructor(fn: resolver) {
    if (!isFunction(fn)) {
      throw new TypeError(`Promise resolver ${ fn } is not a function`)
    }
    this.status = 'pending'
    this.result = undefined
    this.onRejectedFns = []
    this.onFulfilledFns = [];
    try {
      fn(value => {
          resolvePromise(this, value)
        },
        reason => {
          onRejectedPromise(this, reason)
        })
    } catch (e) {
      onRejectedPromise(this, e)
    }
  }

  then(onFulfilled?: ThenFn, onRejected?: ThenFn) {
    onFulfilled = isFunction(onFulfilled) ? onFulfilled : value => value
    onRejected = isFunction(onRejected) ? onRejected : reason => {
      throw reason
    }
    let promise2

    promise2 = new MyPromise(() => {

      if (this.status === 'pending') {
        this.onRejectedFns.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.result)
              resolvePromise(promise2, x)
            } catch (error) {
              onRejectedPromise(promise2, error)
            }
          })
        })
        this.onFulfilledFns.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.result)
              resolvePromise(promise2, x)
            } catch (error) {
              onRejectedPromise(promise2, error)
            }
          })
        })
      }
      if (this.status === 'rejected') {
        setTimeout(() => {
          try {
            let x = onRejected(this.result)
            resolvePromise(promise2, x)
          } catch (e) {
            onRejectedPromise(promise2, e)
          }
        })
      }
      if (this.status === 'fulfilled') {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.result)
            resolvePromise(promise2, x)
          } catch (e) {
            onRejectedPromise(promise2, e)
          }
        })
      }

    })

    return promise2
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }

  finally(onFinally) {
    return this.then(
      value => MyPromise.resolve(onFinally()).then(() => value),
      reason => MyPromise.resolve(onFinally()).then(() => {
        throw reason
      }),
    )
  }
}
