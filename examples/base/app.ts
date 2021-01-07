import PromiseH from '../../src/index'
const a = new PromiseH((resolve, reject) => {
  resolve(
    new PromiseH((resolve, reject) => {
      resolve(1)
    })
  )
})
console.log(a)
setTimeout(() => {
  console.log(a)
}, 1000)
