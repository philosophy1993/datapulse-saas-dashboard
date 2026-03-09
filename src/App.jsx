import React, { useState, useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)
Chart.defaults.font.family = "'Inter', system-ui, sans-serif"
Chart.defaults.color = '#94a3b8'

// ─── DATA ────────────────────────────────────────────────────────────────────
const ORDERS = [
  { id:'#7291', name:'Sarah Johnson',  email:'sarah@acme.com',       plan:'Enterprise Annual',  amt:'$9,600', status:'paid',   date:'Mar 7', col:'#6366f1' },
  { id:'#7290', name:'Michael Chen',   email:'m.chen@startup.io',    plan:'Pro Annual',         amt:'$2,388', status:'paid',   date:'Mar 6', col:'#10b981' },
  { id:'#7289', name:'Emma Williams',  email:'emma@designco.com',    plan:'Starter Plan',       amt:'$348',   status:'pend',   date:'Mar 6', col:'#f59e0b' },
  { id:'#7288', name:'James Roberts',  email:'j.roberts@tech.co',    plan:'Pro Monthly',        amt:'$199',   status:'paid',   date:'Mar 5', col:'#ec4899' },
  { id:'#7287', name:'Olivia Davis',   email:'olivia@free.net',      plan:'Add-on: Analytics',  amt:'$49',    status:'fail',   date:'Mar 5', col:'#8b5cf6' },
  { id:'#7286', name:'Noah Martinez',  email:'noah@growthco.com',    plan:'Pro Annual',         amt:'$2,388', status:'paid',   date:'Mar 4', col:'#06b6d4' },
  { id:'#7285', name:'Ava Thompson',   email:'ava@commerce.io',      plan:'Enterprise Annual',  amt:'$9,600', status:'refund', date:'Mar 4', col:'#f97316' },
  { id:'#7284', name:'Lucas Anderson', email:'l.anderson@bigco.com', plan:'Pro Monthly',        amt:'$199',   status:'paid',   date:'Mar 3', col:'#14b8a6' },
]

const ALL_ORDERS = [
  ...ORDERS,
  { id:'#7283', name:'Sophie Turner',  email:'s.turner@media.io',  plan:'Starter Plan',      amt:'$348',   status:'paid',   date:'Mar 3',  col:'#f43f5e' },
  { id:'#7282', name:'Ethan Harris',   email:'e.harris@cloud.co',  plan:'Pro Annual',        amt:'$2,388', status:'paid',   date:'Mar 2',  col:'#3b82f6' },
  { id:'#7281', name:'Chloe Wilson',   email:'chloe@agency.net',   plan:'Add-on: Exports',   amt:'$29',    status:'pend',   date:'Mar 2',  col:'#a855f7' },
  { id:'#7280', name:'Ryan Brown',     email:'r.brown@fintech.io', plan:'Enterprise Annual', amt:'$9,600', status:'paid',   date:'Mar 1',  col:'#0ea5e9' },
  { id:'#7279', name:'Isla Garcia',    email:'isla@startup.co',    plan:'Pro Monthly',       amt:'$199',   status:'fail',   date:'Mar 1',  col:'#22c55e' },
  { id:'#7278', name:'Mason Lee',      email:'mason@devco.io',     plan:'Pro Annual',        amt:'$2,388', status:'refund', date:'Feb 28', col:'#f59e0b' },
  { id:'#7277', name:'Aria Patel',     email:'a.patel@saas.com',   plan:'Starter Plan',      amt:'$348',   status:'paid',   date:'Feb 28', col:'#6366f1' },
  { id:'#7276', name:'Logan Scott',    email:'l.scott@corp.com',   plan:'Enterprise Annual', amt:'$9,600', status:'paid',   date:'Feb 27', col:'#ec4899' },
  { id:'#7275', name:'Zoe Mitchell',   email:'zoe@ecomm.store',    plan:'Pro Monthly',       amt:'$199',   status:'paid',   date:'Feb 27', col:'#14b8a6' },
  { id:'#7274', name:'Jack Robinson',  email:'j.robinson@biz.net', plan:'Add-on: Analytics', amt:'$49',    status:'paid',   date:'Feb 26', col:'#f97316' },
]

