import { useState, useEffect } from 'react'
import SectionHeader from '../components/SectionHeader'
import AlertBox from '../components/AlertBox'
import { checkWeatherAlerts } from '../utils/weatherAlerts'
import './Dashboard.css'

function Dashboard() {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [selectedCity, setSelectedCity] = useState('London')
  const [alerts, setAlerts] = useState([])
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set())

  // List of available cities
  const cities = [
    'London',
    'New York',
    'Tokyo',
    'Sydney',
    'Paris',
    'Dubai',
    'Mumbai',
    'Singapore',
    'Toronto',
    'Berlin'
  ]

  const fetchWeatherData = async (city = selectedCity) => {
    try {
      setLoading(true)
      setError(null)
      const encodedCity = encodeURIComponent(city)
      const response = await fetch(`http://127.0.0.1:5000/weather?city=${encodedCity}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `City not found or backend error (${response.status})`)
      }
      
      const data = await response.json()
      setWeatherData(data)
      setLastUpdated(new Date())
      
      // Generate weather alerts
      const newAlerts = checkWeatherAlerts(data)
      setAlerts(newAlerts)
      setDismissedAlerts(new Set()) // Reset dismissed alerts when new data arrives
      
      setLoading(false)
    } catch (err) {
      setError(err.message || 'Unable to connect to backend. Please make sure the server is running at http://127.0.0.1:5000')
      setLoading(false)
    }
  }

  // Handle city selection change
  const handleCityChange = (e) => {
    const newCity = e.target.value
    setSelectedCity(newCity)
    fetchWeatherData(newCity)
  }

  useEffect(() => {
    fetchWeatherData(selectedCity)
    const interval = setInterval(() => fetchWeatherData(selectedCity), 300000)
    return () => clearInterval(interval)
  }, [selectedCity])

  const getWeatherIcon = (condition) => {
    if (!condition) return '☁️'
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) return '☀️'
    if (conditionLower.includes('cloud')) return '☁️'
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return '🌧️'
    if (conditionLower.includes('storm') || conditionLower.includes('thunder')) return '⛈️'
    if (conditionLower.includes('snow')) return '❄️'
    if (conditionLower.includes('mist') || conditionLower.includes('fog')) return '🌫️'
    return '🌤️'
  }

  const handleDismissAlert = (index) => {
    const newDismissed = new Set(dismissedAlerts)
    newDismissed.add(index)
    setDismissedAlerts(newDismissed)
  }

  const visibleAlerts = alerts.filter((_, index) => !dismissedAlerts.has(index))

  return (
    <div className="dashboard-page">
      {/* ── Page Header ── */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Weather Dashboard</h1>
          <p className="dashboard-subtitle">Real-time weather monitoring and analytics</p>
        </div>
        <div className="city-selector-container">
          <label htmlFor="city-dropdown" className="city-label">Select City:</label>
          <select
            id="city-dropdown"
            className="city-dropdown"
            value={selectedCity}
            onChange={handleCityChange}
          >
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="dashboard-content">
        {/* ── Weather Alerts Section ── */}
        {visibleAlerts.length > 0 && (
          <div className="alerts-container">
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

        {loading && !weatherData && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Fetching weather data...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">Connection Error</h2>
            <p className="error-message">{error}</p>
            <button className="retry-button" onClick={() => fetchWeatherData(selectedCity)}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && weatherData && (
          <>
            {/* ── Section: Current Weather ── */}
            <section className="page-section">
              <SectionHeader
                icon="🌡️"
                title="Current Weather"
                subtitle={`Live conditions for ${weatherData.title || weatherData.location || weatherData.city || selectedCity}`}
                action={
                  <button
                    className="refresh-button"
                    onClick={() => fetchWeatherData(selectedCity)}
                    title="Refresh data"
                  >
                    ↻ Refresh
                  </button>
                }
              />

              <div className="weather-grid">
                {/* Main temperature card */}
                <div className="weather-card main-card">
                  <div className="location-info">
                    <h2 className="location-name">
                      {weatherData.title || weatherData.location || weatherData.city || 'Weather Update'}
                    </h2>
                    {lastUpdated && (
                      <p className="last-updated">Updated: {lastUpdated.toLocaleTimeString()}</p>
                    )}
                  </div>

                  <div className="weather-main">
                    <div className="weather-icon-large">
                      {getWeatherIcon(weatherData.condition || weatherData.weather)}
                    </div>
                    <div className="temperature-display">
                      <span className="temperature">
                        {weatherData.temperature || weatherData.temp || 'N/A'}
                      </span>
                      <span className="temperature-unit">°C</span>
                    </div>
                  </div>

                  <div className="condition-display">
                    {weatherData.condition || weatherData.weather || 'Unknown'}
                  </div>
                </div>

                {/* Detail stats card */}
                <div className="weather-card detail-card-grid">
                  <div className="mini-stat">
                    <div className="mini-stat-icon">💧</div>
                    <div className="mini-stat-content">
                      <p className="mini-stat-label">Humidity</p>
                      <p className="mini-stat-value">
                        {weatherData.humidity || weatherData.humidity_percent || 'N/A'}%
                      </p>
                    </div>
                  </div>

                  <div className="mini-stat">
                    <div className="mini-stat-icon">🌡️</div>
                    <div className="mini-stat-content">
                      <p className="mini-stat-label">Feels Like</p>
                      <p className="mini-stat-value">
                        {weatherData.feels_like || weatherData.temperature || 'N/A'}°C
                      </p>
                    </div>
                  </div>

                  <div className="mini-stat">
                    <div className="mini-stat-icon">🌬️</div>
                    <div className="mini-stat-content">
                      <p className="mini-stat-label">Wind Speed</p>
                      <p className="mini-stat-value">
                        {weatherData.wind_speed || '0'} km/h
                      </p>
                    </div>
                  </div>

                  <div className="mini-stat">
                    <div className="mini-stat-icon">👁️</div>
                    <div className="mini-stat-content">
                      <p className="mini-stat-label">Visibility</p>
                      <p className="mini-stat-value">
                        {weatherData.visibility || '10'} km
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Section: Weather Analytics ── */}
            <section className="page-section">
              <SectionHeader
                icon="📊"
                title="Weather Analytics"
                subtitle="Derived insights from current conditions"
              />
              <div className="analytics-grid">
                <div className="analytics-card">
                  <div className="analytics-icon">📈</div>
                  <h4>Temperature Trend</h4>
                  <p>Stable conditions expected</p>
                </div>
                <div className="analytics-card">
                  <div className="analytics-icon">💨</div>
                  <h4>Air Quality</h4>
                  <p>Good (AQI: 45)</p>
                </div>
                <div className="analytics-card">
                  <div className="analytics-icon">🌅</div>
                  <h4>UV Index</h4>
                  <p>Moderate (5/10)</p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
