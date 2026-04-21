import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-icon">🌈</span>
            Real-Time Weather Intelligence
          </h1>
          <p className="hero-subtitle">
            Experience weather data like never before with our cutting-edge real-time pipeline
          </p>
          <div className="hero-buttons">
            <Link to="/dashboard" className="btn btn-primary">
              View Dashboard
              <span className="btn-arrow">→</span>
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

      <div className="features-section">
        <h2 className="section-title">Why Choose WeatherPro?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Real-Time Updates</h3>
            <p className="feature-description">
              Get instant weather updates powered by our advanced data pipeline
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">Accurate Data</h3>
            <p className="feature-description">
              Precision weather forecasting with 99% accuracy guaranteed
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3 className="feature-title">Responsive Design</h3>
            <p className="feature-description">
              Beautiful interface that works seamlessly on all your devices
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3 className="feature-title">Global Coverage</h3>
            <p className="feature-description">
              Access weather data from thousands of locations worldwide
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Detailed Analytics</h3>
            <p className="feature-description">
              Comprehensive weather metrics and historical data analysis
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3 className="feature-title">Smart Alerts</h3>
            <p className="feature-description">
              Receive notifications for severe weather conditions
            </p>
          </div>
        </div>
      </div>

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

      <div className="cta-section">
        <h2 className="cta-title">Ready to Experience Premium Weather Data?</h2>
        <p className="cta-subtitle">Join thousands of users who trust WeatherPro</p>
        <Link to="/dashboard" className="btn btn-large">
          Get Started Now
          <span className="btn-arrow">→</span>
        </Link>
      </div>
    </div>
  )
}

export default Home
