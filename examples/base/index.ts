import MyPromise from "../../src";

const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(111);
  }, 500);
})
p.then((res) => {
  console.log(res)
})


