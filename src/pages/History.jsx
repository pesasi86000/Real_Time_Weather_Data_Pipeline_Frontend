import { useState, useEffect, useCallback } from 'react'
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
import { checkWeatherAlerts } from '../utils/weatherAlerts'
import './History.css'

const API_URL    = 'http://127.0.0.1:5000/weather'
const LIVE_CITIES = ['London', 'New York', 'Tokyo', 'Sydney', 'Paris', 'Dubai']

function getWeatherIcon(condition) {
  if (!condition) return '☁️'
  const c = condition.toLowerCase()
  if (c.includes('clear') || c.includes('sunny')) return '☀️'
  if (c.includes('cloud')) return '☁️'
  if (c.includes('rain') || c.includes('drizzle')) return '🌧️'
  if (c.includes('storm') || c.includes('thunder')) return '⛈️'
  if (c.includes('snow')) return '❄️'
  if (c.includes('mist') || c.includes('fog')) return '🌫️'
  return '🌤️'
}

/** Show a temperature delta arrow between live and last-collected. */
function TempDelta({ live, collected }) {
  const diff = parseFloat(live) - parseFloat(collected)
  if (isNaN(diff) || Math.abs(diff) < 0.05) {
    return <span className="delta delta-neutral">±0</span>
  }
  return (
    <span className={`delta ${diff > 0 ? 'delta-up' : 'delta-down'}`}>
      {diff > 0 ? '▲' : '▼'} {Math.abs(diff).toFixed(1)}°
    </span>
  )
}

/** Derive the most-recent row per Location from historicalData. */
function buildLatestPerCity(data) {
  const map = {}
  for (const row of data) {
    const loc = row.Location
    if (!loc) continue
    if (!map[loc]) {
      map[loc] = row
    } else {
      const existing = new Date(`${map[loc].Date}T${map[loc].Time || '00:00'}`)
      const current  = new Date(`${row.Date}T${row.Time || '00:00'}`)
      if (current > existing) map[loc] = row
    }
  }
  return map
}

