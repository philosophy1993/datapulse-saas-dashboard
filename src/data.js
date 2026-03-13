// ─── DATA ────────────────────────────────────────────────────────────────────
export const ORDERS = [
  { id:'#7291', name:'Sarah Johnson',  email:'sarah@acme.com',       plan:'Enterprise Annual',  amt:'$9,600', status:'paid',   date:'Mar 7', col:'#6366f1' },
  { id:'#7290', name:'Michael Chen',   email:'m.chen@startup.io',    plan:'Pro Annual',         amt:'$2,388', status:'paid',   date:'Mar 6', col:'#10b981' },
  { id:'#7289', name:'Emma Williams',  email:'emma@designco.com',    plan:'Starter Plan',       amt:'$348',   status:'pend',   date:'Mar 6', col:'#f59e0b' },
  { id:'#7288', name:'James Roberts',  email:'j.roberts@tech.co',    plan:'Pro Monthly',        amt:'$199',   status:'paid',   date:'Mar 5', col:'#ec4899' },
  { id:'#7287', name:'Olivia Davis',   email:'olivia@free.net',      plan:'Add-on: Analytics',  amt:'$49',    status:'fail',   date:'Mar 5', col:'#8b5cf6' },
  { id:'#7286', name:'Noah Martinez',  email:'noah@growthco.com',    plan:'Pro Annual',         amt:'$2,388', status:'paid',   date:'Mar 4', col:'#06b6d4' },
  { id:'#7285', name:'Ava Thompson',   email:'ava@commerce.io',      plan:'Enterprise Annual',  amt:'$9,600', status:'refund', date:'Mar 4', col:'#f97316' },
  { id:'#7284', name:'Lucas Anderson', email:'l.anderson@bigco.com', plan:'Pro Monthly',        amt:'$199',   status:'paid',   date:'Mar 3', col:'#14b8a6' },
]

export const ALL_ORDERS = [
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

export const FEED_DATA = [
  { ico:'💰', bg:'#eef2ff', txt:'<strong>Sarah Johnson</strong> upgraded to Enterprise Plan', time:'2 min ago' },
  { ico:'👤', bg:'#d1fae5', txt:'New user <strong>alex.kim@techco.io</strong> signed up', time:'14 min ago' },
  { ico:'⚠️', bg:'#fee2e2', txt:'Payment failed for <strong>Olivia Davis</strong> — card declined', time:'27 min ago' },
  { ico:'🔄', bg:'#fef3c7', txt:'<strong>Ava Thompson</strong> requested a refund ($9,600)', time:'1 hr ago' },
  { ico:'📦', bg:'#f3e8ff', txt:'<strong>Noah Martinez</strong> added the Analytics add-on', time:'2 hr ago' },
  { ico:'📧', bg:'#ecfeff', txt:'Monthly billing report sent to <strong>3 admins</strong>', time:'3 hr ago' },
  { ico:'🔐', bg:'#fce7f3', txt:'2FA enabled for <strong>james.roberts@tech.co</strong>', time:'5 hr ago' },
]

export const CHART_DATA = {
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

export const KPI_DATA = {
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

export const NOTIF_PREFS_DEFAULT = [
  { id:'np1', label:'New enterprise deals',  sub:'Get notified when a deal > $5,000 closes', checked:true },
  { id:'np2', label:'Payment failures',       sub:'Alerts for failed or declined payments',   checked:true },
  { id:'np3', label:'Refund requests',        sub:'When a customer requests a refund',        checked:true },
  { id:'np4', label:'New user sign-ups',      sub:'Daily digest of new registrations',        checked:false },
  { id:'np5', label:'Weekly report',          sub:'Automated revenue summary every Monday',   checked:true },
  { id:'np6', label:'System alerts',          sub:'Downtime, latency, or security events',    checked:true },
]

export const NOTIFS_DEFAULT = [
  { id:1, ico:'💰', bg:'#eef2ff', txt:'<strong>New enterprise deal</strong> — Sarah Johnson upgraded to Enterprise Plan ($9,600)', time:'2 min ago', unread:true },
  { id:2, ico:'⚠️', bg:'#fee2e2', txt:"<strong>Payment failed</strong> — Olivia Davis's card was declined", time:'27 min ago', unread:true },
  { id:3, ico:'🔄', bg:'#fef3c7', txt:'<strong>Refund requested</strong> — Ava Thompson ($9,600)', time:'1 hr ago', unread:true },
  { id:4, ico:'👤', bg:'#d1fae5', txt:'New user <strong>alex.kim@techco.io</strong> signed up', time:'14 min ago', unread:false },
]

export const NAV_ITEMS = [
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
