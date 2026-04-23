import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Forecast from './pages/Forecast'
import History from './pages/History'
import About from './pages/About'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        {/* Background Animation */}
        <div className="background-animation">
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
          <div className="cloud cloud-3"></div>
        </div>

        <Navbar />
        
        <main className="main-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/forecast" element={<Forecast />} />
            <Route path="/history" element={<History />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>© 2026 WeatherPro | Powered by Real-Time Data Pipeline</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
