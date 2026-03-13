import { useState } from 'react'
import { NOTIF_PREFS_DEFAULT } from '../data.js'

export function SettingsPage({ showToast, onExportCSV }) {
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
