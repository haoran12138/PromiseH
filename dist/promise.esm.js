const toString = Object.prototype.toString;
function isPlanObject(val) {
    return toString.call(val) === '[object Object]';
}
function isFunction(val) {
    return toString.call(val) === '[object Function]';
}
function isMyPromise(val) {
    return val instanceof MyPromise;
}
function fulfilledPromise(promise, value) {
    if (promise.state !== 'pending')
        return;
    promise.state = 'fulfilled';
    promise.result = value;
    promise.onFulfilledCabs.forEach(cb => cb(value));
}
function rejectedPromise(promise, reason) {
    if (promise.state !== 'pending')
        return;
    promise.state = 'rejected';
    promise.result = reason;
    promise.onRejectedCabs.forEach(cb => cb(reason));
}

function resolvePromise(promise, x) {
    if (promise === x) {
        return rejectedPromise(promise, new TypeError("Chaining cycle detected for promise"));
    }
    if (isMyPromise(x)) {
        if (x.state === "pending") {
            x.then((value) => {
                resolvePromise(promise, value);
            }, (reason) => {
                rejectedPromise(promise, reason);
            });
            return;
        }
        if (x.state === "fulfilled") {
            fulfilledPromise(promise, x.result);
            return;
        }
        if (x.state === "rejected") {
            rejectedPromise(promise, x.result);
            return;
        }
        return;
    }
    if (isFunction(x) || isPlanObject(x)) {
        let flag = false;
        let then;
        try {
            then = x.then;
        }
        catch (err) {
            rejectedPromise(promise, err);
            return;
        }
        if (isFunction(then)) {
            try {
                then.call(x, (y) => {
                    if (flag)
                        return;
                    flag = true;
                    resolvePromise(promise, y);
                }, (r) => {
                    if (flag)
                        return;
                    flag = true;
                    rejectedPromise(promise, r);
                });
            }
            catch (err) {
                if (flag)
                    return;
                flag = true;
                rejectedPromise(promise, err);
            }
        }
        else {
            fulfilledPromise(promise, x);
            return;
        }
    }
    else {
        fulfilledPromise(promise, x);
        return;
    }
}

class MyPromise {
    static resolve(value) {
        return new MyPromise((resolveFn, rejectFn) => {
            resolveFn(value);
        });
    }
    static reject(reason) {
        return new MyPromise((resolveFn, rejectFn) => {
            rejectFn(reason);
        });
    }
    constructor(fn) {
        if (!isFunction(fn)) {
            throw new TypeError(`Promise resolver ${fn} is not a function`);
        }
        this.state = "pending";
        this.result = undefined;
        this.onFulfilledCabs = [];
        this.onRejectedCabs = [];
        fn((value) => {
            resolvePromise(this, value);
        }, (reason) => {
            rejectedPromise(this, reason);
        });
    }
    then(onFulfilled, onRejected) {
        onFulfilled = isFunction(onFulfilled) ? onFulfilled : (value) => value;
        onRejected = isFunction(onRejected)
            ? onRejected
            : (reason) => {
                throw reason;
            };
        const promise2 = new MyPromise((resolve, reject) => {
            if (this.state === "fulfilled") {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.result);
                        resolvePromise(promise2, x);
                    }
                    catch (e) {
                        rejectedPromise(promise2, e);
                    }
                }, 0);
            }
            if (this.state === "rejected") {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.result);
                        resolvePromise(promise2, x);
                    }
                    catch (e) {
                        rejectedPromise(promise2, e);
                    }
                }, 0);
            }
            if (this.state === "pending") {
                this.onFulfilledCabs.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onFulfilled(this.result);
                            resolvePromise(promise2, x);
                        }
                        catch (err) {
                            rejectedPromise(promise2, err);
                        }
                    }, 0);
                });
                this.onRejectedCabs.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onRejected(this.result);
                            resolvePromise(promise2, x);
                        }
                        catch (err) {
                            rejectedPromise(promise2, err);
                        }
                    }, 0);
                });
            }
        });
        return promise2;
    }
}

export { MyPromise as default };
//# sourceMappingURL=promise.esm.js.map
