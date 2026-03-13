import React, { useState, useEffect, useRef } from 'react'
import { ORDERS, ALL_ORDERS } from '../data.js'

export function CommandPalette({ open, onClose, onNavigate, onToggleDark, showToast, onOpenReportModal, onOpenTxnModal, onOpenKpiPanel }) {
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) { setQuery(''); setActiveIdx(0); setTimeout(() => inputRef.current?.focus(), 30) }
  }, [open])

  function exportCSVAction() {
    const headers = ['Order','Customer','Email','Plan','Amount','Status','Date']
    const rows = ORDERS.map(o => [o.id, o.name, o.email, o.plan, o.amt, o.status, o.date])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type:'text/csv' })
    const url = URL.createObjectURL(blob)
    Object.assign(document.createElement('a'), { href:url, download:'datapulse-transactions.csv' }).click()
    URL.revokeObjectURL(url)
    showToast('Transactions exported as CSV','success')
  }

  const COMMANDS = [
    { type:'nav',    ico:'🏠', bg:'#eef2ff', label:'Dashboard',            sub:'Overview · KPI, charts, transactions', badge:'Page',     action:() => onNavigate('Dashboard','Overview') },
    { type:'nav',    ico:'📈', bg:'#d1fae5', label:'Analytics',            sub:'Deep-dive analytics and trends',       badge:'Page',     action:() => onNavigate('Analytics','Overview') },
    { type:'nav',    ico:'🛒', bg:'#fef3c7', label:'Orders',               sub:'All orders and fulfillment',           badge:'Page',     action:() => onNavigate('Orders','Overview') },
    { type:'nav',    ico:'👥', bg:'#fce7f3', label:'All Customers',        sub:'Customer list and segments',           badge:'Page',     action:() => onNavigate('All Customers','Customers') },
    { type:'nav',    ico:'💰', bg:'#d1fae5', label:'Revenue',              sub:'Revenue breakdown and forecasts',      badge:'Page',     action:() => onNavigate('Revenue','Finance') },
    { type:'nav',    ico:'⚙️', bg:'#f1f5f9', label:'Settings',             sub:'Profile, notifications, account',      badge:'Page',     action:() => onNavigate('Settings','System') },
    { type:'action', ico:'⬇', bg:'#eef2ff', label:'Export as CSV',        sub:'Download all transactions',            badge:'Action',   action:() => exportCSVAction() },
    { type:'action', ico:'➕', bg:'#d1fae5', label:'New Report',           sub:'Create a custom analytics report',     badge:'Action',   action:() => onOpenReportModal() },
    { type:'action', ico:'📋', bg:'#fef3c7', label:'View All Transactions',sub:'Full transaction list with filters',   badge:'Action',   action:() => onOpenTxnModal() },
    { type:'action', ico:'🌙', bg:'#f3e8ff', label:'Toggle Dark Mode',     sub:'Switch between light and dark theme',  badge:'Action',   action:() => onToggleDark() },
    { type:'action', ico:'⌨️', bg:'#ecfeff', label:'Keyboard Shortcuts',   sub:'View all keyboard shortcuts',          badge:'Action',   action:() => showToast('Press ? to open keyboard shortcuts','info') },
    { type:'kpi',    ico:'💰', bg:'#eef2ff', label:'Revenue Breakdown',    sub:'$124,832 · +12.5% vs last period',     badge:'KPI',      action:() => onOpenKpiPanel('revenue') },
    { type:'kpi',    ico:'👥', bg:'#d1fae5', label:'Active Users',         sub:'8,429 · +8.2% vs last period',        badge:'KPI',      action:() => onOpenKpiPanel('users') },
    { type:'kpi',    ico:'🛒', bg:'#fef3c7', label:'Orders Breakdown',     sub:'1,284 · -2.1% vs last period',        badge:'KPI',      action:() => onOpenKpiPanel('orders') },
    { type:'kpi',    ico:'📊', bg:'#fce7f3', label:'Conversion Rate',      sub:'3.24% · +0.4% vs last period',        badge:'KPI',      action:() => onOpenKpiPanel('conversion') },
  ]

  const customerCmds = ALL_ORDERS.map(o => ({
    type:'customer', ico:'👤', bg:'#f8fafc',
    label:o.name, sub:`${o.email} · ${o.plan} · ${o.amt}`, badge:'Customer',
    action:() => showToast(`Viewing ${o.name}`,'info'),
  }))

  const term = query.toLowerCase().trim()
  const allCmds = [...COMMANDS, ...customerCmds]
  const filtered = term
    ? allCmds.filter(c => (c.label+c.sub).toLowerCase().includes(term))
    : COMMANDS.filter(c => c.type !== 'customer')

  useEffect(() => { setActiveIdx(filtered.length > 0 ? 0 : -1) }, [query, filtered.length])

  function execute(idx) {
    const item = filtered[idx]
    if (!item) return
    onClose()
    setTimeout(() => item.action(), 50)
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => (i+1) % filtered.length) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => (i-1+filtered.length) % filtered.length) }
    if (e.key === 'Enter')     { e.preventDefault(); execute(activeIdx) }
    if (e.key === 'Escape')    { onClose() }
  }

  const GROUPS = { nav:'Pages', action:'Actions', kpi:'KPI Breakdown', customer:'Customers' }

  if (!open) return null
  return (
    <div className="cp-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="cp-box">
        <div className="cp-search-row">
          <span className="cp-search-icon">🔍</span>
          <input ref={inputRef} className="cp-input" placeholder="Search pages, actions, customers…"
            value={query} onChange={e => setQuery(e.target.value)} onKeyDown={handleKeyDown}
            autoComplete="off" spellCheck="false" />
          <span className="cp-kbd">Esc</span>
        </div>
        <div className="cp-results">
          {filtered.length === 0
            ? <div className="cp-empty">No results for &quot;<strong>{query}</strong>&quot;</div>
            : Object.entries(GROUPS).map(([typeKey, groupLabel]) => {
                const items = filtered.filter(c => c.type === typeKey)
                if (!items.length) return null
                return (
                  <React.Fragment key={typeKey}>
                    <div className="cp-section-label">{groupLabel}</div>
                    {items.map(item => {
                      const idx = filtered.indexOf(item)
                      return (
                        <div key={idx} className={`cp-item${idx === activeIdx ? ' active' : ''}`}
                          onMouseEnter={() => setActiveIdx(idx)} onClick={() => execute(idx)}>
                          <div className="cp-item-ico" style={{ background:item.bg }}>{item.ico}</div>
                          <div className="cp-item-body">
                            <div className="cp-item-label">{item.label}</div>
                            <div className="cp-item-sub">{item.sub}</div>
                          </div>
                          <span className="cp-item-badge">{item.badge}</span>
                        </div>
                      )
                    })}
                  </React.Fragment>
                )
              })
          }
        </div>
        <div className="cp-footer">
          <div className="cp-hint"><span className="cp-hint-key">↑↓</span> Navigate</div>
          <div className="cp-hint"><span className="cp-hint-key">↵</span> Select</div>
          <div className="cp-hint"><span className="cp-hint-key">Esc</span> Close</div>
        </div>
      </div>
    </div>
  )
}
