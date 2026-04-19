import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { signIn } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  if (user) { navigate('/admin'); return null }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(email, password)
      toast.success('Login berhasil!')
      navigate('/admin')
    } catch {
      toast.error('Email atau password salah')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem',
      background:'radial-gradient(ellipse at center, rgba(26,92,56,0.2) 0%, var(--green-deepest) 70%)'
    }}>
      <div style={{ width:'100%', maxWidth:'420px' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{
            width:'70px', height:'70px', borderRadius:'50%',
            background:'linear-gradient(135deg,var(--green-mid),var(--green-bright))',
            border:'3px solid var(--gold)', margin:'0 auto 1rem',
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem'
          }}>☪</div>
          <h1 style={{ fontFamily:'Playfair Display,serif', color:'var(--gold-light)', fontSize:'1.8rem' }}>
            Login Pengurus
          </h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.9rem', marginTop:'0.4rem' }}>
            Masuk ke panel admin masjid
          </p>
        </div>
        <form onSubmit={handleLogin} style={{
          background:'var(--card-bg)', border:'1px solid var(--card-border)',
          borderRadius:'var(--radius)', padding:'2rem', display:'flex', flexDirection:'column', gap:'1.25rem'
        }}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="input-field" type="email" placeholder="admin@masjid.id"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="input-field" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-gold"
            style={{ justifyContent:'center', opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? '⏳ Memproses...' : '🔐 Masuk'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'0.85rem', color:'var(--text-muted)' }}>
          <a href="/" style={{ color:'var(--gold)' }}>← Kembali ke Beranda</a>
        </p>
      </div>
    </div>
  )
}
