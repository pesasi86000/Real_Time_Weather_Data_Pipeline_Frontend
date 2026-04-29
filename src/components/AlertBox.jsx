import { useState } from 'react'
import './AlertBox.css'

function AlertBox({ type = 'info', severity = 'low', title, message, actions, timestamp, onClose }) {
  const [expanded, setExpanded] = useState(false)

  if (!message) return null

  const getIcon = () => {
    switch (type) {
      case 'warning': return '⚠️'
      case 'error':   return severity === 'critical' ? '🚨' : '❌'
      case 'success': return '✅'
      case 'info':    return 'ℹ️'
      default:        return 'ℹ️'
    }
  }

  const formatTime = (date) => {
    if (!date) return null
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const hasMeta = (actions && actions.length > 0) || timestamp

  return (
    <div className={`alert-box alert-${type} alert-severity-${severity}`} role="alert">
      <div className="alert-content">
        <span className="alert-icon" aria-hidden="true">{getIcon()}</span>

        <div className="alert-body">
          {title && <span className="alert-title">{title}</span>}
          <span className="alert-message">{message}</span>

          {hasMeta && expanded && (
            <div className="alert-details">
              {actions && actions.length > 0 && (
                <ul className="alert-actions">
                  {actions.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              )}
              {timestamp && (
                <span className="alert-timestamp">Issued at {formatTime(timestamp)}</span>
              )}
            </div>
          )}
        </div>

        <div className="alert-controls">
          {hasMeta && (
            <button
              className="alert-expand"
              onClick={() => setExpanded(prev => !prev)}
              aria-label={expanded ? 'Show less' : 'Show recommended actions'}
              title={expanded ? 'Collapse' : 'See recommended actions'}
            >
              {expanded ? '▲' : '▼'}
            </button>
          )}
          {onClose && (
            <button className="alert-close" onClick={onClose} aria-label="Dismiss alert">
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AlertBox
