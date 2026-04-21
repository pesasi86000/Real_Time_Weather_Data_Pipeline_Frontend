import './Forecast.css'

function Forecast() {
  const forecastData = [
    { day: 'Monday', icon: '☀️', temp: 24, condition: 'Sunny', humidity: 45 },
    { day: 'Tuesday', icon: '⛅', temp: 22, condition: 'Partly Cloudy', humidity: 50 },
    { day: 'Wednesday', icon: '🌧️', temp: 19, condition: 'Rainy', humidity: 75 },
    { day: 'Thursday', icon: '⛈️', temp: 18, condition: 'Thunderstorm', humidity: 80 },
    { day: 'Friday', icon: '☁️', temp: 20, condition: 'Cloudy', humidity: 60 },
    { day: 'Saturday', icon: '🌤️', temp: 23, condition: 'Partly Sunny', humidity: 55 },
    { day: 'Sunday', icon: '☀️', temp: 26, condition: 'Clear', humidity: 40 },
  ]

  return (
    <div className="forecast-page">
      <div className="forecast-header">
        <h1 className="forecast-title">7-Day Weather Forecast</h1>
        <p className="forecast-subtitle">Plan your week with accurate predictions</p>
      </div>

      <div className="forecast-content">
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

        <div className="forecast-info">
          <div className="info-card">
            <h3>📅 Weekly Overview</h3>
            <p>Expect varied conditions this week with temperatures ranging from 18°C to 26°C. Midweek rain expected.</p>
          </div>
          <div className="info-card">
            <h3>⚠️ Weather Alerts</h3>
            <p>Thunderstorm warning for Thursday. Stay indoors and avoid outdoor activities during peak hours.</p>
          </div>
          <div className="info-card">
            <h3>💡 Tips</h3>
            <p>Carry an umbrella for Wednesday and Thursday. Weekend looks perfect for outdoor activities!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Forecast
