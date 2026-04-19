import { useState, useEffect } from 'react'
import { usePrayerTimes } from '../hooks/usePrayerTimes'
import { getMosqueInfo, getPengurus, getAgenda, getTausiyah, getLaporanInfaq, getJadwalImam } from '../lib/firebase'
import '../styles/landing.css'

const THEMES = {
  emerald:  { label:'Hijau Emerald', primary:'#1a5c38' },
  royal:    { label:'Biru Royal',    primary:'#1a3a6b' },
  golden:   { label:'Coklat Emas',   primary:'#7c4a1e' },
  maroon:   { label:'Ungu Maroon',   primary:'#6b1a4a' },
  elegant:  { label:'Hitam Elegan',  primary:'#2a2a2a' },
  burgundy: { label:'Merah Burgundy',primary:'#7c1a1a' },
  teal:     { label:'Biru Teal',     primary:'#0f6b6b' },
}

const FALLBACK = {
  info: {
    nama:'Masjid Al-Ikhlas', tagline:'Memakmurkan Masjid, Mempererat Ukhuwah',
    alamat:'Jl. Masjid No. 1, Surabaya, Jawa Timur', telepon:'031-1234567',
    email:'info@masjid-alikhlas.id', no_rekening:'1234-5678-9012',
    bank:'Bank Syariah Indonesia', atas_nama:'Masjid Al-Ikhlas',
    lat:-7.2575, lng:112.7521, logo_url:null, hero_url:null, qris_url:null, tema:'emerald',
    ayat:'إِنَّمَا يَعْمُرُ مَسَاجِدَ اللَّهِ مَنْ آمَنَ بِاللَّهِ وَالْيَوْمِ الْآخِرِ',
    terjemah_ayat:'Sesungguhnya yang memakmurkan masjid-masjid Allah hanyalah orang yang beriman kepada Allah dan hari kemudian (At-Taubah: 18)',
  },
  pengurus: [
    {id:1,nama:'H. Ahmad Fauzi, M.Ag',jabatan:'Ketua Takmir',foto_url:null,urutan:1},
    {id:2,nama:'Drs. Muhammad Ridwan',jabatan:'Wakil Ketua',foto_url:null,urutan:2},
    {id:3,nama:'Hj. Siti Aminah, S.Pd',jabatan:'Sekretaris',foto_url:null,urutan:3},
    {id:4,nama:'Ir. Bambang Santoso',jabatan:'Bendahara',foto_url:null,urutan:4},
    {id:5,nama:'Ustadz Yusuf Rahman',jabatan:'Sie Ibadah',foto_url:null,urutan:5},
    {id:6,nama:'Bapak Hendra Wijaya',jabatan:'Sie Kebersihan',foto_url:null,urutan:6},
  ],
  agenda: [
    {id:1,judul:'Kajian Rutin Ahad',deskripsi:'Kajian kitab Riyadhus Shalihin',tanggal:'2025-04-20',waktu:'07:00',tempat:'Masjid Al-Ikhlas'},
    {id:2,judul:'Sholat Jumat Berjamaah',deskripsi:'Khutbah Jumat oleh Ust. Yusuf Rahman',tanggal:'2025-04-18',waktu:'11:30',tempat:'Masjid Al-Ikhlas'},
  ],
  jadwal: [
    {id:1,tanggal:'2025-04-18',jenis:'Jumat',imam:'Ustadz Yusuf Rahman',khatib:'Ustadz Ahmad Fauzi'},
    {id:2,tanggal:'2025-04-25',jenis:'Jumat',imam:'Ustadz Muhammad Ridwan',khatib:'Ustadz Yusuf Rahman'},
  ],
  tausiyah: [
    {id:1,judul:'Keutamaan Sholat Berjamaah',penceramah:'Ustadz Ahmad Fauzi',isi:'Sholat berjamaah memiliki keutamaan 27 derajat lebih tinggi dibandingkan sholat sendirian...',tanggal:'2025-04-15',thumbnail_url:null},
    {id:2,judul:'Fadilah Infaq di Jalan Allah',penceramah:'Ustadz Muhammad Ridwan',isi:'Allah SWT berjanji akan melipatgandakan setiap infaq yang kita keluarkan di jalan-Nya...',tanggal:'2025-04-05',thumbnail_url:null},
  ],
  laporan: [
    {id:1,periode:'Maret 2025',total_pemasukan:12500000,total_pengeluaran:8750000},
    {id:2,periode:'Februari 2025',total_pemasukan:10800000,total_pengeluaran:7200000},
  ],
}

