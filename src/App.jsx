import { useState, useEffect } from 'react'
import { Chart, registerables } from 'chart.js'
import { ORDERS, NOTIFS_DEFAULT } from './data.js'
import { exportOrdersCSV } from './utils/csv.js'
import { ToastItem } from './components/Toast.jsx'
import { LoginOverlay } from './components/Auth.jsx'
import { Sidebar } from './components/Sidebar.jsx'
import { Topbar } from './components/Topbar.jsx'
import { Dashboard } from './components/Dashboard.jsx'
import { SettingsPage } from './components/Settings.jsx'
import { ReportModal, TransactionsModal, KpiPanel, KeyboardShortcutsModal } from './components/Modals.jsx'
import { CommandPalette } from './components/CommandPalette.jsx'

Chart.register(...registerables)
Chart.defaults.font.family = "'Inter', system-ui, sans-serif"
Chart.defaults.color = '#94a3b8'

let toastIdCounter = 0

export default function App() {
  const [isLoggedIn,     setIsLoggedIn]     = useState(false)
  const [currentPage,    setCurrentPage]    = useState('Dashboard')
  const [currentSection, setCurrentSection] = useState('Overview')
  const [darkMode,       setDarkMode]       = useState(() => localStorage.getItem('dp-theme') === 'dark')
  const [workspace,      setWorkspace]      = useState('Acme Corp · Team')
  const [activeTab,      setActiveTab]      = useState('monthly')
  const [dateRange,      setDateRange]      = useState('Last 6 months')
  const [showDateDd,     setShowDateDd]     = useState(false)
  const [showReportModal,setShowReportModal]= useState(false)
  const [showTxnModal,   setShowTxnModal]   = useState(false)
  const [showKpiPanel,   setShowKpiPanel]   = useState(false)
  const [kpiPanelType,   setKpiPanelType]   = useState(null)
  const [showCp,         setShowCp]         = useState(false)
  const [showKbModal,    setShowKbModal]    = useState(false)
  const [notifications,  setNotifications]  = useState(NOTIFS_DEFAULT)
  const [toasts,         setToasts]         = useState([])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('dp-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  function showToast(msg, type = 'info') {
    const id = ++toastIdCounter
    setToasts(prev => [...prev, { id, msg, type }])
  }

  function navigate(page, section) {
    setCurrentPage(page)
    setCurrentSection(section)
    setShowDateDd(false)
  }

  function exportCSV() { exportOrdersCSV(ORDERS, showToast) }

  // Global keyboard shortcuts
  useEffect(() => {
    let gKeyBuffer = ''
    let gKeyTimer = null

    function handler(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowCp(v => !v)
        return
      }
      if (['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) return
      const k = e.key
      if (k === 'Escape') {
        setShowCp(false); setShowKbModal(false); setShowReportModal(false)
        setShowTxnModal(false); setShowKpiPanel(false); setShowDateDd(false)
        return
      }
      if (k === '?')              { e.preventDefault(); setShowKbModal(true); return }
      if (k === 'd' || k === 'D') { setDarkMode(v => !v); return }
      if (k === 't' || k === 'T') { setShowTxnModal(true); return }
      if (k === 'n' || k === 'N') { setShowReportModal(true); return }
      if (k === 'e' || k === 'E') { exportCSV(); return }
      if (k === 'g' || k === 'G') {
        gKeyBuffer = 'g'
        clearTimeout(gKeyTimer)
        gKeyTimer = setTimeout(() => { gKeyBuffer = '' }, 1500)
        return
      }
      if (gKeyBuffer === 'g') {
        gKeyBuffer = ''; clearTimeout(gKeyTimer)
        const map = { d:['Dashboard','Overview'], a:['Analytics','Overview'], s:['Settings','System'] }
        const target = map[k.toLowerCase()]
        if (target) navigate(target[0], target[1])
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- event listener registered once; handler closes over stable setters

  const isSettings = currentPage === 'Settings'

  return (
    <>
      <div style={{ position:'fixed', bottom:28, right:28, zIndex:9999, display:'flex', flexDirection:'column', gap:8, pointerEvents:'none' }}>
        {toasts.map(t => (
          <ToastItem key={t.id} {...t} onRemove={id => setToasts(prev => prev.filter(x => x.id !== id))} />
        ))}
      </div>

      {!isLoggedIn && (
        <LoginOverlay
          onLogin={() => { setIsLoggedIn(true); showToast('Welcome back, Tetsugaku! ✨','success') }}
          showToast={showToast}
        />
      )}

      <Sidebar
        currentPage={currentPage}
        onNavigate={navigate}
        workspace={workspace}
        onSwitchWorkspace={name => { setWorkspace(name); showToast(`Switched to ${name}`,'success') }}
        onSignOut={() => setIsLoggedIn(false)}
        showToast={showToast}
      />

      <main className="main">
        <Topbar
          currentPage={currentPage}
          currentSection={currentSection}
          onOpenCp={() => setShowCp(true)}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(v => !v)}
          onOpenKbModal={() => setShowKbModal(true)}
          showToast={showToast}
          notifications={notifications}
          onDismissNotif={id => setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread:false } : n))}
          onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, unread:false })))}
        />

        <div className="body">
          {isSettings ? (
            <SettingsPage showToast={showToast} onExportCSV={exportCSV} />
          ) : (
            <Dashboard
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onOpenKpiPanel={type => { setKpiPanelType(type); setShowKpiPanel(true) }}
              showToast={showToast}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              onOpenReportModal={() => setShowReportModal(true)}
              onOpenTxnModal={() => setShowTxnModal(true)}
              darkMode={darkMode}
              showDateDd={showDateDd}
              onToggleDateDd={() => setShowDateDd(v => !v)}
              onCloseDateDd={() => setShowDateDd(false)}
            />
          )}
        </div>
      </main>

      <ReportModal      open={showReportModal} onClose={() => setShowReportModal(false)} showToast={showToast} />
      <TransactionsModal open={showTxnModal}   onClose={() => setShowTxnModal(false)} />
      <KpiPanel         open={showKpiPanel}    type={kpiPanelType} onClose={() => setShowKpiPanel(false)} />
      <KeyboardShortcutsModal open={showKbModal} onClose={() => setShowKbModal(false)} />
      <CommandPalette
        open={showCp}
        onClose={() => setShowCp(false)}
        onNavigate={navigate}
        onToggleDark={() => setDarkMode(v => !v)}
        showToast={showToast}
        onOpenReportModal={() => { setShowCp(false); setShowReportModal(true) }}
        onOpenTxnModal={() => { setShowCp(false); setShowTxnModal(true) }}
        onOpenKpiPanel={type => { setShowCp(false); setKpiPanelType(type); setShowKpiPanel(true) }}
      />
    </>
  )
}
