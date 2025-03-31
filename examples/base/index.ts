import MyPromise from "../../src";

const p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(111);
  }, 500);
})
p.then().then(res => {
  console.log(res)
})


