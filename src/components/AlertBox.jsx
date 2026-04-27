import './AlertBox.css'

function AlertBox({ type = 'info', message, onClose }) {
  if (!message) return null

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return '⚠️'
      case 'error':
        return '❌'
      case 'success':
        return '✅'
      case 'info':
        return 'ℹ️'
      default:
        return 'ℹ️'
    }
  }

  return (
    <div className={`alert-box alert-${type}`}>
      <div className="alert-content">
        <span className="alert-icon">{getIcon()}</span>
        <span className="alert-message">{message}</span>
        {onClose && (
          <button className="alert-close" onClick={onClose} aria-label="Close alert">
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export default AlertBox
