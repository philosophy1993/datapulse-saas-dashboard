import React, { useState } from 'react'
import { NAV_ITEMS } from '../data.js'

export function Sidebar({ currentPage, onNavigate, workspace, onSwitchWorkspace, onSignOut, showToast }) {
  const [showWsDd, setShowWsDd] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const WORKSPACES = [
    { name:'Acme Corp · Team', icon:'🏢', bg:'linear-gradient(135deg,#10b981,#059669)' },
    { name:'Beta Startups',    icon:'🚀', bg:'linear-gradient(135deg,#6366f1,#8b5cf6)' },
    { name:'Personal',         icon:'👤', bg:'linear-gradient(135deg,#f59e0b,#d97706)' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo">
          <div className="logo-mark">📊</div>
          <span className="logo-text">DataPulse <span className="logo-pro">PRO</span></span>
        </div>
        <div className="workspace-btn" onClick={() => { setShowWsDd(v => !v); setShowUserMenu(false) }} style={{ position:'relative' }}>
          <div className="ws-dot">🏢</div>
          <span className="ws-name">{workspace}</span>
          <span className="ws-chevron">⌄</span>
          {showWsDd && (
            <div className="ws-dropdown open">
              {WORKSPACES.map(ws => (
                <div key={ws.name} className={`ws-opt${workspace === ws.name ? ' current' : ''}`}
                  onClick={e => { e.stopPropagation(); onSwitchWorkspace(ws.name); setShowWsDd(false) }}>
                  <div className="ws-opt-dot" style={{ background:ws.bg }}>{ws.icon}</div>
                  {ws.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <nav className="nav">
        {NAV_ITEMS.map(group => (
          <React.Fragment key={group.label}>
            <div className="nav-label">{group.label}</div>
            {group.items.map(item => (
              <div key={item.name}
                className={`nav-item${currentPage === item.name ? ' active' : ''}`}
                onClick={() => { onNavigate(item.name, item.section); setShowWsDd(false); setShowUserMenu(false) }}>
                <span className="nav-icon">{item.icon}</span>
                {item.name}
                {item.badge && <span className={`nav-badge${item.badgeRed ? ' red' : ''}`}>{item.badge}</span>}
              </div>
            ))}
          </React.Fragment>
        ))}
      </nav>

      <div className="sidebar-footer" style={{ position:'relative' }}>
        {showUserMenu && (
          <div className="user-menu open">
            <div className="user-menu-item" onClick={() => showToast('Profile settings coming soon','info')}>👤 View Profile</div>
            <div className="user-menu-item" onClick={() => { onNavigate('Settings','System'); setShowUserMenu(false) }}>⚙️ Account Settings</div>
            <div className="user-menu-item" onClick={() => showToast('Keyboard shortcuts: press ? to toggle','info')}>⌨️ Keyboard Shortcuts</div>
            <div className="user-menu-sep" />
            <div className="user-menu-item danger" onClick={() => { onSignOut(); setShowUserMenu(false) }}>🚪 Sign Out</div>
          </div>
        )}
        <div className="user-row" onClick={() => { setShowUserMenu(v => !v); setShowWsDd(false) }}>
          <div className="user-ava">TO</div>
          <div>
            <div className="user-name">Tetsugaku O.</div>
            <div className="user-role">Administrator · Admin</div>
          </div>
          <span className="user-more">⋯</span>
        </div>
      </div>
    </aside>
  )
}
