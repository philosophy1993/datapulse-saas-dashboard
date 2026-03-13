import { useState } from 'react'
import { ALL_ORDERS, KPI_DATA, STATUS_LABELS } from '../data.js'
import { OrderRow } from './Dashboard.jsx'

export function ReportModal({ open, onClose, showToast }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('Revenue Analysis')
  const [range, setRange] = useState('Last 12 months')

  function handleCreate() {
    if (!name.trim()) return
    onClose()
    showToast(`Report "${name}" (${type} · ${range}) created!`, 'success')
    setName('')
  }

  if (!open) return null
  return (
    <div className="modal-backdrop open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-title">Create New Report</div>
        <div className="modal-sub">Configure your custom analytics report</div>
        <div className="modal-row">
          <label className="modal-label">Report Name</label>
          <input className="modal-input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Q1 Revenue Summary" />
        </div>
        <div className="modal-row">
          <label className="modal-label">Report Type</label>
          <select className="modal-select" value={type} onChange={e => setType(e.target.value)}>
            <option>Revenue Analysis</option><option>User Growth</option>
            <option>Subscription Metrics</option><option>Churn Report</option><option>Custom</option>
          </select>
        </div>
        <div className="modal-row">
          <label className="modal-label">Date Range</label>
          <select className="modal-select" value={range} onChange={e => setRange(e.target.value)}>
            <option>Last 30 days</option><option>Last 6 months</option>
            <option>Last 12 months</option><option>Year to date</option>
          </select>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-accent" onClick={handleCreate}>Create Report →</button>
        </div>
      </div>
    </div>
  )
}

export function TransactionsModal({ open, onClose }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const STATUSES = Object.keys(STATUS_LABELS)

  const filtered = ALL_ORDERS.filter(o =>
    (statusFilter === 'all' || o.status === statusFilter) &&
    (search === '' || (o.id+o.name+o.email+o.plan).toLowerCase().includes(search.toLowerCase()))
  )

  if (!open) return null
  return (
    <div className="modal-backdrop open" onClick={e => e.target === e.currentTarget && onClose()}
      style={{ alignItems:'flex-start', paddingTop:60 }}>
      <div className="txn-modal">
        <div className="txn-modal-head">
          <div>
            <div className="txn-modal-title">All Transactions</div>
            <div className="txn-modal-sub">Showing {filtered.length} of {ALL_ORDERS.length} transactions</div>
          </div>
          <button className="txn-close" onClick={onClose}>✕</button>
        </div>
        <div className="txn-search">
          <span style={{ color:'var(--t3)', fontSize:14 }}>🔍</span>
          <input type="text" placeholder="Search transactions…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="txn-filter-row">
          {STATUSES.map(s => (
            <button key={s} className={`txn-filter${statusFilter === s ? ' active' : ''}`} onClick={() => setStatusFilter(s)}>
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Order</th><th>Customer</th><th>Plan / Product</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>{filtered.map(o => <OrderRow key={o.id} o={o} />)}</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function KpiPanel({ open, type, onClose }) {
  if (!type) return null
  const d = KPI_DATA[type]
  if (!d) return null
  return (
    <>
      <div className={`kpi-panel-overlay${open ? ' show' : ''}`} onClick={onClose} />
      <div className={`kpi-panel${open ? ' open' : ''}`}>
        <div className="kpi-panel-head">
          <div>
            <div className="kpi-panel-title">{d.title}</div>
            <div className="kpi-panel-sub">{d.sub}</div>
          </div>
          <button className="txn-close" onClick={onClose}>✕</button>
        </div>
        <div className="kpi-stat-row">
          {d.stats.map(s => (
            <div key={s.lbl} className="kpi-stat">
              <div className="kpi-stat-val">{s.val}</div>
              <div className="kpi-stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
        <div className="kpi-breakdown-title">{d.bdTitle}</div>
        {d.breakdown.map(b => (
          <div key={b.lbl} className="kpi-breakdown-item">
            <div className="kpi-bd-label">{b.lbl}</div>
            <div className="kpi-bd-bar-wrap"><div className="kpi-bd-bar" style={{ width:`${b.pct}%`, background:b.color }} /></div>
            <div className="kpi-bd-pct" style={{ color:b.color }}>{b.pct}%</div>
          </div>
        ))}
      </div>
    </>
  )
}

const KB_SECTIONS = [
  { title: 'Navigation', rows: [
    { label: 'Go to Dashboard', keys: ['G', 'then', 'D'] },
    { label: 'Go to Analytics', keys: ['G', 'then', 'A'] },
    { label: 'Go to Settings',  keys: ['G', 'then', 'S'] },
  ]},
  { title: 'Search & Filters', rows: [
    { label: 'Command palette', keys: ['⌘', '+', 'K'] },
    { label: 'Clear search',    keys: ['Esc'] },
  ]},
  { title: 'Modals & Panels', rows: [
    { label: 'View all transactions', keys: ['T'] },
    { label: 'New report',            keys: ['N'] },
    { label: 'Notifications',         keys: ['B'] },
    { label: 'Close any modal',       keys: ['Esc'] },
  ]},
  { title: 'Display', rows: [
    { label: 'Toggle dark mode', keys: ['D'] },
    { label: 'Export as CSV',    keys: ['E'] },
    { label: 'Show this help',   keys: ['?'] },
  ]},
]

export function KeyboardShortcutsModal({ open, onClose }) {
  if (!open) return null
  return (
    <div className="modal-backdrop open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="kb-modal-box">
        <div className="kb-head">
          <div className="modal-title">Keyboard Shortcuts</div>
          <button className="txn-close" onClick={onClose}>✕</button>
        </div>
        {KB_SECTIONS.map(section => (
          <div key={section.title}>
            <div className="kb-section-title">{section.title}</div>
            {section.rows.map(row => (
              <div key={row.label} className="kb-row">
                <span>{row.label}</span>
                <span className="kb-keys">
                  {row.keys.map((k, i) => (
                    <span key={i} className={k === 'then' || k === '+' ? 'kb-plus' : 'kb-shortcut'}>{k}</span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
