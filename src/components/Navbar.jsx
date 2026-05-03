import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-icon">🌦️</span>
          <span className="brand-text">WeatherPro</span>
        </NavLink>
        
        <ul className={`navbar-menu${menuOpen ? ' navbar-menu-open' : ''}`}>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end onClick={closeMenu}>
              <span className="nav-icon">🏠</span>
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
              <span className="nav-icon">📊</span>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/forecast" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
              <span className="nav-icon">📅</span>
              <span>Forecast</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
              <span className="nav-icon">📈</span>
              <span>History</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
              <span className="nav-icon">ℹ️</span>
              <span>About</span>
            </NavLink>
          </li>
        </ul>

        <div className="navbar-actions">
          <button
            className="hamburger"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(prev => !prev)}
          >
            <span className={`hamburger-bar${menuOpen ? ' bar-open' : ''}`} />
            <span className={`hamburger-bar${menuOpen ? ' bar-open' : ''}`} />
            <span className={`hamburger-bar${menuOpen ? ' bar-open' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="navbar-overlay" onClick={closeMenu} aria-hidden="true" />
      )}
    </nav>
  )
}

export default Navbar
