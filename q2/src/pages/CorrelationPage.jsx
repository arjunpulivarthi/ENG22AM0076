import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  Tooltip,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material'
import axios from 'axios'
const stockList = ['AAPL', 'NVDA', 'GOOGL', 'PYPL', 'TSLA']
const CorrelationPage = () => {
  const [min, setMin] = useState(50)
  const [data, setData] = useState([])
  const [spin, setSpin] = useState(false)
  const getIt = async () => {
    setSpin(true)
    let temp = []
    for (let i = 0; i < stockList.length; i++) {
      temp[i] = []
      for (let j = 0; j < stockList.length; j++) {
        if (i == j) {
          temp[i][j] = 1
          continue
        }
        try {
          let link = `http://localhost:8000/stockcorrelation?minutes=${min}&ticker=${stockList[i]}&ticker=${stockList[j]}`
          let res = await axios.get(link)
          temp[i][j] = Number(res.data.correlation.toFixed(2))
        } catch {
          temp[i][j] = null
        }
      }
    }
    setData(temp)
    setSpin(false)
  }
  useEffect(() => {
    getIt()
  }, [min])
  const color = (v) => {
    if (v == null) return '#aaa'
    if (v > 0.75) return '#64dd17'
    if (v > 0.3) return '#fbc02d'
    if (v > 0) return '#fb8c00'
    return '#e53935'
  }
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
      <Card sx={{ width: '95%', maxWidth: 880, p: 3 }}>
        <CardContent>
          <Typography variant="h6" align="center" gutterBottom>
            correlation
          </Typography>
          <TextField
            label="min"
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            sx={{ mb: 3, width: 120 }}
          />
          {spin ? (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            data.length === stockList.length && (
              <Box sx={{ overflowX: 'auto' }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: `80px repeat(${stockList.length}, 60px)`,
                    gap: 0.5
                  }}
                >
                  <Box></Box>
                  {stockList.map((x, i) => (
                    <Box key={i} sx={{ textAlign: 'center', fontSize: 13, fontWeight: 500 }}>
                      {x}
                    </Box>
                  ))}
                  {stockList.map((r, i) => (
                    <React.Fragment key={i}>
                      <Box sx={{ fontSize: 13, fontWeight: 500 }}>{r}</Box>
                      {data[i]?.length === stockList.length &&
                        stockList.map((_, j) => (
                          <Tooltip key={j} title={data[i][j] ?? 'na'}>
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                bgcolor: color(data[i][j]),
                                color: '#fff',
                                fontSize: 13,
                                lineHeight: '60px',
                                textAlign: 'center',
                                borderRadius: 1
                              }}
                            >
                              {data[i][j] != null ? data[i][j] : 'x'}
                            </Box>
                          </Tooltip>
                        ))}
                    </React.Fragment>
                  ))}
                </Box>
              </Box>
            )
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
export default CorrelationPage