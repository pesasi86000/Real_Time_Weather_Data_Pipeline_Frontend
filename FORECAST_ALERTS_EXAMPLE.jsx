// Example: Enhanced Forecast.jsx with Weather Alerts
// This is an example showing how to integrate alerts into the Forecast page

import { useState } from 'react'
import AlertBox from '../components/AlertBox'
import './Forecast.css'

function ForecastWithAlerts() {
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set())

  // Example forecast data with daily alerts
  const forecastData = [
    { day: 'Monday', icon: '☀️', temp: 24, condition: 'Sunny', humidity: 45 },
    { day: 'Tuesday', icon: '⛅', temp: 22, condition: 'Partly Cloudy', humidity: 50 },
    { day: 'Wednesday', icon: '🌧️', temp: 19, condition: 'Rainy', humidity: 75 },
    { day: 'Thursday', icon: '⛈️', temp: 18, condition: 'Thunderstorm', humidity: 80 },
    { day: 'Friday', icon: '☁️', temp: 20, condition: 'Cloudy', humidity: 60 },
    { day: 'Saturday', icon: '🌤️', temp: 23, condition: 'Partly Sunny', humidity: 55 },
    { day: 'Sunday', icon: '☀️', temp: 26, condition: 'Clear', humidity: 40 },
  ]

  // Weekly forecast alerts
  const weeklyAlerts = [
    {
      type: 'info',
      message: '🌧️ Rain Expected: Wednesday brings showers. Carry an umbrella!'
    },
    {
      type: 'warning',
      message: '⚡ Thunderstorm Warning: Thursday afternoon thunderstorms expected. Stay indoors!'
    },
    {
      type: 'success',
      message: '☀️ Perfect Weekend: Clear skies expected Saturday and Sunday. Great for outdoor activities!'
    }
  ]

  const handleDismissAlert = (index) => {
    const newDismissed = new Set(dismissedAlerts)
    newDismissed.add(index)
    setDismissedAlerts(newDismissed)
  }

  const visibleAlerts = weeklyAlerts.filter((_, index) => !dismissedAlerts.has(index))

  return (
    <div className="forecast-page">
      {/* Forecast Header */}
      <div className="forecast-header">
        <h1 className="forecast-title">7-Day Weather Forecast</h1>
        <p className="forecast-subtitle">Plan your week with accurate predictions</p>
      </div>

      <div className="forecast-content">
        {/* Alerts Section */}
        {visibleAlerts.length > 0 && (
          <div className="alerts-container" style={{ marginBottom: '32px' }}>
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

        {/* Forecast Grid */}
        <div className="forecast-grid">
          {forecastData.map((day, index) => (
            <div key={index} className="forecast-card">
              <div className="forecast-day">{day.day}</div>
              <div className="forecast-icon">{day.icon}</div>
              <div className="forecast-temp">{day.temp}°C</div>
              <div className="forecast-condition">{day.condition}</div>
              <div className="forecast-humidity">
                <span className="humidity-icon">💧</span>
                {day.humidity}%
              </div>
            </div>
          ))}
        </div>

        {/* Information Cards */}
        <div className="forecast-info">
          <div className="info-card">
            <h3>📅 Weekly Overview</h3>
            <p>Expect varied conditions this week with temperatures ranging from 18°C to 26°C. Midweek rain expected.</p>
          </div>
          <div className="info-card">
            <h3>💡 Packing Tips</h3>
            <p>Bring an umbrella for Wednesday. Wear warm clothes for Thursday. Sunscreen recommended for the weekend!</p>
          </div>
          <div className="info-card">
            <h3>✈️ Travel Tips</h3>
            <p>Best days for travel: Monday, Saturday, Sunday. Avoid traveling Thursday due to thunderstorms.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForecastWithAlerts
