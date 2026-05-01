import { useState, useEffect, useRef, useCallback } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import AlertBox from '../components/AlertBox'
import { checkWeatherAlerts, getAlertSummary } from '../utils/weatherAlerts'
import './Dashboard.css'

const REFRESH_INTERVAL = 300 // seconds
const API_URL = 'http://127.0.0.1:5000'
const cities = [
  'London', 'New York', 'Tokyo', 'Sydney', 'Paris',
  'Dubai', 'Mumbai', 'Singapore', 'Toronto', 'Berlin'
]
const COMPARE_CITIES = ['London', 'New York', 'Tokyo', 'Sydney', 'Dubai', 'Paris']

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

function getTempClass(temp) {
  if (temp === null || temp === undefined) return ''
  if (temp > 38) return 'temp-extreme-hot'
  if (temp > 32) return 'temp-hot'
  if (temp < 0)  return 'temp-freezing'
  if (temp < 10) return 'temp-cold'
  return ''
}

function CountdownBar({ secondsLeft, total }) {
  const pct = Math.max(0, Math.min(100, (secondsLeft / total) * 100))
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')
  return (
    <div className="countdown-wrap" title={`Auto-refresh in ${mm}:${ss}`}>
      <div className="countdown-track">
        <div className="countdown-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="countdown-label">Refresh in {mm}:{ss}</span>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="card skeleton-card">
      <div className="sk-row sk-title" />
      <div className="sk-row sk-wide" />
      <div className="sk-grid">
        {[...Array(4)].map((_, i) => <div key={i} className="sk-detail" />)}
      </div>
    </div>
  )
}

