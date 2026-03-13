import { ORDERS, FEED_DATA, CHART_DATA } from '../data.js'
import { KpiCard } from './KpiCard.jsx'
import { RevenueChart, DonutChart } from './Charts.jsx'

const STATUS_LABELS = { paid:'Paid', pend:'Pending', fail:'Failed', refund:'Refunded' }

function OrderRow({ o }) {
  const initials = o.name.split(' ').map(n => n[0]).join('')
  return (
    <tr>
      <td><span className="oid">{o.id}</span></td>
      <td>
        <div className="cust-cell">
          <div className="cust-ava" style={{ background:o.col }}>{initials}</div>
          <div><div className="cust-n">{o.name}</div><div className="cust-e">{o.email}</div></div>
        </div>
      </td>
      <td style={{ color:'var(--t2)', fontSize:'12.5px' }}>{o.plan}</td>
      <td><span className="amt">{o.amt}</span></td>
      <td><span className={`badge ${o.status}`}>{STATUS_LABELS[o.status]}</span></td>
      <td style={{ color:'var(--t3)', fontSize:'12px' }}>{o.date}</td>
    </tr>
  )
}

export { OrderRow }

function ChartsSection({ activeTab, onTabChange, darkMode }) {
  const d = CHART_DATA[activeTab]
  const [bestLabel, bestPeriod] = d.best.split(' · ')
  return (
    <div className="charts-row">
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-ttl">Revenue Overview</div>
            <div className="card-sub">{d.sub}</div>
          </div>
          <div className="tabs">
            {['weekly','monthly','yearly'].map(tab => (
              <button key={tab} className={`tab${activeTab === tab ? ' on' : ''}`} onClick={() => onTabChange(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="chart-wrap"><RevenueChart activeTab={activeTab} darkMode={darkMode} /></div>
        <div className="mini-row">
          <div className="mini-card">
            <div className="mini-ico" style={{ background:'#eef2ff' }}>📈</div>
            <div><div className="mini-val">{d.avg}</div><div className="mini-lbl">Avg / Month</div></div>
          </div>
          <div className="mini-card">
            <div className="mini-ico" style={{ background:'#d1fae5' }}>🏆</div>
            <div><div className="mini-val">{bestLabel}</div><div className="mini-lbl">Best: {bestPeriod}</div></div>
          </div>
          <div className="mini-card">
            <div className="mini-ico" style={{ background:'#fef3c7' }}>🔥</div>
            <div><div className="mini-val">{d.yoy}</div><div className="mini-lbl">YoY Growth</div></div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-head">
          <div><div className="card-ttl">Revenue by Plan</div><div className="card-sub">Q1 2025 · Plan breakdown</div></div>
        </div>
        <div className="chart-wrap"><DonutChart /></div>
      </div>
    </div>
  )
}

export function Dashboard({ activeTab, onTabChange, onOpenKpiPanel, showToast, dateRange, onDateRangeChange, onOpenReportModal, onOpenTxnModal, darkMode, showDateDd, onToggleDateDd, onCloseDateDd }) {
  const DATE_RANGES = ['Last 7 days','Last 30 days','Last 6 months','Last 12 months','Year to date','All time']

  function exportCSV() {
    const headers = ['Order','Customer','Email','Plan','Amount','Status','Date']
    const rows = ORDERS.map(o => [o.id, o.name, o.email, o.plan, o.amt, o.status, o.date])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type:'text/csv' })
    const url = URL.createObjectURL(blob)
    Object.assign(document.createElement('a'), { href:url, download:'datapulse-transactions.csv' }).click()
    URL.revokeObjectURL(url)
    showToast('Transactions exported as CSV', 'success')
  }

  return (
    <>
      <div className="period-bar">
        <div className="period-left">
          <div className="period-title">Business Overview</div>
          <div className="period-sub">📅 Oct 1, 2024 – Mar 7, 2025 · Auto-refreshes every 5 min</div>
        </div>
        <div className="period-right">
          <div style={{ position:'relative' }}>
            <button className="btn" onClick={onToggleDateDd}>📅 <span>{dateRange}</span> ⌄</button>
            {showDateDd && (
              <div className="date-dropdown open">
                {DATE_RANGES.map(r => (
                  <div key={r} className={`date-opt${dateRange === r ? ' selected' : ''}`}
                    onClick={() => { onDateRangeChange(r); onCloseDateDd(); showToast(`Date range updated: ${r}`, 'success') }}>
                    {r}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="btn" onClick={exportCSV}>⬇ Export</button>
          <button className="btn btn-accent" onClick={onOpenReportModal}>+ New Report</button>
        </div>
      </div>

      <div className="kpi-row">
        <KpiCard label="Total Revenue"    value="$124,832" delta="↑ 12.5%" deltaType="up" compare="vs $110,962 last period"
          sparkData={[58,64,71,68,80,95,110,124]} sparkColor="#6366f1" glowColor="#6366f1" ico="💰" icoBg="#eef2ff"
          onClick={() => onOpenKpiPanel('revenue')} />
        <KpiCard label="Active Users"     value="8,429"    delta="↑ 8.2%"  deltaType="up" compare="vs 7,791 last period"
          sparkData={[62,65,69,72,74,78,80,84]} sparkColor="#10b981" glowColor="#10b981" ico="👥" icoBg="#d1fae5"
          onClick={() => onOpenKpiPanel('users')} />
        <KpiCard label="Total Orders"     value="1,284"    delta="↓ 2.1%"  deltaType="dn" compare="vs 1,311 last period"
          sparkData={[110,105,115,125,118,130,128,128]} sparkColor="#f59e0b" glowColor="#f59e0b" ico="🛒" icoBg="#fef3c7"
          onClick={() => onOpenKpiPanel('orders')} />
        <KpiCard label="Conversion Rate"  value="3.24%"    delta="↑ 0.4%"  deltaType="up" compare="vs 2.84% last period"
          sparkData={[2.8,2.9,3.0,3.1,3.0,3.1,3.2,3.24]} sparkColor="#ec4899" glowColor="#ec4899" ico="📊" icoBg="#fce7f3"
          onClick={() => onOpenKpiPanel('conversion')} />
      </div>

      <ChartsSection activeTab={activeTab} onTabChange={onTabChange} darkMode={darkMode} />

      <div className="btm">
        <div className="card">
          <div className="card-head">
            <div><div className="card-ttl">Recent Transactions</div><div className="card-sub">Latest 8 orders</div></div>
            <button className="btn" style={{ fontSize:'12px', padding:'6px 12px' }} onClick={onOpenTxnModal}>View all →</button>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Order</th><th>Customer</th><th>Plan / Product</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>{ORDERS.map(o => <OrderRow key={o.id} o={o} />)}</tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-head">
            <div><div className="card-ttl">Live Activity</div><div className="card-sub">Real-time events</div></div>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 0 3px rgba(16,185,129,0.2)' }} />
          </div>
          <div className="feed">
            {FEED_DATA.map((f, i) => (
              <div key={i} className="feed-item">
                <div className="feed-ico" style={{ background:f.bg }}>{f.ico}</div>
                <div className="feed-body">
                  <div className="feed-txt" dangerouslySetInnerHTML={{ __html:f.txt }} />
                  <div className="feed-time">{f.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
