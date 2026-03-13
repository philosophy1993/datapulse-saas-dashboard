export function exportOrdersCSV(orders, showToast) {
  const headers = ['Order','Customer','Email','Plan','Amount','Status','Date']
  const rows = orders.map(o => [o.id, o.name, o.email, o.plan, o.amt, o.status, o.date])
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type:'text/csv' })
  const url = URL.createObjectURL(blob)
  Object.assign(document.createElement('a'), { href:url, download:'datapulse-transactions.csv' }).click()
  URL.revokeObjectURL(url)
  showToast('Transactions exported as CSV','success')
}