const FEED_DATA = [
  { ico:'💰', bg:'#eef2ff', txt:'<strong>Sarah Johnson</strong> upgraded to Enterprise Plan', time:'2 min ago' },
  { ico:'👤', bg:'#d1fae5', txt:'New user <strong>alex.kim@techco.io</strong> signed up', time:'14 min ago' },
  { ico:'⚠️', bg:'#fee2e2', txt:'Payment failed for <strong>Olivia Davis</strong> — card declined', time:'27 min ago' },
  { ico:'🔄', bg:'#fef3c7', txt:'<strong>Ava Thompson</strong> requested a refund ($9,600)', time:'1 hr ago' },
  { ico:'📦', bg:'#f3e8ff', txt:'<strong>Noah Martinez</strong> added the Analytics add-on', time:'2 hr ago' },
  { ico:'📧', bg:'#ecfeff', txt:'Monthly billing report sent to <strong>3 admins</strong>', time:'3 hr ago' },
  { ico:'🔐', bg:'#fce7f3', txt:'2FA enabled for <strong>james.roberts@tech.co</strong>', time:'5 hr ago' },
]

const CHART_DATA = {
  weekly: {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    cur:    [3200,4100,3800,5200,6400,4900,5800],
    prev:   [2800,3600,3200,4400,5600,4200,4900],
    sub:    'Daily comparison · Week of Mar 3–9, 2025',
    avg:    '$4.8k', best:'$6.4k · Fri', yoy:'+18.4%',
    curLbl:'Mar 3–9 2025', prevLbl:'Feb 24 – Mar 2 2025',
  },
  monthly: {
    labels: ['Oct','Nov','Dec','Jan','Feb','Mar'],
    cur:    [58400,72100,95300,88700,104200,124832],
    prev:   [45200,58900,71400,66800,79300,95100],
    sub:    'Monthly comparison · 2024 vs 2025',
    avg:    '$20.8k', best:'$124.8k · Mar 2025', yoy:'113.7%',
    curLbl:'2025', prevLbl:'2024',
  },
  yearly: {
    labels: ['2020','2021','2022','2023','2024','2025'],
    cur:    [210000,340000,520000,710000,890000,124832],
    prev:   [150000,280000,430000,600000,750000,890000],
    sub:    'Yearly growth · 2020–2025',
    avg:    '$556k', best:'$890k · 2024', yoy:'+102.8%',
    curLbl:'Actual', prevLbl:'Target',
  },
}

