# Weather Alerts System

Simple weather alert components for displaying warning, error, and success messages in your React weather application.

## Features

- **AlertBox Component**: Reusable alert display component with multiple types (success, error, warning, info)
- **Weather Alerts Utility**: Automatic alert generation based on weather conditions
- **Visual Feedback**: Color-coded alerts with icons and smooth animations
- **Dismissible Alerts**: Users can close individual alerts

## Usage

### 1. Import the AlertBox Component

```jsx
import AlertBox from '../components/AlertBox'
```

### 2. Import Weather Alert Utilities

```jsx
import { checkWeatherAlerts, checkAirQualityAlert } from '../utils/weatherAlerts'
```

### 3. Generate Alerts from Weather Data

```jsx
const [alerts, setAlerts] = useState([])
const [dismissedAlerts, setDismissedAlerts] = useState(new Set())

// When you fetch weather data
const data = await fetchWeatherData()
const newAlerts = checkWeatherAlerts(data)
setAlerts(newAlerts)
```

### 4. Display Alerts in JSX

```jsx
{alerts.map((alert, index) => (
  <AlertBox
    key={index}
    type={alert.type}
    message={alert.message}
    onClose={() => handleDismissAlert(index)}
  />
))}
```

## Alert Types

### AlertBox Component Props

| Prop      | Type     | Description                              |
|-----------|----------|------------------------------------------|
| `type`    | string   | 'success', 'error', 'warning', 'info'   |
| `message` | string   | Alert message to display                 |
| `onClose` | function | Callback when alert is dismissed         |

## Alert Generation Functions

### checkWeatherAlerts(weatherData)

Analyzes weather data and returns an array of alert objects with the following structure:

```javascript
{
  type: 'error' | 'warning' | 'info' | 'success',
  message: string
}
```

**Conditions Checked:**
- Temperature extremes (>38°C, <0°C)
- Severe weather (thunderstorms, tornadoes, hurricanes)
- Wind speed alerts (>60 km/h, >40 km/h)
- Precipitation (rain, snow, fog)
- Humidity extremes (>80%, <30%)

**Example:**
```jsx
const weatherData = {
  temperature: 42,
  condition: 'Clear',
  humidity: 25,
  wind_speed: 45
}

const alerts = checkWeatherAlerts(weatherData)
// Returns:
// [
//   { type: 'error', message: '🔥 Extreme Heat Alert: ...' },
//   { type: 'info', message: '🏜️ Low Humidity: ...' },
//   { type: 'warning', message: '🌬️ High Wind: ...' }
// ]
```

### checkAirQualityAlert(aqi)

Generates an alert based on Air Quality Index (AQI) value.

```jsx
const alert = checkAirQualityAlert(250)
// Returns:
// { type: 'error', message: '⚠️ Very Unhealthy Air: ...' }
```

## Dashboard Integration Example

The Dashboard component already integrates weather alerts. Here's how it works:

```jsx
import AlertBox from '../components/AlertBox'
import { checkWeatherAlerts } from '../utils/weatherAlerts'

function Dashboard() {
  const [alerts, setAlerts] = useState([])
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set())

  const fetchWeatherData = async (city) => {
    const data = await fetch(`/api/weather?city=${city}`)
    const weatherData = await data.json()
    
    // Generate alerts
    const newAlerts = checkWeatherAlerts(weatherData)
    setAlerts(newAlerts)
    setDismissedAlerts(new Set()) // Reset dismissed alerts
  }

  const handleDismissAlert = (index) => {
    const newDismissed = new Set(dismissedAlerts)
    newDismissed.add(index)
    setDismissedAlerts(newDismissed)
  }

  const visibleAlerts = alerts.filter((_, index) => !dismissedAlerts.has(index))

  return (
    <div className="dashboard-content">
      {/* Display alerts */}
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
      {/* Rest of dashboard content */}
    </div>
  )
}
```

## Styling

Alert styles are defined in `AlertBox.css`. You can customize:

- Colors for each alert type
- Padding and margins
- Font sizes
- Animation timing
- Border styling

## Files Included

1. **components/AlertBox.jsx** - Alert display component
2. **components/AlertBox.css** - Alert styling
3. **utils/weatherAlerts.js** - Weather alert generation logic

## Example Weather Alerts

### Extreme Heat
```
🔥 Extreme Heat Alert: Temperature is 42°C. Stay hydrated and avoid prolonged sun exposure.
```

### Severe Weather
```
⚡ Severe Thunderstorm Warning: Avoid outdoor activities. Stay indoors!
```

### High Humidity
```
💧 High Humidity: 85%. The air feels muggy and uncomfortable.
```

### Good Conditions
```
☀️ Beautiful Weather: Clear skies ahead. Perfect for outdoor activities!
```

## Integration with Other Pages

To add alerts to other pages like Forecast.jsx:

```jsx
import AlertBox from '../components/AlertBox'

function Forecast() {
  const [alerts, setAlerts] = useState([
    {
      type: 'warning',
      message: '⚠️ Thunderstorm warning for Thursday. Stay indoors and avoid outdoor activities during peak hours.'
    }
  ])

  return (
    <div className="forecast-page">
      <div className="alerts-container">
        {alerts.map((alert, index) => (
          <AlertBox key={index} type={alert.type} message={alert.message} />
        ))}
      </div>
      {/* Rest of forecast content */}
    </div>
  )
}
```

## Customization

To add more weather conditions or customize alert messages, edit `/src/utils/weatherAlerts.js` and add your logic in the `checkWeatherAlerts()` function.

Example:
```javascript
// Add custom alert for your own condition
if (weatherData.custom_condition) {
  alerts.push({
    type: 'warning',
    message: 'Your custom alert message here'
  })
}
```
