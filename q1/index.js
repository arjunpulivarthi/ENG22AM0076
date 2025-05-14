const express = require('express')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()
const { calc } = require('./utils/gamma')
const app = express()
app.use(cors())
let port = 8000
let tok = process.env.TOKEN
app.get('/stocks/:tick', async (req, res) => {
  let t = req.params.tick
  let m = req.query.minutes
  let a = req.query.aggregation
  try {
    let url = `http://20.244.56.144/evaluation-service/stocks/${t}?minutes=${m}`
    let r = await axios.get(url, {
      headers: {
        Authorization: tok
      }
    })
    let dat = r.data
    let sum = 0
    for (let i = 0; i < dat.length; i++) {
      sum += dat[i].price
    }
    let avg = sum / dat.length
    res.json({
      averageStockPrice: avg,
      priceHistory: dat
    })
  } catch (e) {
    console.log('err talking api')
    res.status(500).json({ msg: 'error talking to exchange' })
  }
})
app.get('/stockcorrelation', async (req, res) => {
  let m = req.query.minutes
  let t = req.query.ticker
  if (!Array.isArray(t)) {
    return res.status(400).json({ msg: 'need 2 tickers' })
  }
  let a = [], b = []
  try {
    let u1 = `http://20.244.56.144/evaluation-service/stocks/${t[0]}?minutes=${m}`
    let u2 = `http://20.244.56.144/evaluation-service/stocks/${t[1]}?minutes=${m}`
    let r1 = await axios.get(u1, { headers: { Authorization: tok } })
    let r2 = await axios.get(u2, { headers: { Authorization: tok } })
    a = r1.data.map(x => x.price)
    b = r2.data.map(x => x.price)
    let n = Math.min(a.length, b.length)
    a = a.slice(0, n)
    b = b.slice(0, n)
    let suma = 0, sumb = 0
    for (let i = 0; i < n; i++) {
      suma += a[i]
      sumb += b[i]
    }
    let avga = suma / n
    let avgb = sumb / n
    let top = 0, va = 0, vb = 0
    for (let i = 0; i < n; i++) {
      let da = a[i] - avga
      let db = b[i] - avgb
      top += da * db
      va += da * da
      vb += db * db
    }
    let corr = top / Math.sqrt(va * vb)
    res.json({
      correlation: Number(corr.toFixed(4)),
      stocks: {
        [t[0]]: {
          averagePrice: avga,
          priceHistory: r1.data
        },
        [t[1]]: {
          averagePrice: avgb,
          priceHistory: r2.data
        }
      }
    })
  } catch (e) {
    console.log('fail correlation:', e?.response?.status, e?.response?.data || e.message)
    res.status(500).json({ msg: 'failed correlation fetch' })
  }
})
app.listen(port, () => {
  console.log('server at', port)
})