const KPI_DATA = {
  revenue: {
    title:'Revenue Breakdown', sub:'Last 6 months · all plans',
    stats:[{val:'$124,832',lbl:'Total Revenue'},{val:'+12.5%',lbl:'vs Last Period'},{val:'$20,805',lbl:'Avg / Month'},{val:'$9,600',lbl:'Largest Deal'}],
    bdTitle:'BY PLAN',
    breakdown:[{lbl:'Enterprise',pct:38,color:'#6366f1'},{lbl:'Pro Annual',pct:27,color:'#10b981'},{lbl:'Pro Monthly',pct:18,color:'#f59e0b'},{lbl:'Starter',pct:11,color:'#ec4899'},{lbl:'Add-ons',pct:6,color:'#94a3b8'}],
  },
  users: {
    title:'Active Users Breakdown', sub:'Last 6 months · all segments',
    stats:[{val:'8,429',lbl:'Active Users'},{val:'+8.2%',lbl:'vs Last Period'},{val:'638',lbl:'New This Month'},{val:'94.1%',lbl:'Retention Rate'}],
    bdTitle:'BY PLAN TYPE',
    breakdown:[{lbl:'Enterprise',pct:12,color:'#6366f1'},{lbl:'Pro Annual',pct:31,color:'#10b981'},{lbl:'Pro Monthly',pct:28,color:'#f59e0b'},{lbl:'Starter',pct:29,color:'#ec4899'}],
  },
  orders: {
    title:'Orders Breakdown', sub:'Last 6 months · all statuses',
    stats:[{val:'1,284',lbl:'Total Orders'},{val:'-2.1%',lbl:'vs Last Period'},{val:'214',lbl:'Avg / Month'},{val:'$97.2',lbl:'Avg Order Value'}],
    bdTitle:'BY STATUS',
    breakdown:[{lbl:'Paid',pct:71,color:'#10b981'},{lbl:'Pending',pct:14,color:'#f59e0b'},{lbl:'Failed',pct:9,color:'#ef4444'},{lbl:'Refunded',pct:6,color:'#8b5cf6'}],
  },
  conversion: {
    title:'Conversion Rate Breakdown', sub:'Last 6 months · funnel analysis',
    stats:[{val:'3.24%',lbl:'Conversion Rate'},{val:'+0.4%',lbl:'vs Last Period'},{val:'26,014',lbl:'Unique Visitors'},{val:'843',lbl:'New Conversions'}],
    bdTitle:'BY CHANNEL',
    breakdown:[{lbl:'Organic',pct:42,color:'#6366f1'},{lbl:'Direct',pct:28,color:'#10b981'},{lbl:'Referral',pct:18,color:'#f59e0b'},{lbl:'Paid Ads',pct:12,color:'#ec4899'}],
  },
}

const NOTIF_PREFS_DEFAULT = [
  { id:'np1', label:'New enterprise deals',  sub:'Get notified when a deal > $5,000 closes', checked:true },
  { id:'np2', label:'Payment failures',       sub:'Alerts for failed or declined payments',   checked:true },
  { id:'np3', label:'Refund requests',        sub:'When a customer requests a refund',        checked:true },
  { id:'np4', label:'New user sign-ups',      sub:'Daily digest of new registrations',        checked:false },
  { id:'np5', label:'Weekly report',          sub:'Automated revenue summary every Monday',   checked:true },
  { id:'np6', label:'System alerts',          sub:'Downtime, latency, or security events',    checked:true },
]

const NOTIFS_DEFAULT = [
  { id:1, ico:'💰', bg:'#eef2ff', txt:'<strong>New enterprise deal</strong> — Sarah Johnson upgraded to Enterprise Plan ($9,600)', time:'2 min ago', unread:true },
  { id:2, ico:'⚠️', bg:'#fee2e2', txt:"<strong>Payment failed</strong> — Olivia Davis's card was declined", time:'27 min ago', unread:true },
  { id:3, ico:'🔄', bg:'#fef3c7', txt:'<strong>Refund requested</strong> — Ava Thompson ($9,600)', time:'1 hr ago', unread:true },
  { id:4, ico:'👤', bg:'#d1fae5', txt:'New user <strong>alex.kim@techco.io</strong> signed up', time:'14 min ago', unread:false },
]

const NAV_ITEMS = [
  { label:'Overview', items:[
    { icon:'🏠', name:'Dashboard',    section:'Overview' },
    { icon:'📈', name:'Analytics',    section:'Overview' },
    { icon:'🛒', name:'Orders',       section:'Overview', badge:'24' },
    { icon:'📦', name:'Products',     section:'Overview' },
  ]},
  { label:'Customers', items:[
    { icon:'👥', name:'All Customers', section:'Customers' },
    { icon:'⭐', name:'VIP Accounts',  section:'Customers' },
    { icon:'📬', name:'Campaigns',     section:'Customers', badge:'3', badgeRed:true },
  ]},
  { label:'Finance', items:[
    { icon:'💰', name:'Revenue',       section:'Finance' },
    { icon:'🔄', name:'Subscriptions', section:'Finance' },
    { icon:'🧾', name:'Invoices',      section:'Finance' },
  ]},
  { label:'System', items:[
    { icon:'⚙️', name:'Settings',  section:'System' },
    { icon:'🔐', name:'Security',  section:'System' },
  ]},
]

