import { useState } from 'react'
import AlertBox from '../components/AlertBox'
import { checkWeatherAlerts } from '../utils/weatherAlerts'
import './Forecast.css'

const forecastData = [
  { day: 'Monday',    icon: '☀️',  temp: 24, condition: 'Sunny',           humidity: 45, wind_speed: 12 },
  { day: 'Tuesday',   icon: '⛅',  temp: 22, condition: 'Partly Cloudy',   humidity: 50, wind_speed: 18 },
  { day: 'Wednesday', icon: '🌧️', temp: 19, condition: 'Rainy',            humidity: 75, wind_speed: 25 },
  { day: 'Thursday',  icon: '⛈️', temp: 18, condition: 'Thunderstorm',     humidity: 80, wind_speed: 55 },
  { day: 'Friday',    icon: '☁️',  temp: 20, condition: 'Cloudy',           humidity: 60, wind_speed: 15 },
  { day: 'Saturday',  icon: '🌤️', temp: 23, condition: 'Partly Sunny',     humidity: 55, wind_speed: 10 },
  { day: 'Sunday',    icon: '☀️',  temp: 34, condition: 'Clear',            humidity: 38, wind_speed: 8  },
]

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
                  aria-label={`${day.day}: ${day.condition}, ${day.temp}°C${alerts.length ? `, ${alerts.length} alert${alerts.length > 1 ? 's' : ''}` : ''}`}
                >
                  {dotClass && (
                    <span className={`severity-dot ${dotClass}`} aria-hidden="true" />
                  )}
                  <div className="forecast-day">{day.day}</div>
                  <div className="forecast-icon">{day.icon}</div>
                  <div className="forecast-temp">{day.temp}°C</div>
                  <div className="forecast-condition">{day.condition}</div>
                  <div className="forecast-humidity">
                    <span className="humidity-icon">💧</span>
                    {day.humidity}%
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
            <p>Expect varied conditions this week with temperatures ranging from 18°C to 34°C. Midweek rain and a Thursday thunderstorm warning.</p>
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
