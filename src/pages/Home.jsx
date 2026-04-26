import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home-page">
      {/* ── Hero ── */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-icon">🌈</span>
            Real-Time Weather Intelligence
          </h1>
          <p className="hero-subtitle">
            Monitor live conditions, explore forecasts, and analyze historical data — all in one place.
          </p>
          <div className="hero-buttons">
            <Link to="/dashboard" className="btn btn-primary">
              View Dashboard <span className="btn-arrow">→</span>
            </Link>
            <Link to="/forecast" className="btn btn-secondary">
              7-Day Forecast
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="weather-sphere">
            <div className="sphere-layer layer-1"></div>
            <div className="sphere-layer layer-2"></div>
            <div className="sphere-layer layer-3"></div>
            <div className="sphere-icon">⛅</div>
          </div>
        </div>
      </div>

      {/* ── Quick Navigation Sections ── */}
      <div className="quick-sections">
        <Link to="/dashboard" className="quick-section-card">
          <div className="qs-icon">🌡️</div>
          <div className="qs-body">
            <h3>Current Weather</h3>
            <p>Live temperature, humidity, wind and visibility for any city</p>
          </div>
          <span className="qs-arrow">→</span>
        </Link>

        <Link to="/history" className="quick-section-card">
          <div className="qs-icon">📋</div>
          <div className="qs-body">
            <h3>Historical Data</h3>
            <p>Browse and visualize past weather records from the data pipeline</p>
          </div>
          <span className="qs-arrow">→</span>
        </Link>

        <Link to="/forecast" className="quick-section-card">
          <div className="qs-icon">📅</div>
          <div className="qs-body">
            <h3>7-Day Forecast</h3>
            <p>Plan ahead with accurate weekly weather predictions</p>
          </div>
          <span className="qs-arrow">→</span>
        </Link>
      </div>

      {/* ── Features ── */}
      <div className="features-section">
        <h2 className="section-title">Why Choose WeatherPro?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Real-Time Updates</h3>
            <p className="feature-description">
              Instant weather updates powered by our advanced data pipeline
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">Accurate Data</h3>
            <p className="feature-description">
              Precision forecasting with 99% accuracy guaranteed
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3 className="feature-title">Responsive Design</h3>
            <p className="feature-description">
              Beautiful interface that works seamlessly on all devices
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3 className="feature-title">Global Coverage</h3>
            <p className="feature-description">
              Weather data from thousands of locations worldwide
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Detailed Analytics</h3>
            <p className="feature-description">
              Comprehensive metrics and historical data analysis
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3 className="feature-title">Smart Alerts</h3>
            <p className="feature-description">
              Notifications for severe weather conditions
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">1M+</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Cities Covered</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">99.9%</div>
            <div className="stat-label">Uptime</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Monitoring</div>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="cta-section">
        <h2 className="cta-title">Ready to Experience Premium Weather Data?</h2>
        <p className="cta-subtitle">Join thousands of users who trust WeatherPro</p>
        <Link to="/dashboard" className="btn btn-large">
          Get Started Now <span className="btn-arrow">→</span>
        </Link>
      </div>
    </div>
  )
}

export default Home