// ─── TOAST ────────────────────────────────────────────────────────────────────
let toastIdCounter = 0

function ToastItem({ id, msg, type, onRemove }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const t = setTimeout(() => { setVisible(false); setTimeout(() => onRemove(id), 300) }, 3500)
    return () => clearTimeout(t)
  }, [])
  return <div className={`toast toast-${type}${visible ? ' show' : ''}`}>{msg}</div>
}

// ─── SPARKLINE ────────────────────────────────────────────────────────────────
function Sparkline({ data, color }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const chart = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: data.map((_, i) => i),
        datasets: [{ data, borderColor: color, borderWidth: 2, fill: true,
          backgroundColor: color + '18', tension: 0.4, pointRadius: 0, pointHoverRadius: 0 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } },
      }
    })
    return () => chart.destroy()
  }, [])
  return <canvas ref={canvasRef} />
}

// ─── KPI CARD ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, delta, deltaType, compare, sparkData, sparkColor, glowColor, ico, icoBg, onClick }) {
  return (
    <div className="kpi" onClick={onClick} style={{ cursor:'pointer' }}>
      <div className="kpi-glow" style={{ background:glowColor }} />
      <div className="kpi-top">
        <span className="kpi-lbl">{label}</span>
        <div className="kpi-ico" style={{ background:icoBg }}>{ico}</div>
      </div>
      <div className="kpi-val">{value}</div>
      <div className="kpi-delta"><span className={`delta-chip ${deltaType}`}>{delta}</span></div>
      <div className="kpi-cmp">{compare}</div>
      <div className="spark"><Sparkline data={sparkData} color={sparkColor} /></div>
    </div>
  )
}

// ─── REVENUE CHART ────────────────────────────────────────────────────────────
function RevenueChart({ activeTab, darkMode }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    const d = CHART_DATA[activeTab]
    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: d.labels,
        datasets: [
          { label: d.curLbl, data: d.cur, borderColor:'#6366f1', backgroundColor:'rgba(99,102,241,0.08)',
            borderWidth:2.5, fill:true, tension:0.4, pointBackgroundColor:'#6366f1',
            pointRadius:4, pointHoverRadius:7, pointBorderColor:'#fff', pointBorderWidth:2 },
          { label: d.prevLbl, data: d.prev, borderColor:'#e2e8f0', backgroundColor:'transparent',
            borderWidth:2, fill:false, tension:0.4, pointBackgroundColor:'#cbd5e1',
            pointRadius:3, pointHoverRadius:5, borderDash:[5,4] },
        ]
      },
      options: {
        responsive:true, maintainAspectRatio:false,
        interaction: { mode:'index', intersect:false },
        plugins: {
          legend: { position:'top', labels:{ usePointStyle:true, boxWidth:7, padding:16, font:{size:12} } },
          tooltip: { callbacks: { label: ctx => ` $${ctx.parsed.y.toLocaleString()}` } },
        },
        scales: {
          x: { grid:{display:false}, ticks:{font:{size:12}, color:'#94a3b8'} },
          y: { grid:{color:'#f1f5f9'}, ticks:{font:{size:12}, color:'#94a3b8', callback: v => '$'+(v/1000).toFixed(0)+'k'}, beginAtZero:false },
        }
      }
    })
    return () => chartRef.current?.destroy()
  }, [])

  useEffect(() => {
    if (!chartRef.current) return
    const d = CHART_DATA[activeTab]
    chartRef.current.data.labels = d.labels
    chartRef.current.data.datasets[0].data  = d.cur
    chartRef.current.data.datasets[0].label = d.curLbl
    chartRef.current.data.datasets[1].data  = d.prev
    chartRef.current.data.datasets[1].label = d.prevLbl
    chartRef.current.options.scales.y.ticks.callback = activeTab === 'weekly'
      ? v => '$'+(v/1000).toFixed(1)+'k'
      : v => '$'+(v/1000).toFixed(0)+'k'
    chartRef.current.update('active')
  }, [activeTab])

  useEffect(() => {
    if (!chartRef.current) return
    const gridColor = darkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9'
    chartRef.current.options.scales.y.grid.color = gridColor
    chartRef.current.update()
  }, [darkMode])

  return <canvas ref={canvasRef} />
}

