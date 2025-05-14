import React from 'react'
import { Line } from 'react-chartjs-2'
import { Typography } from '@mui/material'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js'
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)
function StockChart({ data }) {
  let y = data.priceHistory.map(i => i.price)
  let x = data.priceHistory.map(i => new Date(i.lastUpdatedAt).toLocaleTimeString())
  let avg = data.averageStockPrice
  let a = Array(y.length).fill(avg)
  return (
    <>
      <Typography variant="body2">avg ₹{avg.toFixed(2)}</Typography>
      <Line
        data={{
          labels: x,
          datasets: [
            { label: 'price', data: y, borderColor: '#2196f3', pointRadius: 1, tension: 0.3 },
            { label: 'avg', data: a, borderColor: '#ff9800', pointRadius: 0, tension: 0 }
          ]
        }}
        options={{
          plugins: { legend: { labels: { font: { size: 11 } } } },
          scales: { x: { grid: { display: false } }, y: { grid: { borderDash: [3, 3] } } }
        }}
      />
    </>
  )
}
export default StockChart
