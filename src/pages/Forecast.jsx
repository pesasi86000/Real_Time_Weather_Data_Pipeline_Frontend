import { useState } from 'react'
import AlertBox from '../components/AlertBox'
import { checkWeatherAlerts } from '../utils/weatherAlerts'
import './Forecast.css'

// Build dates starting from today (May 3, 2026)
const today = new Date(2026, 4, 3) // May 3 2026
const forecastData = [
  { day: 'Monday',    icon: '☀️',  high: 24, low: 18, condition: 'Sunny',           humidity: 45, wind_speed: 12, uv: 7  },
  { day: 'Tuesday',   icon: '⛅',  high: 22, low: 16, condition: 'Partly Cloudy',   humidity: 50, wind_speed: 18, uv: 5  },
  { day: 'Wednesday', icon: '🌧️', high: 19, low: 14, condition: 'Rainy',            humidity: 75, wind_speed: 25, uv: 2  },
  { day: 'Thursday',  icon: '⛈️', high: 18, low: 13, condition: 'Thunderstorm',     humidity: 80, wind_speed: 55, uv: 1  },
  { day: 'Friday',    icon: '☁️',  high: 20, low: 15, condition: 'Cloudy',           humidity: 60, wind_speed: 15, uv: 3  },
  { day: 'Saturday',  icon: '🌤️', high: 23, low: 17, condition: 'Partly Sunny',     humidity: 55, wind_speed: 10, uv: 6  },
  { day: 'Sunday',    icon: '☀️',  high: 34, low: 22, condition: 'Clear',            humidity: 38, wind_speed: 8,  uv: 10 },
].map((d, i) => {
  const date = new Date(today)
  date.setDate(today.getDate() + i)
  return {
    ...d,
    temp: d.high,
    dateLabel: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }
})

function getSeverityDot(alerts) {
  if (!alerts.length) return null
  const hasCritical = alerts.some(a => a.severity === 'critical')
  const hasHigh     = alerts.some(a => a.severity === 'high')
  const hasMedium   = alerts.some(a => a.severity === 'medium')
  if (hasCritical) return 'dot-critical'
  if (hasHigh)     return 'dot-high'
  if (hasMedium)   return 'dot-medium'
  return 'dot-low'
}

function Forecast() {
  const [activeDay, setActiveDay] = useState(null)

  const dayAlerts = forecastData.map(day => checkWeatherAlerts({
    temperature: day.temp,
    condition: day.condition,
    humidity: day.humidity,
    wind_speed: day.wind_speed,
  }))

  const handleCardClick = (index) => {
    setActiveDay(prev => prev === index ? null : index)
  }

  const totalAlerts = dayAlerts.reduce((sum, a) => sum + a.length, 0)
  const criticalDays = dayAlerts.filter(a => a.some(x => x.severity === 'critical')).length

  return (
    <div className="forecast-page">
      <div className="forecast-header">
        <h1 className="forecast-title">7-Day Weather Forecast</h1>
        <p className="forecast-subtitle">Plan your week with accurate predictions</p>
        {totalAlerts > 0 && (
          <div className="forecast-alert-summary">
            <span>⚠️</span>
            <span>
              {criticalDays > 0
                ? `${criticalDays} day${criticalDays > 1 ? 's' : ''} with critical alerts — click any card for details`
                : `${totalAlerts} weather advisory${totalAlerts > 1 ? 's' : ''} this week — click any card for details`
              }
            </span>
          </div>
        )}
      </div>

      <div className="forecast-content">
        <div className="forecast-grid">
          {forecastData.map((day, index) => {
            const alerts = dayAlerts[index]
            const dotClass = getSeverityDot(alerts)
            const isActive = activeDay === index

            return (
              <div key={index}>
                <button
                  className={`forecast-card${isActive ? ' forecast-card-active' : ''}`}
                  onClick={() => handleCardClick(index)}
                  aria-expanded={isActive}
                  aria-label={`${day.day}: ${day.condition}, High ${day.high}°C Low ${day.low}°C${alerts.length ? `, ${alerts.length} alert${alerts.length > 1 ? 's' : ''}` : ''}`}
                >
                  {dotClass && (
                    <span className={`severity-dot ${dotClass}`} aria-hidden="true" />
                  )}
                  <div className="forecast-date-label">{day.dateLabel}</div>
                  <div className="forecast-day">{day.day}</div>
                  <div className="forecast-icon">{day.icon}</div>
                  <div className="forecast-condition">{day.condition}</div>
                  <div className="forecast-temp-range">
                    <span className="forecast-temp-high">{day.high}°</span>
                    <span className="forecast-temp-sep">/</span>
                    <span className="forecast-temp-low">{day.low}°</span>
                  </div>
                  <div className="forecast-stats-row">
                    <span className="forecast-stat">
                      <span className="forecast-stat-icon">💧</span>
                      {day.humidity}%
                    </span>
                    <span className="forecast-stat">
                      <span className="forecast-stat-icon">🌬️</span>
                      {day.wind_speed} km/h
                    </span>
                  </div>
                  {alerts.length > 0 && (
                    <div className="forecast-alert-hint">
                      {alerts.length} alert{alerts.length > 1 ? 's' : ''} {isActive ? '▲' : '▼'}
                    </div>
                  )}
                </button>

                {isActive && alerts.length > 0 && (
                  <div className="forecast-day-alerts">
                    {alerts.map((alert, i) => (
                      <AlertBox
                        key={i}
                        type={alert.type}
                        severity={alert.severity}
                        title={alert.title}
                        message={alert.message}
                        actions={alert.actions}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="forecast-info">
          <div className="info-card">
            <h3>📅 Weekly Overview</h3>
            <p>Temperatures range <strong>18°C–34°C</strong> this week. Expect rain on Wednesday, a thunderstorm Thursday, and clear skies through the weekend.</p>
          </div>
          <div className="info-card">
            <h3>⚠️ Key Alerts</h3>
            <p>Thunderstorm and high-wind warning for Thursday. High heat advisory on Sunday. Stay updated and click each day card for safety tips.</p>
          </div>
          <div className="info-card">
            <h3>💡 Tips</h3>
            <p>Carry an umbrella for Wednesday and Thursday. Apply sunscreen on Sunday — it will be very hot. Weekend mornings are ideal for outdoor exercise.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Forecast
