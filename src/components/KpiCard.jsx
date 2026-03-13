import { Sparkline } from './Charts.jsx'

export function KpiCard({ label, value, delta, deltaType, compare, sparkData, sparkColor, glowColor, ico, icoBg, onClick }) {
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
