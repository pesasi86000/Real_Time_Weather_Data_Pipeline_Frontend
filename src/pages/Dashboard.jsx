import { useState, useEffect } from 'react'
import AlertBox from '../components/AlertBox'
import { checkWeatherAlerts } from '../utils/weatherAlerts'
import './Dashboard.css'

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

function Dashboard() {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [selectedCity, setSelectedCity] = useState('London')
  const [alerts, setAlerts] = useState([])
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set())

  const fetchWeatherData = async (city = selectedCity) => {
    try {
      setLoading(true)
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
      setLoading(false)
    } catch (err) {
      setError(err.message || 'Unable to connect to backend. Please make sure the server is running at http://127.0.0.1:5000')
      setLoading(false)
    }
  }

  const handleCityChange = (e) => {
    const city = e.target.value
    setSelectedCity(city)
    fetchWeatherData(city)
  }

  const handleDismissAlert = (index) => {
    setDismissedAlerts(prev => new Set([...prev, index]))
  }

  useEffect(() => {
    fetchWeatherData(selectedCity)
    const interval = setInterval(() => fetchWeatherData(selectedCity), 300000)
    return () => clearInterval(interval)
  }, [])

  const visibleAlerts = alerts.filter((_, i) => !dismissedAlerts.has(i))
  const cityName = weatherData?.title || weatherData?.location || weatherData?.city || selectedCity

  return (
    <div className="dashboard-page">

      {/* ── Header ── */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Weather Dashboard</h1>
          <p className="dashboard-subtitle">Real-time weather monitoring</p>
        </div>
        <div className="city-selector">
          <label htmlFor="city-dropdown">City</label>
          <select
            id="city-dropdown"
            value={selectedCity}
            onChange={handleCityChange}
          >
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && !weatherData && (
        <div className="state-box">
          <div className="spinner" />
          <p>Fetching weather data…</p>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="state-box error-box">
          <span className="state-icon">⚠️</span>
          <h2>Connection Error</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={() => fetchWeatherData(selectedCity)}>
            Try Again
          </button>
        </div>
      )}

      {/* ── Main Content ── */}
      {!loading && !error && weatherData && (
        <div className="dashboard-content">

          {/* ── Section 1: Current Weather ── */}
          <section className="card">
            <div className="section-title-row">
              <h2 className="section-title">🌡️ Current Weather</h2>
              <div className="section-meta">
                <span className="location-badge">📍 {cityName}</span>
                {lastUpdated && (
                  <span className="updated-time">Updated {lastUpdated.toLocaleTimeString()}</span>
                )}
                <button className="btn-refresh" onClick={() => fetchWeatherData(selectedCity)}>
                  ↻ Refresh
                </button>
              </div>
            </div>

            <div className="weather-main-row">
              <div className="weather-hero">
                <span className="weather-icon">{getWeatherIcon(weatherData.condition || weatherData.weather)}</span>
                <div className="temp-block">
                  <span className="temp-value">{weatherData.temperature ?? weatherData.temp ?? '—'}</span>
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
                  <span className="detail-value">{weatherData.feels_like ?? weatherData.temperature ?? '—'}°C</span>
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
                <span className="alert-badge">{visibleAlerts.length} active</span>
              )}
            </div>

            {visibleAlerts.length === 0 ? (
              <div className="no-alerts">
                <span>✅</span>
                <p>No active alerts — conditions are normal.</p>
              </div>
            ) : (
              <div className="alerts-list">
                {visibleAlerts.map((alert, index) => (
                  <AlertBox
                    key={index}
                    type={alert.type}
                    message={alert.message}
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
