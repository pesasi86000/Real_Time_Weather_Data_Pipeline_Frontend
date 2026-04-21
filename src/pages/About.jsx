import './About.css'

function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1 className="about-title">About WeatherPro</h1>
        <p className="about-subtitle">
          Your trusted source for real-time weather intelligence
        </p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <div className="section-icon">🌦️</div>
          <h2>Our Mission</h2>
          <p>
            WeatherPro is dedicated to providing the most accurate and reliable weather data through our advanced real-time data pipeline. We believe that access to precise weather information should be fast, beautiful, and accessible to everyone.
          </p>
        </section>

        <section className="about-section">
          <div className="section-icon">⚡</div>
          <h2>Cutting-Edge Technology</h2>
          <p>
            Our platform leverages state-of-the-art data processing pipelines, machine learning algorithms, and real-time APIs to deliver weather updates with unprecedented speed and accuracy. Built with modern React and optimized for performance.
          </p>
        </section>

        <section className="about-section">
          <div className="section-icon">🎯</div>
          <h2>Why Choose Us?</h2>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-bullet">✓</span>
              <span>Real-time data updates every 5 minutes</span>
            </div>
            <div className="feature-item">
              <span className="feature-bullet">✓</span>
              <span>99.9% uptime guarantee</span>
            </div>
            <div className="feature-item">
              <span className="feature-bullet">✓</span>
              <span>Beautiful, responsive interface</span>
            </div>
            <div className="feature-item">
              <span className="feature-bullet">✓</span>
              <span>Advanced analytics and insights</span>
            </div>
            <div className="feature-item">
              <span className="feature-bullet">✓</span>
              <span>Global coverage across 50,000+ cities</span>
            </div>
            <div className="feature-item">
              <span className="feature-bullet">✓</span>
              <span>Free and open-source</span>
            </div>
          </div>
        </section>

        <section className="tech-stack-section">
          <h2 className="tech-title">Built With Modern Technology</h2>
          <div className="tech-grid">
            <div className="tech-card">
              <div className="tech-logo">⚛️</div>
              <h3>React</h3>
              <p>Modern UI framework</p>
            </div>
            <div className="tech-card">
              <div className="tech-logo">⚡</div>
              <h3>Vite</h3>
              <p>Lightning-fast builds</p>
            </div>
            <div className="tech-card">
              <div className="tech-logo">🎨</div>
              <h3>CSS3</h3>
              <p>Beautiful animations</p>
            </div>
            <div className="tech-card">
              <div className="tech-logo">🔄</div>
              <h3>REST API</h3>
              <p>Real-time data sync</p>
            </div>
            <div className="tech-card">
              <div className="tech-logo">🚀</div>
              <h3>Vercel</h3>
              <p>Edge deployment</p>
            </div>
            <div className="tech-card">
              <div className="tech-logo">📱</div>
              <h3>Responsive</h3>
              <p>Mobile-first design</p>
            </div>
          </div>
        </section>

        <section className="team-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">💎</div>
              <h3>Accuracy</h3>
              <p>We prioritize precise data over everything</p>
            </div>
            <div className="value-card">
              <div className="value-icon">⚡</div>
              <h3>Speed</h3>
              <p>Real-time updates when you need them</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🎨</div>
              <h3>Design</h3>
              <p>Beautiful interfaces that users love</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🔒</div>
              <h3>Reliability</h3>
              <p>24/7 uptime you can depend on</p>
            </div>
          </div>
        </section>

        <section className="contact-section">
          <h2>Get In Touch</h2>
          <p className="contact-text">
            Have questions or feedback? We'd love to hear from you!
          </p>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <span>pesasi86000@gmail.com</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">🌐</span>
              <span>weatherpro.vercel.app</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">💻</span>
              <span>GitHub: Real-Time Weather Pipeline</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About
