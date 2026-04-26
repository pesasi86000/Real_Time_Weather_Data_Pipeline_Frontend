import './SectionHeader.css'

function SectionHeader({ icon, title, subtitle, action }) {
  return (
    <div className="section-header">
      <div className="section-header-left">
        {icon && <span className="section-header-icon">{icon}</span>}
        <div className="section-header-text">
          <h2 className="section-header-title">{title}</h2>
          {subtitle && <p className="section-header-subtitle">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="section-header-action">{action}</div>}
    </div>
  )
}

export default SectionHeader
