import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Divider
} from '@mui/material'
import StockChart from '../components/StockChart'
import axios from 'axios'
const StockPage = () => {
  const [s, setS] = useState('NVDA')
  const [m, setM] = useState(20)
  const [chart, setChart] = useState(null)
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/stocks/${s}?minutes=${m}&aggregation=average`
      )
      setChart(res.data)
    } catch (e) {
      console.log('fetch error')
    }
  }
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
      <Card sx={{ width: '100%', maxWidth: 750, p: 3, borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600 }}>
            Stock Viewer
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'center',
              mb: 3
            }}
          >
            <TextField
              label="Stock"
              select
              value={s}
              onChange={(e) => setS(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              {['NVDA', 'AAPL', 'TSLA', 'GOOGL', 'PYPL'].map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Minutes"
              type="number"
              value={m}
              onChange={(e) => setM(e.target.value)}
              sx={{ minWidth: 120 }}
            />
            <Button
              onClick={fetchData}
              variant="contained"
              sx={{ px: 4, backgroundColor: '#1976d2' }}
            >
              Go
            </Button>
          </Box>
          {chart && <StockChart data={chart} />}
        </CardContent>
      </Card>
    </Box>
  )
}
export default StockPage