function History() {
  // ── Historical CSV state ───────────────────────────────────────
  const [historicalData, setHistoricalData] = useState([])
  const [csvLoading, setCsvLoading] = useState(true)
  const [csvError, setCsvError]     = useState(null)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  // ── Live snapshot state ────────────────────────────────────────
  const [liveData,    setLiveData]    = useState({})   // { city: apiResponseObj }
  const [liveLoading, setLiveLoading] = useState(true)
  const [liveError,   setLiveError]   = useState(null)
  const [liveUpdated, setLiveUpdated] = useState(null)

  // ── Chart filter state ─────────────────────────────────────────
  const [selectedCity, setSelectedCity] = useState('All')

  // ── Load CSV ───────────────────────────────────────────────────
  const loadCSVData = useCallback(async () => {
    try {
      setCsvLoading(true)
      setCsvError(null)

      const response = await fetch('/weather_history.csv')

      if (!response.ok) {
        setCsvError(
          response.status === 404
            ? 'No CSV found. Run the collector once to generate data.'
            : `Failed to load CSV (HTTP ${response.status})`
        )
        setHistoricalData([])
        setCsvLoading(false)
        return
      }

      const csvText = await response.text()
      if (!csvText.trim()) {
        setCsvError('CSV file is empty. Start the collector to populate it.')
        setHistoricalData([])
        setCsvLoading(false)
        return
      }

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: ({ data }) => {
          if (data && data.length > 0) {
            setHistoricalData(data)
          } else {
            setCsvError('CSV has no data rows.')
            setHistoricalData([])
          }
          setCsvLoading(false)
        },
        error: (err) => {
          setCsvError(`CSV parse error: ${err.message}`)
          setCsvLoading(false)
        },
      })
    } catch (err) {
      setCsvError(err.message)
      setCsvLoading(false)
    }
  }, [])

  // ── Fetch live weather for all tracked cities ──────────────────
  const fetchAllLive = useCallback(async () => {
    setLiveLoading(true)
    setLiveError(null)

    const results = await Promise.allSettled(
      LIVE_CITIES.map(city =>
        fetch(`${API_URL}?city=${encodeURIComponent(city)}`)
          .then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`)
            return r.json()
          })
          .then(data => ({ city, data }))
      )
    )

    const map = {}
    let successes = 0
    for (const r of results) {
      if (r.status === 'fulfilled') {
        map[r.value.city] = r.value.data
        successes++
      }
    }

    if (successes === 0) {
      setLiveError(
        'Backend is offline — live data unavailable. ' +
        'Make sure your Flask server is running on http://127.0.0.1:5000'
      )
    } else {
      setLiveData(map)
      setLiveUpdated(new Date())
    }
    setLiveLoading(false)
  }, [])

  useEffect(() => {
    loadCSVData()
    fetchAllLive()
  }, [loadCSVData, fetchAllLive])

  // ── Derived: most recent row per city ─────────────────────────
  const latestPerCity = buildLatestPerCity(historicalData)

  // ── Table sort helpers ─────────────────────────────────────────
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const sortedData = (() => {
    if (!sortConfig.key) return historicalData
    return [...historicalData].sort((a, b) => {
      const aNum = parseFloat(a[sortConfig.key])
      const bNum = parseFloat(b[sortConfig.key])
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum
      }
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  })()

  const columns = historicalData.length > 0 ? Object.keys(historicalData[0]) : []

  // ── Get unique cities from historical data ─────────────────────
  const uniqueCities = (() => {
    const cities = new Set(historicalData.map(row => row.Location).filter(Boolean))
    return ['All', ...Array.from(cities).sort()]
  })()

  // ── Filter data for charts ─────────────────────────────────────
  const chartData = selectedCity === 'All'
    ? historicalData
    : historicalData.filter(row => row.Location === selectedCity)

  return (
    <div className="history-page">

      {/* ── Page header ── */}
      <div className="history-header">
        <h1 className="history-title">Live &amp; Historical Weather</h1>
        <p className="history-subtitle">
          Real-time conditions alongside every record collected by the data pipeline
        </p>
      </div>

      <div className="history-content">

        {/* ══════════════════════════════════════════════════════════
            SECTION 1 — LIVE SNAPSHOT
        ══════════════════════════════════════════════════════════ */}
        <section className="page-section live-section">
          <SectionHeader
            icon="🔴"
            title="Live Snapshot"
            subtitle={
              liveUpdated
                ? `Fetched at ${liveUpdated.toLocaleTimeString()}`
                : 'Fetching live data…'
            }
            action={
              <button
                className="refresh-btn"
                onClick={fetchAllLive}
                disabled={liveLoading}
              >
                {liveLoading ? '⟳ Loading…' : '↻ Refresh Live'}
              </button>
            }
          />

          {liveError && (
            <div className="live-error-bar">⚠️ {liveError}</div>
          )}

          {/* Live city cards */}
          {liveLoading ? (
            <div className="live-skeleton-row">
              {LIVE_CITIES.map(c => <div key={c} className="live-skeleton" />)}
            </div>
          ) : (
            <div className="live-grid">
              {LIVE_CITIES.map(city => {
                const raw  = liveData[city]
                if (!raw) return null

                const temp      = raw.temperature ?? raw.temp
                const humidity  = raw.humidity ?? raw.humidity_percent ?? '—'
                const wind      = raw.wind_speed ?? 0
                const condition = raw.condition || raw.weather || 'Unknown'
                const lastRow   = latestPerCity[city]
                const alerts    = checkWeatherAlerts({
                  temperature: temp, condition, humidity, wind_speed: wind,
                })
                const highAlert = alerts.some(a =>
                  a.severity === 'critical' || a.severity === 'high'
                )

                return (
                  <div
                    key={city}
                    className={`live-card${highAlert ? ' live-card-alert' : ''}`}
                  >
                    {highAlert && (
                      <span className="live-alert-dot" aria-label="Active high alert" />
                    )}

                    <div className="live-card-header">
                      <span className="live-city">{city}</span>
                      <span className="live-icon">{getWeatherIcon(condition)}</span>
                    </div>

                    <div className="live-temp">{temp ?? '—'}°C</div>
                    <div className="live-condition">{condition}</div>

                    <div className="live-meta">
                      <span>💧 {humidity}%</span>
                      <span>🌬️ {wind} km/h</span>
                    </div>

                    {/* Comparison strip */}
                    {lastRow ? (
                      <div className="live-vs-collected">
                        <span className="lvc-label">Last collected</span>
                        <span className="lvc-collected">
                          {lastRow['Temperature (°C)']}°C
                          {temp != null && (
                            <TempDelta
                              live={temp}
                              collected={lastRow['Temperature (°C)']}
                            />
                          )}
                        </span>
                        <span className="lvc-time">
                          {lastRow.Date} {lastRow.Time}
                        </span>
                      </div>
                    ) : (
                      <div className="live-vs-collected lvc-empty">
                        <span className="lvc-label">No collected data yet</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECTION 2 — LATEST COLLECTED PER CITY
        ══════════════════════════════════════════════════════════ */}
        {!csvLoading && !csvError && Object.keys(latestPerCity).length > 0 && (
          <section className="page-section">
            <SectionHeader
              icon="📌"
              title="Latest Collected Records"
              subtitle="Most recent pipeline entry per city — compared with live data"
              action={
                <button className="refresh-btn" onClick={loadCSVData}>
                  ↻ Reload CSV
                </button>
              }
            />

            <div className="latest-grid">
              {Object.entries(latestPerCity).map(([city, row]) => {
                const live     = liveData[city]
                const liveTemp = live?.temperature ?? live?.temp

                return (
                  <div key={city} className="latest-card">
                    <div className="latest-city">
                      {getWeatherIcon(row.Condition)} {city}
                    </div>

                    <div className="latest-row">
                      <span className="latest-label">Collected at</span>
                      <span className="latest-val">{row.Date} {row.Time}</span>
                    </div>

                    <div className="latest-row">
                      <span className="latest-label">Temperature</span>
                      <span className="latest-val">
                        {row['Temperature (°C)']}°C
                        {liveTemp != null && (
                          <TempDelta
                            live={liveTemp}
                            collected={row['Temperature (°C)']}
                          />
                        )}
                      </span>
                    </div>

                    <div className="latest-row">
                      <span className="latest-label">Humidity</span>
                      <span className="latest-val">{row['Humidity (%)']}%</span>
                    </div>

                    <div className="latest-row">
                      <span className="latest-label">Wind</span>
                      <span className="latest-val">{row['Wind Speed (km/h)']} km/h</span>
                    </div>

                    <div className="latest-row">
                      <span className="latest-label">Condition</span>
                      <span className="latest-val">{row.Condition}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════
            CSV LOADING / ERROR STATES
        ══════════════════════════════════════════════════════════ */}
        {csvLoading && (
          <div className="loading-container">
            <div className="spinner" />
            <p className="loading-text">Loading historical data…</p>
          </div>
        )}

        {csvError && !csvLoading && (
          <div className="error-container">
            <div className="error-icon">📋</div>
            <h2 className="error-title">No Historical Data</h2>
            <p className="error-message">{csvError}</p>
            <p className="error-hint">
              Run <code>python weather_collector.py --once</code> to collect the first batch,
              then reload this page.
            </p>
            <button className="retry-button" onClick={loadCSVData}>
              Retry Loading
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            SECTION 3 — FULL HISTORICAL TABLE
        ══════════════════════════════════════════════════════════ */}
        {!csvLoading && !csvError && historicalData.length > 0 && (
          <>
            <section className="page-section">
              <SectionHeader
                icon="📋"
                title="All Historical Records"
                subtitle={`${historicalData.length} records — newest entries are highlighted`}
                action={
                  <button className="refresh-btn" onClick={loadCSVData}>
                    ↻ Refresh
                  </button>
                }
              />

              <div className="table-wrapper">
                <table className="history-table">
                  <thead>
                    <tr>
                      {columns.map(col => (
                        <th
                          key={col}
                          onClick={() => handleSort(col)}
                          className={`sortable-header ${
                            sortConfig.key === col
                              ? `sorted-${sortConfig.direction}`
                              : ''
                          }`}
                        >
                          <div className="header-content">
                            <span>{col}</span>
                            {sortConfig.key === col && (
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
                    {sortedData.map((row, i) => {
                      const isLatest = latestPerCity[row.Location] === row
                      return (
                        <tr
                          key={i}
                          className={`table-row${isLatest ? ' table-row-latest' : ''}`}
                        >
                          {columns.map(col => (
                            <td key={`${i}-${col}`} className="table-cell">
                              {col === 'Location' && isLatest
                                ? <><span className="latest-dot" />{row[col] || '-'}</>
                                : row[col] || '-'
                              }
                            </td>
                          ))}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                SECTION 4 — CHARTS
            ══════════════════════════════════════════════════════ */}
            <section className="page-section">
              <div className="charts-header">
                <div>
                  <SectionHeader
                    icon="📈"
                    title="Data Visualization"
                    subtitle="Temperature and humidity trends over time"
                  />
                </div>
                {uniqueCities.length > 1 && (
                  <div className="city-filter">
                    <label htmlFor="city-select" className="filter-label">Filter by City:</label>
                    <select
                      id="city-select"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="city-selector"
                    >
                      {uniqueCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {chartData && chartData.length > 0 ? (
                <>
                  <div className="chart-container">
                    <h3 className="chart-title">🌡️ Temperature Over Time (°C)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                          dataKey="Time"
                          tick={{ fontSize: 12 }}
                          stroke="#999"
                        />
                        <YAxis
                          unit="°C"
                          tick={{ fontSize: 12 }}
                          stroke="#999"
                        />
                        <Tooltip
                          formatter={(v) => {
                            const val = parseFloat(v)
                            return isNaN(val) ? ['N/A', 'Temperature'] : [`${val.toFixed(1)} °C`, 'Temperature']
                          }}
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '8px 12px',
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="Temperature (°C)"
                          stroke="#e74c3c"
                          strokeWidth={2}
                          dot={{ r: 4, fill: '#e74c3c' }}
                          activeDot={{ r: 6 }}
                          name="Temperature (°C)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="chart-container chart-container--spaced">
                    <h3 className="chart-title">💧 Humidity Over Time (%)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                          dataKey="Time"
                          tick={{ fontSize: 12 }}
                          stroke="#999"
                        />
                        <YAxis
                          unit="%"
                          tick={{ fontSize: 12 }}
                          stroke="#999"
                          domain={[0, 100]}
                        />
                        <Tooltip
                          formatter={(v) => {
                            const val = parseFloat(v)
                            return isNaN(val) ? ['N/A', 'Humidity'] : [`${val.toFixed(1)} %`, 'Humidity']
                          }}
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '8px 12px',
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="Humidity (%)"
                          stroke="#3498db"
                          strokeWidth={2}
                          dot={{ r: 4, fill: '#3498db' }}
                          activeDot={{ r: 6 }}
                          name="Humidity (%)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <div className="chart-empty-state">
                  <p className="chart-empty-icon">📊</p>
                  <p className="chart-empty-text">No data available for {selectedCity !== 'All' ? `${selectedCity}` : 'this selection'}.</p>
                </div>
              )}
            </section>
          </>
        )}

        {/* No rows yet */}
        {!csvLoading && !csvError && historicalData.length === 0 && (
          <div className="empty-container">
            <div className="empty-icon">📭</div>
            <h2 className="empty-title">No Collected Records Yet</h2>
            <p className="empty-message">
              Run <code>python weather_collector.py --once</code> to collect your
              first batch of data. Records will appear here automatically after
              the page reloads.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default History
