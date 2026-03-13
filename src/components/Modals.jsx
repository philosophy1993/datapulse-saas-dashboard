import { useState } from 'react'
import { ALL_ORDERS, KPI_DATA } from '../data.js'
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
  const STATUSES = ['all','paid','pend','fail','refund']
  const SLABELS = { all:'All', paid:'Paid', pend:'Pending', fail:'Failed', refund:'Refunded' }

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
              {SLABELS[s]}
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

export function KeyboardShortcutsModal({ open, onClose }) {
  if (!open) return null
  return (
    <div className="modal-backdrop open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="kb-modal-box">
        <div className="kb-head">
          <div className="modal-title">Keyboard Shortcuts</div>
          <button className="txn-close" onClick={onClose}>✕</button>
        </div>
        <div className="kb-section-title">Navigation</div>
        <div className="kb-row"><span>Go to Dashboard</span><span className="kb-keys"><span className="kb-shortcut">G</span><span className="kb-plus">then</span><span className="kb-shortcut">D</span></span></div>
        <div className="kb-row"><span>Go to Analytics</span><span className="kb-keys"><span className="kb-shortcut">G</span><span className="kb-plus">then</span><span className="kb-shortcut">A</span></span></div>
        <div className="kb-row"><span>Go to Settings</span><span className="kb-keys"><span className="kb-shortcut">G</span><span className="kb-plus">then</span><span className="kb-shortcut">S</span></span></div>
        <div className="kb-section-title">Search & Filters</div>
        <div className="kb-row"><span>Command palette</span><span className="kb-keys"><span className="kb-shortcut">⌘</span><span className="kb-plus">+</span><span className="kb-shortcut">K</span></span></div>
        <div className="kb-row"><span>Clear search</span><span className="kb-keys"><span className="kb-shortcut">Esc</span></span></div>
        <div className="kb-section-title">Modals & Panels</div>
        <div className="kb-row"><span>View all transactions</span><span className="kb-keys"><span className="kb-shortcut">T</span></span></div>
        <div className="kb-row"><span>New report</span><span className="kb-keys"><span className="kb-shortcut">N</span></span></div>
        <div className="kb-row"><span>Notifications</span><span className="kb-keys"><span className="kb-shortcut">B</span></span></div>
        <div className="kb-row"><span>Close any modal</span><span className="kb-keys"><span className="kb-shortcut">Esc</span></span></div>
        <div className="kb-section-title">Display</div>
        <div className="kb-row"><span>Toggle dark mode</span><span className="kb-keys"><span className="kb-shortcut">D</span></span></div>
        <div className="kb-row"><span>Export as CSV</span><span className="kb-keys"><span className="kb-shortcut">E</span></span></div>
        <div className="kb-row"><span>Show this help</span><span className="kb-keys"><span className="kb-shortcut">?</span></span></div>
      </div>
    </div>
  )
}