const fmtRp = (n) => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',minimumFractionDigits:0}).format(n||0)
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('id-ID',{weekday:'long',year:'numeric',month:'long',day:'numeric'}) : '-'
const fmtDateShort = (d) => d ? new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'}) : '-'

function Navbar({ info }) {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive]   = useState('')
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  const go = (id) => { document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); setOpen(false); setActive(id) }
  const menus = [
    {label:'Beranda',id:'hero'},
    {label:'Tentang',sub:[
      {label:'Info Masjid',id:'info'},
      {label:'Dewan Pengurus',id:'pengurus'},
      {label:'Pengurus Harian',id:'pengurus-harian'},
    ]},
    {label:'Waktu Sholat',id:'prayer'},
    {label:'Jadwal',sub:[
      {label:'Agenda Masjid',id:'agenda'},
      {label:'Imam & Khatib',id:'jadwal'},
    ]},
    {label:'Tausiyah',id:'tausiyah'},
    {label:'Keuangan',sub:[
      {label:'Laporan Infaq',id:'laporan'},
      {label:'Mari Berinfaq',id:'infaq'},
    ]},
  ]
  return (
    <nav className={`navbar ${scrolled?'scrolled':''}`}>
      <div className="nav-inner">
        <button className="nav-logo" onClick={()=>go('hero')}>
          {info?.logo_url ? <img src={info.logo_url} alt="Logo" className="logo-img"/> : <div className="logo-placeholder">☪</div>}
          <span className="nav-name">{info?.nama||'Masjid App'}</span>
        </button>
        <ul className={`nav-links ${open?'open':''}`}>
          {menus.map(m => m.sub ? (
            <li key={m.label} className="has-sub">
              <span>{m.label} ▾</span>
              <ul className="submenu">{m.sub.map(s=><li key={s.id}><button onClick={()=>go(s.id)}>{s.label}</button></li>)}</ul>
            </li>
          ) : (
            <li key={m.id}><button className={active===m.id?'active':''} onClick={()=>go(m.id)}>{m.label}</button></li>
          ))}
          <li><a href="/admin" className="btn-gold nav-admin">Admin</a></li>
        </ul>
        <button className="hamburger" onClick={()=>setOpen(!open)}><span/><span/><span/></button>
      </div>
    </nav>
  )
}

function Hero({ info }) {
  return (
    <section id="hero" className="hero">
      <div className="hero-bg">
        {info?.hero_url && <img src={info.hero_url} alt="" className="hero-img-bg"/>}
        <div className="hero-overlay"/>
        <div className="hero-pattern"/>
      </div>
      <div className="hero-content">
        <div className="hero-badge">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
        <p className="arabic hero-arabic">{info?.ayat||FALLBACK.info.ayat}</p>
        <p className="hero-terjemah">{info?.terjemah_ayat||FALLBACK.info.terjemah_ayat}</p>
        <div className="ornament"/>
        <h1 className="hero-title">{info?.nama||FALLBACK.info.nama}</h1>
        <p className="hero-tagline">{info?.tagline||FALLBACK.info.tagline}</p>
        <div className="hero-actions">
          <button className="btn-gold" onClick={()=>document.getElementById('infaq')?.scrollIntoView({behavior:'smooth'})}>💝 Mari Berinfaq</button>
          <button className="btn-green" onClick={()=>document.getElementById('prayer')?.scrollIntoView({behavior:'smooth'})}>🕌 Waktu Sholat</button>
        </div>
      </div>
      <div className="hero-scroll-hint"><div className="scroll-arrow">↓</div></div>
    </section>
  )
}

