import { useState, useEffect, useRef, useCallback } from 'react'
import AlertBox from '../components/AlertBox'
import { checkWeatherAlerts, getAlertSummary } from '../utils/weatherAlerts'
import './Dashboard.css'

const REFRESH_INTERVAL = 300 // seconds
const cities = [
  'London', 'New York', 'Tokyo', 'Sydney', 'Paris',
  'Dubai', 'Mumbai', 'Singapore', 'Toronto', 'Berlin'
]

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
      const response = await fetch(`http://127.0.0.1:5000/weather?city=${encodeURIComponent(city)}`)
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

  const handleCityChange = (e) => {
    const city = e.target.value
    setSelectedCity(city)
    setWeatherData(null)
    fetchWeatherData(city)
  }

  const handleManualRefresh = () => {
    fetchWeatherData(selectedCity, true)
  }

  const handleDismissAlert = (index) => {
    setDismissedAlerts(prev => new Set([...prev, index]))
  }

  useEffect(() => {
    fetchWeatherData(selectedCity)
    const interval = setInterval(() => fetchWeatherData(selectedCity, true), REFRESH_INTERVAL * 1000)
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

        </div>
      )}

    </div>
  )
}

export default Dashboard
