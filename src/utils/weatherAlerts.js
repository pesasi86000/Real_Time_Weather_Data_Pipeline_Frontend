/**
 * Weather Alert Utilities
 * Generate alerts based on weather conditions
 */

export const checkWeatherAlerts = (weatherData) => {
  if (!weatherData) return []

  const alerts = []
  const temp = weatherData.temperature || 0
  const condition = (weatherData.condition || '').toLowerCase()
  const humidity = weatherData.humidity || 0
  const windSpeed = weatherData.wind_speed || 0

  // Temperature alerts
  if (temp > 38) {
    alerts.push({
      type: 'error',
      message: `🔥 Extreme Heat Alert: Temperature is ${temp}°C. Stay hydrated and avoid prolonged sun exposure.`
    })
  } else if (temp > 32) {
    alerts.push({
      type: 'warning',
      message: `☀️ High Temperature: ${temp}°C. It's very hot outside. Stay hydrated!`
    })
  } else if (temp < 0) {
    alerts.push({
      type: 'error',
      message: `❄️ Freezing Alert: Temperature is ${temp}°C. Caution on icy roads!`
    })
  } else if (temp < 5) {
    alerts.push({
      type: 'warning',
      message: `🧊 Cold Weather: ${temp}°C. Wear warm clothing and bundle up!`
    })
  }

  // Severe weather conditions
  if (condition.includes('thunderstorm') || condition.includes('storm')) {
    alerts.push({
      type: 'error',
      message: '⚡ Severe Thunderstorm Warning: Avoid outdoor activities. Stay indoors!'
    })
  } else if (condition.includes('tornado')) {
    alerts.push({
      type: 'error',
      message: '🌪️ Tornado Warning: Seek shelter immediately in a safe location!'
    })
  } else if (condition.includes('hurricane') || condition.includes('cyclone')) {
    alerts.push({
      type: 'error',
      message: '🌀 Hurricane/Cyclone Warning: Follow local emergency alerts and evacuate if instructed!'
    })
  } else if (
    condition.includes('rain') ||
    condition.includes('drizzle') ||
    condition.includes('shower')
  ) {
    alerts.push({
      type: 'info',
      message: '🌧️ Rain Expected: Carry an umbrella and watch for slippery surfaces.'
    })
  } else if (condition.includes('snow')) {
    alerts.push({
      type: 'warning',
      message: '❄️ Snow Alert: Roads may be slippery. Drive with caution!'
    })
  } else if (condition.includes('fog') || condition.includes('mist')) {
    alerts.push({
      type: 'warning',
      message: '🌫️ Fog Warning: Visibility is reduced. Drive slowly with headlights on.'
    })
  } else if (condition.includes('clear') || condition.includes('sunny')) {
    alerts.push({
      type: 'success',
      message: '☀️ Beautiful Weather: Clear skies ahead. Perfect for outdoor activities!'
    })
  } else if (condition.includes('cloudy') || condition.includes('overcast')) {
    alerts.push({
      type: 'info',
      message: '☁️ Cloudy: Moderate cloud coverage. UV protection still recommended.'
    })
  }

  // Wind speed alerts
  if (windSpeed > 60) {
    alerts.push({
      type: 'error',
      message: `💨 Severe Wind Alert: Wind speed ${windSpeed} km/h. Secure loose items and avoid travel!`
    })
  } else if (windSpeed > 40) {
    alerts.push({
      type: 'warning',
      message: `🌬️ High Wind: ${windSpeed} km/h. Caution when traveling and securing outdoor items.`
    })
  }

  // Humidity alerts
  if (humidity > 80) {
    alerts.push({
      type: 'info',
      message: `💧 High Humidity: ${humidity}%. The air feels muggy and uncomfortable.`
    })
  } else if (humidity < 30) {
    alerts.push({
      type: 'info',
      message: `🏜️ Low Humidity: ${humidity}%. Dry conditions - use moisturizer and stay hydrated.`
    })
  }

  return alerts
}

/**
 * Get air quality alert if available
 */
export const checkAirQualityAlert = (aqi) => {
  if (!aqi) return null

  if (aqi > 300) {
    return {
      type: 'error',
      message: '🚫 Hazardous Air Quality: Avoid outdoor activities. Wear N95 masks if you must go out.'
    }
  } else if (aqi > 200) {
    return {
      type: 'error',
      message: '⚠️ Very Unhealthy Air: Sensitive groups should avoid prolonged outdoor exposure.'
    }
  } else if (aqi > 150) {
    return {
      type: 'warning',
      message: '🫁 Unhealthy Air Quality: Members of sensitive groups should limit outdoor activities.'
    }
  } else if (aqi > 100) {
    return {
      type: 'warning',
      message: '⚠️ Moderate Air Quality: Sensitive individuals should reduce prolonged outdoor exposure.'
    }
  } else if (aqi > 50) {
    return {
      type: 'info',
      message: '✅ Good Air Quality: Air quality is satisfactory. Safe for outdoor activities.'
    }
  }

  return null
}
