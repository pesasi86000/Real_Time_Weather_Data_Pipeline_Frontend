import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="brand-icon">🌦️</span>
          <span className="brand-text">WeatherPro</span>
        </div>
        
        <ul className="navbar-menu">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <span className="nav-icon">🏠</span>
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <span className="nav-icon">📊</span>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/forecast" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <span className="nav-icon">📅</span>
              <span>Forecast</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <span className="nav-icon">ℹ️</span>
              <span>About</span>
            </NavLink>
          </li>
        </ul>

        <div className="navbar-actions">
          <button className="theme-toggle" title="Toggle theme">
            🌙
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
