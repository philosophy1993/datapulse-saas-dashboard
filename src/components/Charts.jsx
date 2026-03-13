import { useRef, useEffect } from 'react'
import { Chart } from 'chart.js'
import { CHART_DATA } from '../data.js'

export function Sparkline({ data, color }) {
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
  }, [color, data])
  return <canvas ref={canvasRef} />
}

export function RevenueChart({ activeTab, darkMode }) {
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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- chart init runs once on mount

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

export function DonutChart() {
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
