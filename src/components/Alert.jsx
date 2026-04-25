import './Alert.css'

/**
 * Alert Component - Display messages with different severity levels
 * @param {Object} props
 * @param {'success'|'error'|'warning'|'info'} props.type - Alert type
 * @param {string} props.title - Alert title
 * @param {string} props.message - Alert message
 * @param {React.ReactNode} props.children - Alert children
 * @param {Function} props.onClose - Callback when alert is dismissed
 * @param {React.ReactNode} props.icon - Custom icon
 * @param {React.ReactNode} props.actions - Action buttons/content
 * @param {boolean} props.closeable - Show close button
 */
function Alert({
  type = 'info',
  title,
  message,
  children,
  onClose,
  icon,
  actions,
  closeable = true,
}) {
  const defaultIcons = {
    success: '✅',
    error: '⚠️',
    warning: '⚡',
    info: 'ℹ️',
    notfound: '🔍',
  };

  const alertIcon = icon || defaultIcons[type] || defaultIcons.info;

  return (
    <div className={`alert alert-${type}`} role="alert">
      <div className="alert-header">
        <div className="alert-icon">{alertIcon}</div>
        <div className="alert-content">
          {title && <h2 className="alert-title">{title}</h2>}
          {message && <p className="alert-message">{message}</p>}
          {children}
        </div>
        {closeable && onClose && (
          <button 
            className="alert-close" 
            onClick={onClose}
            aria-label="Close alert"
          >
            ✕
          </button>
        )}
      </div>
      {actions && <div className="alert-actions">{actions}</div>}
    </div>
  );
}

export default Alert;
