'use strict';

const toString = Object.prototype.toString;
function isPromise(v) {
    return v instanceof MyPromise;
}
function isFunction(fn) {
    return toString.call(fn) === '[object Function]';
}
function isPlainObject(val) {
    return toString.call(val) === '[object Object]';
}
function onFulfilledPromise(promise, value) {
    if (promise.state !== 'pending')
        return;
    promise.state = 'fulfilled';
    promise.result = value;
    promise.onFulfilledFns.forEach(fn => {
        fn(value);
    });
}
function onRejectedPromise(promise, value) {
    if (promise.state !== 'pending')
        return;
    promise.state = 'rejected';
    promise.result = value;
    promise.onRejectedFns.forEach(fn => {
        fn(value);
    });
}

function resolvePromise(promise, x) {
    if (promise === x) {
        onRejectedPromise(promise, new TypeError('Chaining cycle detected for promise'));
        return;
    }
    if (isPromise(x)) {
        if (x.state === 'pending') {
            x.then(value => {
                resolvePromise(promise, value);
            }, reason => {
                onRejectedPromise(promise, reason);
            });
        }
        if (x.state === 'fulfilled') {
            onFulfilledPromise(promise, x.result);
        }
        if (x.state === 'rejected') {
            onRejectedPromise(promise, x.result);
        }
        return;
    }
    if (isFunction(x) || isPlainObject(x)) {
        let flag = false;
        let then;
        try {
            then = x.then;
        }
        catch (e) {
            onRejectedPromise(promise, e);
            return;
        }
        if (isFunction(then)) {
            try {
                then.call(x, y => {
                    if (flag)
                        return;
                    flag = true;
                    resolvePromise(promise, y);
                }, r => {
                    if (flag)
                        return;
                    flag = true;
                    onRejectedPromise(promise, r);
                });
            }
            catch (e) {
                if (flag)
                    return;
                flag = true;
                onRejectedPromise(promise, e);
            }
        }
        else {
            onFulfilledPromise(promise, x);
        }
    }
    else {
        onFulfilledPromise(promise, x);
    }
}

class MyPromise {
    static resolve(value) {
        return new MyPromise((resolve, reject) => {
            resolve(value);
        });
    }
    static reject(reason) {
        return new MyPromise((resolve, reject) => {
            reject(reason);
        });
    }
    constructor(fn) {
        this.state = 'pending';
        this.result = undefined;
        this.onFulfilledFns = [];
        this.onRejectedFns = [];
        if (!isFunction(fn)) {
            throw new TypeError(`Promise resolver ${fn} is not a function`);
        }
        this.state = 'pending';
        this.result = undefined;
        this.onRejectedFns = [];
        this.onFulfilledFns = [];
        fn(value => {
            resolvePromise(this, value);
        }, reason => {
            onRejectedPromise(this, reason);
        });
    }
    then(onFulfilled, onRejected) {
        onFulfilled = isFunction(onFulfilled) ? onFulfilled : value => value;
        onRejected = isFunction(onRejected) ? onRejected : reason => {
            throw reason;
        };
        let promise2;
        promise2 = new MyPromise(() => {
            if (this.state === 'pending') {
                this.onRejectedFns.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.result);
                            resolvePromise(promise2, x);
                        }
                        catch (error) {
                            onRejectedPromise(promise2, error);
                        }
                    });
                });
                this.onFulfilledFns.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.result);
                            resolvePromise(promise2, x);
                        }
                        catch (error) {
                            onRejectedPromise(promise2, error);
                        }
                    });
                });
            }
            if (this.state === 'rejected') {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.result);
                        resolvePromise(promise2, x);
                    }
                    catch (e) {
                        onRejectedPromise(promise2, e);
                    }
                });
            }
            if (this.state === 'fulfilled') {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.result);
                        resolvePromise(promise2, x);
                    }
                    catch (e) {
                        onRejectedPromise(promise2, e);
                    }
                });
            }
        });
        return promise2;
    }
}

module.exports = MyPromise;
//# sourceMappingURL=promise.cjs.js.map
