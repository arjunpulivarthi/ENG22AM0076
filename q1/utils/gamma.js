function calc(x, y) {
  let n = Math.min(x.length, y.length)
  if (n == 0) return 0
  let a = 0, b = 0
  for (let i = 0; i < n; i++) {
    a += x[i]
    b += y[i]
  }
  let ma = a / n
  let mb = b / n
  let top = 0, va = 0, vb = 0
  for (let i = 0; i < n; i++) {
    let xa = x[i] - ma
    let yb = y[i] - mb
    top += xa * yb
    va += xa * xa
    vb += yb * yb
  }
  let ans = top / Math.sqrt(va * vb)
  return ans
}
module.exports = { calc }
