import { promiseState, promiseStateItem, ThenFn } from '../type'
import resolvePromise from './resolvePromise'
import { isFunction, promiseStateList, rejectedPromise } from './utile'

interface resolver {
  (resolve: ThenFn, reject: ThenFn): void
}

export default class PromiseH {
  state: promiseState
  result: any
  onFulfilledCabs: ThenFn[]
  onRejectedCabs: ThenFn[]
  static resolve(value: any) {
    return new PromiseH((resolveFn, rejectFn) => {
      resolveFn(value)
    })
  }
  static reject(reason: any) {
    return new PromiseH((resolveFn, rejectFn) => {
      rejectFn(reason)
    })
  }

  constructor(fn: resolver) {
    if (!isFunction(fn)) {
      throw new TypeError(`Promise resolver ${fn} is not a function`)
    }
    this.state = promiseStateList.pending
    this.result = undefined
    this.onFulfilledCabs = []
    this.onRejectedCabs = []
    fn(
      value => {
        resolvePromise(this, value)
      },
      reason => {
        rejectedPromise(this, reason)
      }
    )
  }
  then(onFulfilled?: ThenFn, onRejected?: ThenFn) {
    onFulfilled = isFunction(onFulfilled) ? onFulfilled : value => value
    onRejected = isFunction(onRejected)
      ? onRejected
      : reason => {
          throw reason
        }

    let promise1 = this
    let promise2: PromiseH
    if (promise1.state === promiseStateList.fulfilled) {
      return (promise2 = new PromiseH(() => {
        setTimeout(() => {
          try {
            let x = onFulfilled!(promise1.result)
            resolvePromise(promise2, x)
          } catch (error) {
            rejectedPromise(promise2, error)
          }
        })
      }))
    }
    if (promise1.state === promiseStateList.rejected) {
      return (promise2 = new PromiseH(() => {
        setTimeout(() => {
          try {
            let x = onRejected!(promise1.result)
            resolvePromise(promise2, x)
          } catch (error) {
            rejectedPromise(promise2, error)
          }
        })
      }))
    }

    if (promise1.state === promiseStateList.pending) {
      return (promise2 = new PromiseH(() => {
        this.onFulfilledCabs.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled!(promise1.result)
              resolvePromise(promise2, x)
            } catch (error) {
              rejectedPromise(promise2, error)
            }
          })
        })
        this.onRejectedCabs.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected!(promise1.result)
              resolvePromise(promise2, x)
            } catch (error) {
              rejectedPromise(promise2, error)
            }
          })
        })
      }))
    }
  }
}