// ─── DONUT CHART ──────────────────────────────────────────────────────────────
function DonutChart() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const chart = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Enterprise','Pro Annual','Pro Monthly','Starter','Add-ons'],
        datasets: [{ data:[38,27,18,11,6], backgroundColor:['#6366f1','#10b981','#f59e0b','#ec4899','#94a3b8'], borderWidth:0, hoverOffset:10 }]
      },
      options: {
        responsive:true, maintainAspectRatio:false, cutout:'70%',
        plugins: {
          legend: { position:'bottom', labels:{ usePointStyle:true, boxWidth:8, padding:12, font:{size:12} } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` } },
        }
      }
    })
    return () => chart.destroy()
  }, [])
  return <canvas ref={canvasRef} />
}

// ─── ORDER ROW ────────────────────────────────────────────────────────────────
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

// ─── CHARTS SECTION ───────────────────────────────────────────────────────────
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

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ activeTab, onTabChange, onOpenKpiPanel, showToast, dateRange, onDateRangeChange, onOpenReportModal, onOpenTxnModal, darkMode, showDateDd, onToggleDateDd, onCloseDateDd }) {
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

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
function SettingsPage({ showToast, onExportCSV }) {
  const [prefs, setPrefs] = useState(NOTIF_PREFS_DEFAULT.map(p => ({ ...p })))

  function togglePref(id) {
    const current = prefs.find(p => p.id === id)
    showToast(current?.checked ? 'Notification disabled' : 'Notification enabled', 'info')
    setPrefs(prev => prev.map(p => p.id === id ? { ...p, checked: !p.checked } : p))
  }

  return (
    <div style={{ maxWidth:720 }}>
      <div className="card" style={{ marginBottom:18 }}>
        <div className="card-head">
          <div><div className="card-ttl">Profile</div><div className="card-sub">Manage your personal information</div></div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:18, marginBottom:22 }}>
          <div className="top-ava" style={{ width:60, height:60, fontSize:22, borderRadius:16, flexShrink:0 }}>TO</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:3 }}>Tetsugaku O.</div>
            <div style={{ fontSize:13, color:'var(--t3)' }}>admin@datapulse.io · Administrator</div>
          </div>
          <button className="btn btn-accent" onClick={() => showToast('Profile photo upload coming soon','info')}>Change Photo</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <div className="modal-row" style={{ marginBottom:0 }}>
            <label className="modal-label">Full Name</label>
            <input className="modal-input" type="text" defaultValue="Tetsugaku O." />
          </div>
          <div className="modal-row" style={{ marginBottom:0 }}>
            <label className="modal-label">Email Address</label>
            <input className="modal-input" type="email" defaultValue="admin@datapulse.io" />
          </div>
          <div className="modal-row" style={{ marginBottom:0 }}>
            <label className="modal-label">Role</label>
            <input className="modal-input" type="text" defaultValue="Administrator" readOnly style={{ opacity:0.6, cursor:'default' }} />
          </div>
          <div className="modal-row" style={{ marginBottom:0 }}>
            <label className="modal-label">Time Zone</label>
            <select className="modal-select">
              <option>UTC+9 Tokyo</option><option>UTC+0 London</option>
              <option>UTC-5 New York</option><option>UTC-8 Los Angeles</option>
            </select>
          </div>
        </div>
        <div className="modal-footer" style={{ marginTop:18 }}>
          <button className="btn btn-accent" onClick={() => showToast('Profile saved successfully','success')}>Save Changes</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom:18 }}>
        <div className="card-head">
          <div><div className="card-ttl">Notification Preferences</div><div className="card-sub">Choose what events you want to be notified about</div></div>
        </div>
        {prefs.map(p => (
          <div key={p.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid var(--border)' }}>
            <div>
              <div style={{ fontSize:'13.5px', fontWeight:600, marginBottom:2 }}>{p.label}</div>
              <div style={{ fontSize:12, color:'var(--t3)' }}>{p.sub}</div>
            </div>
            <label style={{ position:'relative', display:'inline-block', width:42, height:24, cursor:'pointer', flexShrink:0 }}>
              <input type="checkbox" checked={p.checked} onChange={() => togglePref(p.id)} style={{ opacity:0, width:0, height:0 }} />
              <span style={{ position:'absolute', inset:0, borderRadius:34, background:p.checked ? 'var(--accent)' : 'var(--border)', transition:'0.2s' }} />
              <span style={{ position:'absolute', left:3, top:3, width:18, height:18, borderRadius:'50%', background:'#fff', transition:'0.2s', transform:p.checked ? 'translateX(18px)' : 'none' }} />
            </label>
          </div>
        ))}
      </div>

      <div className="card" style={{ borderColor:'#fecaca' }}>
        <div className="card-head">
          <div><div className="card-ttl" style={{ color:'var(--danger)' }}>Danger Zone</div><div className="card-sub">Irreversible actions — proceed with caution</div></div>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderBottom:'1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize:'13.5px', fontWeight:600 }}>Export all data</div>
            <div style={{ fontSize:12, color:'var(--t3)', marginTop:2 }}>Download all your analytics data as a CSV archive</div>
          </div>
          <button className="btn" onClick={onExportCSV}>Export Data</button>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0' }}>
          <div>
            <div style={{ fontSize:'13.5px', fontWeight:600, color:'var(--danger)' }}>Delete account</div>
            <div style={{ fontSize:12, color:'var(--t3)', marginTop:2 }}>Permanently remove your account and all data</div>
          </div>
          <button className="btn" style={{ borderColor:'#fecaca', color:'var(--danger)' }}
            onClick={() => showToast('Please contact support to delete your account','warn')}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── LOGIN OVERLAY ────────────────────────────────────────────────────────────
function LoginOverlay({ onLogin, showToast }) {
  const [email, setEmail] = useState('admin@datapulse.io')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')

  function handleLogin() {
    setError('')
    const e = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { setError('Please enter a valid email address.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (e !== 'admin@datapulse.io' || password !== 'password123') { setError('Incorrect credentials. Try the demo login below.'); return }
    onLogin()
  }

  return (
    <div className="overlay">
      <div className="login-box">
        <div className="lbox-logo">
          <div className="logo-mark" style={{ width:38, height:38, borderRadius:10, fontSize:19 }}>📊</div>
          <span style={{ fontSize:19, fontWeight:800 }}>DataPulse <span className="logo-pro">PRO</span></span>
        </div>
        <h2 className="lbox-h">Welcome back 👋</h2>
        <p className="lbox-s">Sign in to access your analytics dashboard</p>
        <div className="social-btns">
          <button className="social-btn" onClick={() => showToast('Google OAuth is coming soon. Please use email login for now.','info')}>🔵 Google</button>
          <button className="social-btn" onClick={() => showToast('GitHub OAuth is coming soon. Please use email login for now.','info')}>⬛ GitHub</button>
        </div>
        <div className="divider"><div className="div-line" /><span className="div-txt">or continue with email</span><div className="div-line" /></div>
        <div className="fgroup">
          <label className="flabel">Email address</label>
          <input className="finput" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" />
        </div>
        <div className="fgroup">
          <a href="#" className="forgot" onClick={e => {
            e.preventDefault()
            const em = email.trim()
            if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { showToast('Enter your email address first.','warn'); return }
            showToast(`Password reset link sent to ${em}`,'success')
          }}>Forgot password?</a>
          <label className="flabel">Password</label>
          <input className="finput" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password"
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>
        {error && <div className="login-error">{error}</div>}
        <button className="lbtn" onClick={handleLogin}>Sign in to Dashboard →</button>
        <p className="signup-link" style={{ marginTop:16 }}>
          New to DataPulse? <a href="#" onClick={e => { e.preventDefault(); showToast('14-day free trial sign-up page coming soon!','info') }}>Start your 14-day free trial</a>
        </p>
        <div className="demo-chip">
          <span>🔑</span>
          <span><strong>Demo login:</strong> admin@datapulse.io &nbsp;/&nbsp; password123</span>
        </div>
      </div>
    </div>
  )
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ currentPage, onNavigate, workspace, onSwitchWorkspace, onSignOut, showToast }) {
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

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
function Topbar({ currentPage, currentSection, onOpenCp, darkMode, onToggleDark, onOpenKbModal, showToast, notifications, onDismissNotif, onMarkAllRead }) {
  const [showNotifPanel, setShowNotifPanel] = useState(false)
  const [showAvaMenu, setShowAvaMenu] = useState(false)
  const unreadCount = notifications.filter(n => n.unread).length

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

// ─── REPORT MODAL ─────────────────────────────────────────────────────────────
function ReportModal({ open, onClose, showToast }) {
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

// ─── TRANSACTIONS MODAL ───────────────────────────────────────────────────────
function TransactionsModal({ open, onClose }) {
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

// ─── KPI PANEL ────────────────────────────────────────────────────────────────
function KpiPanel({ open, type, onClose }) {
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

// ─── COMMAND PALETTE ──────────────────────────────────────────────────────────
function CommandPalette({ open, onClose, onNavigate, onToggleDark, showToast, onOpenReportModal, onOpenTxnModal, onOpenKpiPanel }) {
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

  useEffect(() => { setActiveIdx(filtered.length > 0 ? 0 : -1) }, [query])

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
            ? <div className="cp-empty">No results for "<strong>{query}</strong>"</div>
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

// ─── KEYBOARD SHORTCUTS MODAL ─────────────────────────────────────────────────
function KeyboardShortcutsModal({ open, onClose }) {
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

// ─── APP (ROOT) ───────────────────────────────────────────────────────────────
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

  // Dark mode
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

  function exportCSV() {
    const headers = ['Order','Customer','Email','Plan','Amount','Status','Date']
    const rows = ORDERS.map(o => [o.id, o.name, o.email, o.plan, o.amt, o.status, o.date])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type:'text/csv' })
    const url = URL.createObjectURL(blob)
    Object.assign(document.createElement('a'), { href:url, download:'datapulse-transactions.csv' }).click()
    URL.revokeObjectURL(url)
    showToast('Transactions exported as CSV','success')
  }

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
      if (k === '?')                      { e.preventDefault(); setShowKbModal(true); return }
      if (k === 'd' || k === 'D')         { setDarkMode(v => !v); return }
      if (k === 't' || k === 'T')         { setShowTxnModal(true); return }
      if (k === 'n' || k === 'N')         { setShowReportModal(true); return }
      if (k === 'e' || k === 'E')         { exportCSV(); return }
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
  }, [])

  const isSettings = currentPage === 'Settings'

  return (
    <>
      {/* Toast container */}
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

      <ReportModal      open={showReportModal}  onClose={() => setShowReportModal(false)} showToast={showToast} />
      <TransactionsModal open={showTxnModal}    onClose={() => setShowTxnModal(false)} />
      <KpiPanel          open={showKpiPanel}    type={kpiPanelType} onClose={() => setShowKpiPanel(false)} />
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
      <KeyboardShortcutsModal open={showKbModal} onClose={() => setShowKbModal(false)} />
    </>
  )
}
