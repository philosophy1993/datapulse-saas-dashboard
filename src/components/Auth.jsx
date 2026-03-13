import { useState } from 'react'

export function LoginOverlay({ onLogin, showToast }) {
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
