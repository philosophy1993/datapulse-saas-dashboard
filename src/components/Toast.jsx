import { useState, useEffect } from 'react'

export function ToastItem({ id, msg, type, onRemove }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const t1 = setTimeout(() => {
      setVisible(false)
      const t2 = setTimeout(() => onRemove(id), 300)
      return () => clearTimeout(t2)
    }, 3500)
    return () => clearTimeout(t1)
  }, [id, onRemove])
  return <div className={`toast toast-${type}${visible ? ' show' : ''}`}>{msg}</div>
}
