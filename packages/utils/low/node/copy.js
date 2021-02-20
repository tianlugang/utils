const {
  copy,
  copySync
} = require('../../dist/node')
const path = require('path')

copy('./demo', './demos', {
  filter(src) {
    return /node_modules/g.test(src)
  }
}, (err) => {
  console.log()
  console.log('err', err)
})

try {
  copySync('../../node_modules/rollup', './rollup',{
    filter(src) {
      return /node_modules/g.test(path.basename(src))
    }
  })
  console.log('copySync end.')
} catch (err) {
  console.log(err)
}