function PrayerSection({ info }) {
  const lat = parseFloat(info?.lat)||(-7.2575)
  const lng = parseFloat(info?.lng)||(112.7521)
  const { times, nextPrayer, countdown } = usePrayerTimes(lat, lng)
  return (
    <section id="prayer" className="section prayer-section">
      <div className="container">
        <div className="section-title">
          <h2>Waktu Sholat</h2>
          <p>{new Date().toLocaleDateString('id-ID',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
        </div>
        {nextPrayer && (
          <div className="next-prayer-banner card">
            <p className="next-label">Waktu Sholat Berikutnya</p>
            <h3 className="next-name">{nextPrayer.name}</h3>
            <p className="next-time">{nextPrayer.fmt}</p>
            <p className="next-countdown pulse">{countdown}</p>
          </div>
        )}
        <div className="prayer-grid">
          {(times||[]).map(p=>(
            <div key={p.key} className={`prayer-card card ${nextPrayer?.key===p.key?'active-prayer':''}`}>
              <p className="prayer-name">{p.name}</p>
              <p className="prayer-time">{p.fmt}</p>
              {nextPrayer?.key===p.key && <span className="badge badge-gold">Berikutnya</span>}
            </div>
          ))}
        </div>
        <p className="prayer-note">📍 {info?.alamat||FALLBACK.info.alamat}</p>
      </div>
    </section>
  )
}

function PengurusSection({ pengurus }) {
  const dewan = pengurus.filter(p=>p.urutan<=4)
  return (
    <section id="pengurus" className="section">
      <div className="container">
        <div className="section-title"><h2>Dewan Pengurus Masjid</h2><p>Amanah untuk memakmurkan rumah Allah</p></div>
        <div className="pengurus-grid">
          {dewan.map(p=>(
            <div key={p.id} className="pengurus-card card">
              <div className="foto-wrap">{p.foto_url?<img src={p.foto_url} alt={p.nama}/>:<div className="foto-placeholder">👤</div>}</div>
              <h3>{p.nama}</h3><p className="jabatan">{p.jabatan}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PengurusHarianSection({ pengurus }) {
  const harian = pengurus.filter(p=>p.urutan>4)
  return (
    <section id="pengurus-harian" className="section section-alt">
      <div className="container">
        <div className="section-title"><h2>Pengurus Harian</h2><p>Tim yang bekerja setiap hari untuk masjid</p></div>
        <div className="harian-grid">
          {harian.map(p=>(
            <div key={p.id} className="harian-card card">
              <div className="harian-foto">{p.foto_url?<img src={p.foto_url} alt={p.nama}/>:<div className="foto-sm-placeholder">👤</div>}</div>
              <div><h4>{p.nama}</h4><p className="jabatan-sm">{p.jabatan}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AgendaSection({ agenda }) {
  return (
    <section id="agenda" className="section">
      <div className="container">
        <div className="section-title"><h2>Agenda Masjid</h2><p>Kegiatan dan program masjid yang akan datang</p></div>
        <div className="agenda-list">
          {agenda.map(a=>(
            <div key={a.id} className="agenda-item card">
              <div className="agenda-date">
                <span className="agenda-day">{new Date(a.tanggal).getDate()}</span>
                <span className="agenda-mon">{new Date(a.tanggal).toLocaleString('id-ID',{month:'short'})}</span>
              </div>
              <div className="agenda-body">
                <h3>{a.judul}</h3><p>{a.deskripsi}</p>
                <div className="agenda-meta"><span>🕐 {a.waktu}</span><span>📍 {a.tempat}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function JadwalSection({ jadwal }) {
  const JENIS_COLOR = { Jumat:'badge-green', 'Idul Fitri':'badge-gold', 'Idul Adha':'badge-blue' }
  return (
    <section id="jadwal" className="section section-alt">
      <div className="container">
        <div className="section-title"><h2>Jadwal Imam & Khatib</h2><p>Jadwal pelaksanaan sholat Jumat dan hari raya</p></div>
        <div className="jadwal-grid">
          {jadwal.map(j=>(
            <div key={j.id} className="jadwal-card card">
              <div className="jadwal-top">
                <span className={`badge ${JENIS_COLOR[j.jenis]||'badge-gold'}`}>{j.jenis}</span>
                <span className="jadwal-date">📅 {fmtDateShort(j.tanggal)}</span>
              </div>
              <div className="jadwal-row"><span className="jadwal-label">🕌 Imam</span><span className="jadwal-val">{j.imam}</span></div>
              <div className="jadwal-row"><span className="jadwal-label">🎙 Khatib</span><span className="jadwal-val">{j.khatib}</span></div>
              {j.catatan && <p className="jadwal-catatan">{j.catatan}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function LaporanSection({ laporan }) {
  return (
    <section id="laporan" className="section">
      <div className="container">
        <div className="section-title"><h2>Laporan Infaq</h2><p>Transparansi pengelolaan keuangan masjid</p></div>
        <div className="laporan-grid">
          {laporan.map(l=>{
            const saldo=(l.total_pemasukan||0)-(l.total_pengeluaran||0)
            return (
              <div key={l.id} className="laporan-card card">
                <div className="laporan-header">
                  <h3>{l.periode}</h3>
                  <span className={`badge ${saldo>=0?'badge-green':'badge-red'}`}>{saldo>=0?'Surplus':'Defisit'}</span>
                </div>
                <div className="laporan-rows">
                  <div className="laporan-row"><span>Pemasukan</span><span className="income">{fmtRp(l.total_pemasukan)}</span></div>
                  <div className="laporan-row"><span>Pengeluaran</span><span className="expense">{fmtRp(l.total_pengeluaran)}</span></div>
                  <div className="laporan-row laporan-saldo"><span>Saldo</span><span>{fmtRp(saldo)}</span></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function InfaqSection({ info }) {
  const [copied, setCopied]     = useState(false)
  const [showQris, setShowQris] = useState(false)
  const rek     = info?.no_rekening||FALLBACK.info.no_rekening
  const qrisUrl = info?.qris_url||null
  const copy = () => { navigator.clipboard.writeText(rek.replace(/[-\s]/g,'')); setCopied(true); setTimeout(()=>setCopied(false),2000) }
  return (
    <section id="infaq" className="section infaq-section">
      <div className="container">
        <div className="section-title"><h2>Mari Berinfaq</h2><p>Infaqkan sebagian rezeki Anda untuk kemakmuran masjid</p></div>
        <div className="infaq-wrapper">
          <div className="infaq-ayat card">
            <p className="arabic infaq-arabic">مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ</p>
            <p className="infaq-terjemah">"Perumpamaan orang yang menginfakkan hartanya di jalan Allah seperti sebutir biji yang menumbuhkan tujuh tangkai..." (Al-Baqarah: 261)</p>
          </div>
          <div className="infaq-rekening card">
            <h3>Rekening Infaq</h3>
            <div className="rek-bank">{info?.bank||FALLBACK.info.bank}</div>
            <div className="rek-number">
              <span>{rek}</span>
              <button className={`btn-copy ${copied?'copied':''}`} onClick={copy}>{copied?'✓ Disalin':'📋 Salin'}</button>
            </div>
            <div className="rek-name">a.n. {info?.atas_nama||FALLBACK.info.atas_nama}</div>
            {qrisUrl && (
              <>
                <div className="infaq-divider">atau bayar via QRIS</div>
                <div className="qris-wrap">
                  {showQris
                    ? <div className="qris-img-wrap"><img src={qrisUrl} alt="QRIS" className="qris-img"/><button className="qris-close" onClick={()=>setShowQris(false)}>✕ Tutup</button></div>
                    : <button className="btn-qris" onClick={()=>setShowQris(true)}>📱 Tampilkan QR Code QRIS</button>}
                </div>
              </>
            )}
            <p className="infaq-note">Jazakallahu Khairan 🤲<br/>Semoga infaq Anda menjadi amal jariyah</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function TausiyahSection({ tausiyah }) {
  const [sel, setSel] = useState(null)
  return (
    <section id="tausiyah" className="section">
      <div className="container">
        <div className="section-title"><h2>Tausiyah Terbaru</h2><p>Siraman rohani untuk jiwa yang tenang</p></div>
        <div className="tausiyah-grid">
          {tausiyah.map(t=>(
            <div key={t.id} className="tausiyah-card card" onClick={()=>setSel(t)}>
              <div className="tausiyah-thumb">{t.thumbnail_url?<img src={t.thumbnail_url} alt={t.judul}/>:<div className="thumb-placeholder">📖</div>}</div>
              <div className="tausiyah-body">
                <h3>{t.judul}</h3>
                <p className="tausiyah-penceramah">🎙 {t.penceramah}</p>
                <p className="tausiyah-date">📅 {fmtDate(t.tanggal)}</p>
                <p className="tausiyah-preview">{t.isi?.substring(0,100)}...</p>
                <button className="read-more">Baca Selengkapnya →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {sel && (
        <div className="modal-overlay" onClick={()=>setSel(null)}>
          <div className="modal-box card" onClick={e=>e.stopPropagation()}>
            <button className="modal-close" onClick={()=>setSel(null)}>✕</button>
            <h2>{sel.judul}</h2>
            <div className="modal-meta"><span>🎙 {sel.penceramah}</span><span>📅 {fmtDate(sel.tanggal)}</span></div>
            <div className="ornament"/>
            <p className="modal-isi">{sel.isi}</p>
          </div>
        </div>
      )}
    </section>
  )
}

function InfoSection({ info }) {
  const d = info||FALLBACK.info
  return (
    <section id="info" className="section section-alt">
      <div className="container">
        <div className="section-title"><h2>Info Masjid</h2><p>Informasi lengkap tentang {d.nama}</p></div>
        <div className="info-grid">
          <div className="info-card card"><h3>📍 Alamat</h3><p>{d.alamat}</p></div>
          <div className="info-card card"><h3>📞 Telepon</h3><p>{d.telepon}</p></div>
          <div className="info-card card"><h3>📧 Email</h3><p>{d.email}</p></div>
          <div className="info-card card"><h3>🏦 Rekening</h3><p>{d.bank}<br/>{d.no_rekening}<br/>a.n. {d.atas_nama}</p></div>
        </div>
      </div>
    </section>
  )
}

function Footer({ info }) {
  const d = info||FALLBACK.info
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <h2>{d.nama}</h2><p>{d.tagline}</p>
            <p className="arabic footer-arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          </div>
          <div className="footer-links">
            <h4>Navigasi</h4>
            {['hero','prayer','pengurus','agenda','jadwal','tausiyah','laporan','infaq','info'].map(id=>(
              <button key={id} onClick={()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'})}>
                {id==='hero'?'Beranda':id==='prayer'?'Waktu Sholat':id==='pengurus'?'Pengurus':
                 id==='jadwal'?'Imam & Khatib':id==='tausiyah'?'Tausiyah':
                 id==='laporan'?'Laporan Infaq':id==='infaq'?'Berinfaq':
                 id==='info'?'Info Masjid':id.charAt(0).toUpperCase()+id.slice(1)}
              </button>
            ))}
          </div>
          <div className="footer-contact">
            <h4>Kontak</h4>
            <p>📍 {d.alamat}</p><p>📞 {d.telepon}</p><p>📧 {d.email}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {d.nama}. Dibuat dengan ❤️ untuk kemakmuran masjid.</p>
          <a href="/admin" className="footer-admin">🔐 Login Pengurus</a>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  const [info, setInfo]         = useState(null)
  const [pengurus, setPengurus] = useState(FALLBACK.pengurus)
  const [agenda, setAgenda]     = useState(FALLBACK.agenda)
  const [jadwal, setJadwal]     = useState(FALLBACK.jadwal)
  const [tausiyah, setTausiyah] = useState(FALLBACK.tausiyah)
  const [laporan, setLaporan]   = useState(FALLBACK.laporan)

  useEffect(() => {
    getMosqueInfo().then(d=>{ if(d){ setInfo(d); document.documentElement.setAttribute('data-theme', d.tema||'emerald') }}).catch(()=>{})
    getPengurus().then(d=>{ if(d?.length) setPengurus(d) }).catch(()=>{})
    getAgenda().then(d=>{ if(d?.length) setAgenda(d) }).catch(()=>{})
    getJadwalImam().then(d=>{ if(d?.length) setJadwal(d) }).catch(()=>{})
    getTausiyah().then(d=>{ if(d?.length) setTausiyah(d) }).catch(()=>{})
    getLaporanInfaq().then(d=>{ if(d?.length) setLaporan(d) }).catch(()=>{})
  }, [])

  return (
    <div className="landing">
      <Navbar info={info||FALLBACK.info}/>
      <Hero info={info||FALLBACK.info}/>
      <PrayerSection info={info}/>
      <PengurusSection pengurus={pengurus}/>
      <PengurusHarianSection pengurus={pengurus}/>
      <AgendaSection agenda={agenda}/>
      <JadwalSection jadwal={jadwal}/>
      <LaporanSection laporan={laporan}/>
      <InfaqSection info={info}/>
      <TausiyahSection tausiyah={tausiyah}/>
      <InfoSection info={info}/>
      <Footer info={info}/>
    </div>
  )
}
