import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import SectionHeader from '../components/SectionHeader'
import './History.css'

function History() {
  const [historicalData, setHistoricalData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  useEffect(() => {
    loadCSVData()
  }, [])

  const loadCSVData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/weather_history.csv')
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('No historical data available. CSV file not found.')
          setHistoricalData([])
        } else {
          throw new Error('Failed to load CSV file')
        }
        setLoading(false)
        return
      }
      
      const csvText = await response.text()
      
      if (!csvText.trim()) {
        setError('CSV file is empty')
        setHistoricalData([])
        setLoading(false)
        return
      }

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            setHistoricalData(results.data)
            setError(null)
          } else {
            setError('No records found in the CSV file')
            setHistoricalData([])
          }
          setLoading(false)
        },
        error: (error) => {
          setError(`Error parsing CSV: ${error.message}`)
          setLoading(false)
        }
      })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const getSortedData = () => {
    if (!sortConfig.key) return historicalData

    const sorted = [...historicalData].sort((a, b) => {
      let aVal = a[sortConfig.key]
      let bVal = b[sortConfig.key]

      // Try to convert to numbers if they look like numbers
      const aNum = parseFloat(aVal)
      const bNum = parseFloat(bVal)
      
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum
      }

      // String comparison
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  }

  const getColumnHeaders = () => {
    if (historicalData.length === 0) return []
    return Object.keys(historicalData[0])
  }

  const sortedData = getSortedData()
  const columns = getColumnHeaders()

  return (
    <div className="history-page">
      {/* ── Page Header ── */}
      <div className="history-header">
        <h1 className="history-title">Historical Weather Records</h1>
        <p className="history-subtitle">View and analyze past weather data</p>
      </div>

      <div className="history-content">
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Loading historical data...</p>
          </div>
        )}

        {error && !loading && (
          <div className="error-container">
            <div className="error-icon">📋</div>
            <h2 className="error-title">No Data Available</h2>
            <p className="error-message">{error}</p>
            <button className="retry-button" onClick={loadCSVData}>
              Retry Loading
            </button>
          </div>
        )}

        {!loading && !error && historicalData.length > 0 && (
          <>
            {/* ── Section: Historical Data Table ── */}
            <section className="page-section">
              <SectionHeader
                icon="📋"
                title="Historical Data"
                subtitle={`${historicalData.length} records loaded from weather history`}
                action={
                  <button className="refresh-btn" onClick={loadCSVData} title="Refresh data">
                    ↻ Refresh
                  </button>
                }
              />

              <div className="table-wrapper">
                <table className="history-table">
                  <thead>
                    <tr>
                      {columns.map((column) => (
                        <th
                          key={column}
                          onClick={() => handleSort(column)}
                          className={`sortable-header ${
                            sortConfig.key === column ? `sorted-${sortConfig.direction}` : ''
                          }`}
                        >
                          <div className="header-content">
                            <span>{column}</span>
                            {sortConfig.key === column && (
                              <span className="sort-icon">
                                {sortConfig.direction === 'asc' ? '▲' : '▼'}
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="table-row">
                        {columns.map((column) => (
                          <td key={`${rowIndex}-${column}`} className="table-cell">
                            {row[column] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── Section: Data Visualization ── */}
            <section className="page-section">
              <SectionHeader
                icon="📈"
                title="Data Visualization"
                subtitle="Temperature and humidity trends over time"
              />

              <div className="chart-container">
                <h3 className="chart-title">🌡️ Temperature Over Time (°C)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Time" tick={{ fontSize: 12 }} />
                    <YAxis unit="°C" tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => [`${value} °C`, 'Temperature']} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Temperature (°C)"
                      stroke="#e74c3c"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container chart-container--spaced">
                <h3 className="chart-title">💧 Humidity Over Time (%)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Time" tick={{ fontSize: 12 }} />
                    <YAxis unit="%" tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => [`${value} %`, 'Humidity']} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Humidity (%)"
                      stroke="#3498db"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>
          </>
        )}

        {!loading && !error && historicalData.length === 0 && (
          <div className="empty-container">
            <div className="empty-icon">📭</div>
            <h2 className="empty-title">No Records Yet</h2>
            <p className="empty-message">
              Upload a CSV file to the public folder to see historical weather records here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default History
