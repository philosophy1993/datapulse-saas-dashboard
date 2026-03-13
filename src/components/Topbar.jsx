import { useState, useMemo } from 'react'

export function Topbar({ currentPage, currentSection, onOpenCp, darkMode, onToggleDark, onOpenKbModal, showToast, notifications, onDismissNotif, onMarkAllRead }) {
  const [showNotifPanel, setShowNotifPanel] = useState(false)
  const [showAvaMenu, setShowAvaMenu] = useState(false)
  const unreadCount = useMemo(() => notifications.filter(n => n.unread).length, [notifications])

  return (
    <header className="topbar">
      <span className="page-title">{currentPage}</span>
      <div className="breadcrumb">
        <span>Home</span><span>›</span><span style={{ color:'var(--t2)' }}>{currentSection}</span>
        {currentPage !== currentSection && <><span>›</span><span style={{ color:'var(--t2)' }}>{currentPage}</span></>}
      </div>
      <div className="spacer" />
      <div className="search" onClick={onOpenCp} style={{ cursor:'pointer' }} title="Search (⌘K)">
        <span style={{ color:'var(--t3)', fontSize:14 }}>🔍</span>
        <span style={{ fontSize:'12.5px', color:'var(--t3)', flex:1 }}>Search pages, actions, customers…</span>
        <span style={{ fontSize:'10.5px', color:'var(--t3)', padding:'1px 6px', border:'1px solid var(--border)', borderRadius:4, background:'var(--bg)', fontFamily:'monospace', flexShrink:0 }}>⌘K</span>
      </div>
      <div className="top-actions">
        <button className="theme-btn" onClick={onToggleDark} title="Toggle dark mode (D)">{darkMode ? '☀️' : '🌙'}</button>
        <button className="theme-btn" onClick={onOpenKbModal} title="Keyboard shortcuts (?)">⌨️</button>

        <div className="icon-btn2" onClick={() => { setShowNotifPanel(v => !v); setShowAvaMenu(false) }} style={{ position:'relative' }}>
          🔔
          {unreadCount > 0 && <div className="notif-pip" />}
          {showNotifPanel && (
            <div className="notif-panel open">
              <div className="notif-header">
                <span>Notifications</span>
                <span className="notif-mark-all" onClick={e => { e.stopPropagation(); onMarkAllRead(); }}>Mark all read</span>
              </div>
              {notifications.map(n => (
                <div key={n.id} className={`notif-item${n.unread ? ' unread' : ''}`} onClick={() => onDismissNotif(n.id)}>
                  <div className="notif-ico" style={{ background:n.bg }}>{n.ico}</div>
                  <div style={{ flex:1 }}>
                    <div className="notif-txt" dangerouslySetInnerHTML={{ __html:n.txt }} />
                    <div className="notif-time">{n.time}</div>
                  </div>
                  {n.unread && <div className="notif-dot" />}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="icon-btn2" onClick={() => showToast('Report copied to clipboard','success')}>📋</div>

        <div className="top-ava-wrap">
          <div className="top-ava" onClick={() => { setShowAvaMenu(v => !v); setShowNotifPanel(false) }}>TO</div>
          {showAvaMenu && (
            <div className="top-ava-menu open">
              <div className="top-ava-head">
                <div className="top-ava" style={{ width:36, height:36, fontSize:13 }}>TO</div>
                <div><div className="tav-name">Tetsugaku O.</div><div className="tav-email">admin@datapulse.io</div></div>
              </div>
              <div className="tav-item" onClick={() => showToast('Profile settings coming soon','info')}>👤 View Profile</div>
              <div className="tav-item" onClick={() => showToast('Account settings coming soon','info')}>⚙️ Account Settings</div>
              <div className="tav-sep" />
              <div className="tav-item danger" onClick={() => showToast('Use sidebar to sign out','warn')}>🚪 Sign Out</div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