function Dashboard() {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [selectedCity, setSelectedCity] = useState('London')
  const [alerts, setAlerts] = useState([])
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set())
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL)

  // ── History & multi-city state ─────────────────────────────────
  const [historyData, setHistoryData]       = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [multiCityData, setMultiCityData]   = useState({})
  const [multiCityLoading, setMultiCityLoading] = useState(false)

  const countdownRef = useRef(null)

  const startCountdown = useCallback(() => {
    clearInterval(countdownRef.current)
    setCountdown(REFRESH_INTERVAL)
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(countdownRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
  }, [])

  const fetchWeatherData = useCallback(async (city, isAutoRefresh = false) => {
    try {
      if (isAutoRefresh) setRefreshing(true)
      else setLoading(true)
      setError(null)
      const response = await fetch(`${API_URL}/weather?city=${encodeURIComponent(city)}`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `City not found or backend error (${response.status})`)
      }
      const data = await response.json()
      setWeatherData(data)
      setLastUpdated(new Date())
      setAlerts(checkWeatherAlerts(data))
      setDismissedAlerts(new Set())
      startCountdown()
    } catch (err) {
      setError(err.message || 'Unable to connect to backend. Please make sure the server is running at http://127.0.0.1:5000')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [startCountdown])

  // ── Fetch last 24 historical records for the selected city ─────
  const fetchHistoryData = useCallback(async (city) => {
    setHistoryLoading(true)
    try {
      const res = await fetch(`${API_URL}/history?city=${encodeURIComponent(city)}&limit=24`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const raw = await res.json()
      const rows = Array.isArray(raw) ? raw : (raw.data || raw.records || [])
      setHistoryData(rows)
    } catch {
      setHistoryData([])
    } finally {
      setHistoryLoading(false)
    }
  }, [])

  // ── Fetch live weather for all compare cities ──────────────────
  const fetchMultiCity = useCallback(async () => {
    setMultiCityLoading(true)
    const results = await Promise.allSettled(
      COMPARE_CITIES.map(c =>
        fetch(`${API_URL}/weather?city=${encodeURIComponent(c)}`)
          .then(r => (r.ok ? r.json() : Promise.reject()))
          .then(data => ({ city: c, data }))
      )
    )
    const map = {}
    for (const r of results) {
      if (r.status === 'fulfilled') map[r.value.city] = r.value.data
    }
    setMultiCityData(map)
    setMultiCityLoading(false)
  }, [])

  const handleCityChange = (e) => {
    const city = e.target.value
    setSelectedCity(city)
    setWeatherData(null)
    setHistoryData([])
    fetchWeatherData(city)
    fetchHistoryData(city)
  }

  const handleManualRefresh = () => {
    fetchWeatherData(selectedCity, true)
    fetchHistoryData(selectedCity)
  }

  const handleDismissAlert = (index) => {
    setDismissedAlerts(prev => new Set([...prev, index]))
  }

  useEffect(() => {
    fetchWeatherData(selectedCity)
    fetchHistoryData(selectedCity)
    fetchMultiCity()
    const interval = setInterval(() => {
      fetchWeatherData(selectedCity, true)
      fetchHistoryData(selectedCity)
    }, REFRESH_INTERVAL * 1000)
    return () => {
      clearInterval(interval)
      clearInterval(countdownRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const visibleAlerts = alerts.filter((_, i) => !dismissedAlerts.has(i))
  const alertSummary = getAlertSummary(visibleAlerts)
  const cityName = weatherData?.title || weatherData?.location || weatherData?.city || selectedCity
  const temp = weatherData?.temperature ?? weatherData?.temp

  // ── Derive chart points from history API data ──────────────────
  const chartPoints = historyData
    .slice()
    .sort((a, b) => {
      const aStr = `${a.date || a.Date || ''}T${a.time || a.Time || '00:00'}`
      const bStr = `${b.date || b.Date || ''}T${b.time || b.Time || '00:00'}`
      return aStr.localeCompare(bStr)
    })
    .slice(-24)
    .map(r => ({
      label: r.time || r.Time || r.date || r.Date || '',
      temp: parseFloat(r.temperature ?? r['Temperature (°C)'] ?? r.temp) || null,
      humidity: parseFloat(r.humidity ?? r['Humidity (%)'] ?? r.humidity_percent) || null,
    }))
    .filter(p => p.temp !== null)

  return (
    <div className="dashboard-page">

      {/* ── Header ── */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Weather Dashboard</h1>
          <p className="dashboard-subtitle">Real-time weather monitoring</p>
        </div>
        <div className="header-right">
          {weatherData && !loading && (
            <CountdownBar secondsLeft={countdown} total={REFRESH_INTERVAL} />
          )}
          <div className="city-selector">
            <label htmlFor="city-dropdown">City</label>
            <select
              id="city-dropdown"
              value={selectedCity}
              onChange={handleCityChange}
              disabled={loading}
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Alert Summary Banner ── */}
      {!loading && !error && visibleAlerts.length > 0 && alertSummary && (
        <div className={`alert-summary-banner banner-${alertSummary.color}`}>
          <span className="banner-icon">
            {alertSummary.color === 'critical' ? '🚨' : alertSummary.color === 'high' ? '⚠️' : 'ℹ️'}
          </span>
          <span className="banner-text">
            <strong>{alertSummary.label}:</strong> {visibleAlerts.length} active weather alert{visibleAlerts.length > 1 ? 's' : ''} for {cityName}. See below for details.
          </span>
        </div>
      )}

      {/* ── Loading Skeleton ── */}
      {loading && !weatherData && (
        <div className="skeleton-wrap">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* ── Error ── */}
      {error && !loading && (
        <div className="state-box error-box">
          <span className="state-icon">⚠️</span>
          <h2>Connection Error</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={handleManualRefresh}>
            Try Again
          </button>
        </div>
      )}

      {/* ── Main Content ── */}
      {!loading && !error && weatherData && (
        <div className={`dashboard-content${refreshing ? ' is-refreshing' : ''}`}>

          {/* ── Section 1: Current Weather ── */}
          <section className={`card${temp !== undefined ? ` ${getTempClass(temp)}` : ''}`}>
            <div className="section-title-row">
              <h2 className="section-title">🌡️ Current Weather</h2>
              <div className="section-meta">
                <span className="location-badge">📍 {cityName}</span>
                {lastUpdated && (
                  <span className="updated-time">
                    {refreshing ? '⟳ Updating…' : `Updated ${lastUpdated.toLocaleTimeString()}`}
                  </span>
                )}
                <button
                  className={`btn-refresh${refreshing ? ' btn-spinning' : ''}`}
                  onClick={handleManualRefresh}
                  disabled={refreshing}
                  aria-label="Refresh weather data"
                >
                  ↻ Refresh
                </button>
              </div>
            </div>

            <div className="weather-main-row">
              <div className="weather-hero">
                <span className="weather-icon">{getWeatherIcon(weatherData.condition || weatherData.weather)}</span>
                <div className="temp-block">
                  <span className="temp-value">{temp ?? '—'}</span>
                  <span className="temp-unit">°C</span>
                </div>
                <span className="condition-label">{weatherData.condition || weatherData.weather || 'Unknown'}</span>
              </div>

              <div className="weather-details">
                <div className="detail-item">
                  <span className="detail-icon">💧</span>
                  <span className="detail-label">Humidity</span>
                  <span className="detail-value">{weatherData.humidity ?? weatherData.humidity_percent ?? '—'}%</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🌡️</span>
                  <span className="detail-label">Feels Like</span>
                  <span className="detail-value">{weatherData.feels_like ?? temp ?? '—'}°C</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🌬️</span>
                  <span className="detail-label">Wind Speed</span>
                  <span className="detail-value">{weatherData.wind_speed ?? '0'} km/h</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">👁️</span>
                  <span className="detail-label">Visibility</span>
                  <span className="detail-value">{weatherData.visibility ?? '10'} km</span>
                </div>
                {(weatherData.pressure != null) && (
                  <div className="detail-item">
                    <span className="detail-icon">🔵</span>
                    <span className="detail-label">Pressure</span>
                    <span className="detail-value">{weatherData.pressure} hPa</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ── Section 2: Weather Alerts ── */}
          <section className="card">
            <div className="section-title-row">
              <h2 className="section-title">🚨 Weather Alerts</h2>
              {visibleAlerts.length > 0 && (
                <span className={`alert-badge badge-${alertSummary?.color}`}>
                  {visibleAlerts.length} active
                </span>
              )}
            </div>

            {visibleAlerts.length === 0 ? (
              <div className="no-alerts">
                <span className="no-alerts-icon">✅</span>
                <div>
                  <p className="no-alerts-title">All Clear</p>
                  <p className="no-alerts-sub">No active alerts — conditions are normal for {cityName}.</p>
                </div>
              </div>
            ) : (
              <div className="alerts-list">
                {visibleAlerts.map((alert, index) => (
                  <AlertBox
                    key={index}
                    type={alert.type}
                    severity={alert.severity}
                    title={alert.title}
                    message={alert.message}
                    actions={alert.actions}
                    timestamp={alert.timestamp}
                    onClose={() => handleDismissAlert(index)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ── Section 3: Recent Temperature Trend ── */}
          {(historyLoading || chartPoints.length > 0) && (
            <section className="card">
              <div className="section-title-row">
                <h2 className="section-title">📈 Recent Trend</h2>
                <span className="location-badge">📍 {cityName} — Last 24 records</span>
              </div>
              {historyLoading ? (
                <div className="sk-row sk-wide" style={{ height: 220 }} />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartPoints} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line
                      type="monotone" dataKey="temp" name="Temp (°C)"
                      stroke="#667eea" strokeWidth={2} dot={false} activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone" dataKey="humidity" name="Humidity (%)"
                      stroke="#48bb78" strokeWidth={2} dot={false} activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </section>
          )}

          {/* ── Section 4: Multi-City Quick Compare ── */}
          {(Object.keys(multiCityData).length > 0 || multiCityLoading) && (
            <section className="card">
              <div className="section-title-row">
                <h2 className="section-title">🌍 City Compare</h2>
                <button
                  className="btn-refresh"
                  onClick={fetchMultiCity}
                  disabled={multiCityLoading}
                >
                  {multiCityLoading ? '⟳ Loading…' : '↻ Refresh'}
                </button>
              </div>
              {multiCityLoading ? (
                <div className="city-compare-grid">
                  {COMPARE_CITIES.map(c => <div key={c} className="compare-skeleton" />)}
                </div>
              ) : (
                <div className="city-compare-grid">
                  {COMPARE_CITIES.map(city => {
                    const d = multiCityData[city]
                    if (!d) return null
                    const t    = d.temperature ?? d.temp
                    const cond = d.condition || d.weather || 'Unknown'
                    return (
                      <div
                        key={city}
                        className={`compare-card${city === selectedCity ? ' compare-card-active' : ''}`}
                      >
                        <div className="compare-city">{city}</div>
                        <div className="compare-icon">{getWeatherIcon(cond)}</div>
                        <div className={`compare-temp${t !== undefined ? ` ${getTempClass(t)}` : ''}`}>
                          {t ?? '—'}°C
                        </div>
                        <div className="compare-cond">{cond}</div>
                        <div className="compare-meta">
                          <span>💧 {d.humidity ?? d.humidity_percent ?? '—'}%</span>
                          <span>🌬️ {d.wind_speed ?? 0} km/h</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          )}

        </div>
      )}

    </div>
  )
}

export default Dashboard
