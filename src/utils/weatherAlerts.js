/**
 * Weather Alert Utilities
 * Generate alerts based on weather conditions
 */

/**
 * Severity levels: 'critical' | 'high' | 'medium' | 'low'
 * These map to alert types: critical→error, high→error, medium→warning, low→info/success
 */
export const checkWeatherAlerts = (weatherData) => {
  if (!weatherData) return []

  const alerts = []
  const temp = weatherData.temperature ?? weatherData.temp ?? 0
  const condition = (weatherData.condition || weatherData.weather || '').toLowerCase()
  const humidity = weatherData.humidity ?? weatherData.humidity_percent ?? 0
  const windSpeed = weatherData.wind_speed ?? 0
  const now = new Date()

  // ── Temperature alerts ──────────────────────────────────────
  if (temp > 38) {
    alerts.push({
      type: 'error',
      severity: 'critical',
      title: 'Extreme Heat Alert',
      message: `🔥 Temperature is ${temp}°C — dangerously hot. Stay indoors during peak hours, stay hydrated, and never leave children or pets in vehicles.`,
      actions: ['Drink water every 15–20 min', 'Avoid direct sunlight 11 AM–3 PM', 'Wear light, loose-fitting clothing'],
      timestamp: now,
    })
  } else if (temp > 32) {
    alerts.push({
      type: 'warning',
      severity: 'high',
      title: 'High Temperature Warning',
      message: `☀️ Temperature is ${temp}°C. It's very hot — stay hydrated and take breaks in cool areas.`,
      actions: ['Drink plenty of fluids', 'Use sunscreen SPF 30+', 'Check on elderly neighbors'],
      timestamp: now,
    })
  } else if (temp < 0) {
    alerts.push({
      type: 'error',
      severity: 'critical',
      title: 'Freezing Temperature Alert',
      message: `❄️ Temperature is ${temp}°C — below freezing. Icy roads and hypothermia risk. Dress in layers and limit exposure.`,
      actions: ['Wear insulated, waterproof clothing', 'Watch for black ice', 'Check pipes for freezing'],
      timestamp: now,
    })
  } else if (temp < 5) {
    alerts.push({
      type: 'warning',
      severity: 'medium',
      title: 'Cold Weather Advisory',
      message: `🧊 Temperature is ${temp}°C. Bundle up and be cautious of early-morning frost.`,
      actions: ['Wear warm layers', 'Allow extra travel time', 'Keep emergency kit in vehicle'],
      timestamp: now,
    })
  }

  // ── Severe weather conditions ────────────────────────────────
  if (condition.includes('thunderstorm') || condition.includes('storm')) {
    alerts.push({
      type: 'error',
      severity: 'critical',
      title: 'Severe Thunderstorm Warning',
      message: '⚡ Active thunderstorm detected. Stay indoors away from windows and avoid high ground or open fields.',
      actions: ['Stay indoors', 'Unplug sensitive electronics', 'Avoid using landline phones', 'Do not shelter under trees'],
      timestamp: now,
    })
  } else if (condition.includes('tornado')) {
    alerts.push({
      type: 'error',
      severity: 'critical',
      title: 'Tornado Warning',
      message: '🌪️ Tornado warning active. Seek shelter immediately in a basement or interior room on the lowest floor.',
      actions: ['Go to lowest floor immediately', 'Cover head with hands', 'Avoid windows', 'Monitor emergency broadcasts'],
      timestamp: now,
    })
  } else if (condition.includes('hurricane') || condition.includes('cyclone')) {
    alerts.push({
      type: 'error',
      severity: 'critical',
      title: 'Hurricane / Cyclone Warning',
      message: '🌀 Hurricane or cyclone conditions expected. Follow official evacuation orders and secure your property.',
      actions: ['Follow local evacuation orders', 'Stock emergency supplies (72h)', 'Secure outdoor furniture', 'Charge all devices'],
      timestamp: now,
    })
  } else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
    alerts.push({
      type: 'info',
      severity: 'low',
      title: 'Rain Advisory',
      message: '🌧️ Rain is expected. Carry an umbrella and watch for slippery surfaces.',
      actions: ['Carry an umbrella', 'Allow extra commute time', 'Watch for flooded roads'],
      timestamp: now,
    })
  } else if (condition.includes('snow')) {
    alerts.push({
      type: 'warning',
      severity: 'high',
      title: 'Snow Alert',
      message: '❄️ Snowfall expected. Roads may be slippery — drive with caution and allow extra stopping distance.',
      actions: ['Reduce driving speed', 'Check tyre pressure', 'Carry snow chains/grips', 'Dress in waterproof layers'],
      timestamp: now,
    })
  } else if (condition.includes('fog') || condition.includes('mist')) {
    alerts.push({
      type: 'warning',
      severity: 'medium',
      title: 'Fog Warning',
      message: '🌫️ Dense fog is reducing visibility. Use low-beam headlights and increase following distance.',
      actions: ['Use low-beam headlights', 'Reduce speed significantly', 'Increase following distance to 4+ seconds'],
      timestamp: now,
    })
  } else if (condition.includes('clear') || condition.includes('sunny')) {
    alerts.push({
      type: 'success',
      severity: 'low',
      title: 'Clear Conditions',
      message: '☀️ Clear skies ahead — perfect for outdoor activities! Remember your sunscreen.',
      actions: ['Apply sunscreen SPF 30+', 'Great day for exercise outdoors', 'Stay hydrated'],
      timestamp: now,
    })
  } else if (condition.includes('cloudy') || condition.includes('overcast')) {
    alerts.push({
      type: 'info',
      severity: 'low',
      title: 'Cloudy Skies',
      message: '☁️ Overcast conditions with moderate cloud coverage. UV rays can still penetrate clouds.',
      actions: ['UV protection still recommended', 'Rain possible later — check updates'],
      timestamp: now,
    })
  }

  // ── Wind speed alerts ────────────────────────────────────────
  if (windSpeed > 60) {
    alerts.push({
      type: 'error',
      severity: 'critical',
      title: 'Severe Wind Alert',
      message: `💨 Wind speed ${windSpeed} km/h — dangerous gusts. Avoid travel and secure all outdoor items immediately.`,
      actions: ['Stay indoors', 'Secure outdoor furniture', 'Avoid bridges and elevated roads', 'Watch for falling debris'],
      timestamp: now,
    })
  } else if (windSpeed > 40) {
    alerts.push({
      type: 'warning',
      severity: 'high',
      title: 'High Wind Advisory',
      message: `🌬️ Wind speed ${windSpeed} km/h. Exercise caution when driving high-sided vehicles and secure loose items.`,
      actions: ['Secure outdoor furniture', 'Caution when driving', 'Be alert for fallen branches'],
      timestamp: now,
    })
  }

  // ── Humidity alerts ──────────────────────────────────────────
  if (humidity > 85) {
    alerts.push({
      type: 'warning',
      severity: 'medium',
      title: 'Very High Humidity',
      message: `💧 Humidity at ${humidity}% — heat index significantly elevated. The air feels much hotter than the temperature indicates.`,
      actions: ['Limit strenuous outdoor activity', 'Wear moisture-wicking fabrics', 'Take cool showers to lower body temp'],
      timestamp: now,
    })
  } else if (humidity > 70) {
    alerts.push({
      type: 'info',
      severity: 'low',
      title: 'High Humidity',
      message: `💧 Humidity at ${humidity}%. The air feels muggy and uncomfortable.`,
      actions: ['Stay in air-conditioned spaces when possible', 'Drink extra water'],
      timestamp: now,
    })
  } else if (humidity < 25) {
    alerts.push({
      type: 'warning',
      severity: 'medium',
      title: 'Very Low Humidity',
      message: `🏜️ Humidity at ${humidity}% — very dry air. Increased fire risk and respiratory irritation possible.`,
      actions: ['Use a humidifier indoors', 'Apply lip balm and moisturiser', 'Stay hydrated', 'Fire risk elevated'],
      timestamp: now,
    })
  } else if (humidity < 35) {
    alerts.push({
      type: 'info',
      severity: 'low',
      title: 'Low Humidity',
      message: `🏜️ Humidity at ${humidity}%. Dry conditions — use moisturiser and stay hydrated.`,
      actions: ['Drink water regularly', 'Use moisturiser to prevent dry skin'],
      timestamp: now,
    })
  }

  // Sort: critical first, then high, medium, low
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
  alerts.sort((a, b) => (severityOrder[a.severity] ?? 4) - (severityOrder[b.severity] ?? 4))

  return alerts
}

/**
 * Returns a summary label for an array of alerts (highest severity).
 */
export const getAlertSummary = (alerts) => {
  if (!alerts || alerts.length === 0) return null
  const hasCritical = alerts.some(a => a.severity === 'critical')
  const hasHigh = alerts.some(a => a.severity === 'high')
  const hasMedium = alerts.some(a => a.severity === 'medium')
  if (hasCritical) return { label: 'Critical Alert', color: 'critical' }
  if (hasHigh) return { label: 'High Alert', color: 'high' }
  if (hasMedium) return { label: 'Advisory', color: 'medium' }
  return { label: 'Advisory', color: 'low' }
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
