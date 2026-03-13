import { useState, useEffect } from 'react'

export let toastIdCounter = 0

export function ToastItem({ id, msg, type, onRemove }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const t = setTimeout(() => { setVisible(false); setTimeout(() => onRemove(id), 300) }, 3500)
    return () => clearTimeout(t)
  }, [id, onRemove])
  return <div className={`toast toast-${type}${visible ? ' show' : ''}`}>{msg}</div>
}
