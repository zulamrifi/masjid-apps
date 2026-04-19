import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  signOut, getMosqueInfo, saveMosqueInfo,
  getPengurus, savePengurus, deletePengurus,
  getAgenda, saveAgenda, deleteAgenda,
  getJadwalImam, saveJadwalImam, deleteJadwalImam,
  getTausiyah, saveTausiyah, deleteTausiyah,
  getPemasukan, addPemasukan, deletePemasukan,
  getPengeluaran, addPengeluaran, deletePengeluaran,
  getLaporanInfaq, saveLaporanInfaq, deleteLaporanInfaq,
} from '../lib/firebase'

const fmtRp = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',minimumFractionDigits:0}).format(n||0)
const fmtDate = d => d ? new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'}) : '-'

const THEMES = [
  { value:'emerald',  label:'🟢 Hijau Emerald', color:'#1a5c38' },
  { value:'royal',    label:'🔵 Biru Royal',    color:'#1a3a6b' },
  { value:'golden',   label:'🟤 Coklat Emas',   color:'#7c4a1e' },
  { value:'maroon',   label:'🟣 Ungu Maroon',   color:'#6b1a4a' },
  { value:'elegant',  label:'⚫ Hitam Elegan',  color:'#2a2a2a' },
  { value:'burgundy', label:'🔴 Merah Burgundy',color:'#7c1a1a' },
  { value:'teal',     label:'🩵 Biru Teal',     color:'#0f6b6b' },
]

const MENUS = [
  { key:'dashboard',   icon:'🏠', label:'Dashboard' },
  { key:'info',        icon:'🕌', label:'Info Masjid' },
  { key:'pengurus',    icon:'👥', label:'Pengurus' },
  { key:'agenda',      icon:'📅', label:'Agenda' },
  { key:'jadwal',      icon:'🕌', label:'Jadwal Imam' },
  { key:'tausiyah',    icon:'📖', label:'Tausiyah' },
  { key:'laporan',     icon:'📊', label:'Laporan Infaq' },
  { key:'pemasukan',   icon:'💚', label:'Pemasukan' },
  { key:'pengeluaran', icon:'💔', label:'Pengeluaran' },
]

function Sidebar({ active, setActive, sideOpen, setSideOpen }) {
  const navigate = useNavigate()
  return (
    <>
      {sideOpen && <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:99}} onClick={()=>setSideOpen(false)}/>}
      <aside className={`admin-sidebar ${sideOpen?'open':''}`}>
        <div style={{padding:'1.5rem 1.25rem',borderBottom:'1px solid var(--card-border)'}}>
          <h2 style={{fontFamily:'Playfair Display,serif',color:'var(--gold-light)',fontSize:'1.1rem'}}>☪ Admin Panel</h2>
          <p style={{color:'var(--text-muted)',fontSize:'0.75rem',marginTop:'0.25rem'}}>Manajemen Masjid</p>
        </div>
        <nav style={{padding:'1rem 0'}}>
          {MENUS.map(m=>(
            <button key={m.key} onClick={()=>{setActive(m.key);setSideOpen(false);navigate(`/admin/${m.key}`)}}
              style={{display:'flex',alignItems:'center',gap:'0.75rem',width:'100%',padding:'0.75rem 1.25rem',
                background:active===m.key?'rgba(201,168,76,0.12)':'none',
                color:active===m.key?'var(--gold)':'var(--text-muted)',
                borderLeft:active===m.key?'3px solid var(--gold)':'3px solid transparent',
                fontSize:'0.9rem',fontWeight:active===m.key?600:400,
                transition:'all 0.2s',cursor:'pointer',border:'none',borderRadius:'0 8px 8px 0'}}>
              <span>{m.icon}</span>{m.label}
            </button>
          ))}
        </nav>
        <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'1rem'}}>
          <button onClick={async()=>{await signOut();navigate('/')}}
            style={{width:'100%',padding:'0.75rem',background:'rgba(248,113,113,0.1)',color:'#f87171',borderRadius:8,border:'1px solid rgba(248,113,113,0.2)',fontSize:'0.9rem',cursor:'pointer',fontFamily:'inherit'}}>
            🚪 Keluar
          </button>
          <a href="/" style={{display:'block',textAlign:'center',marginTop:'0.75rem',color:'var(--text-muted)',fontSize:'0.8rem'}}>← Lihat Website</a>
        </div>
      </aside>
    </>
  )
}

function AdminHeader({ title, setSideOpen }) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'2rem',paddingBottom:'1rem',borderBottom:'1px solid var(--card-border)'}}>
      <button onClick={()=>setSideOpen(true)} className="sidebar-toggle"
        style={{display:'none',background:'none',color:'var(--gold-light)',fontSize:'1.4rem',padding:'4px',cursor:'pointer'}}>☰</button>
      <h1 style={{fontFamily:'Playfair Display,serif',color:'var(--gold-light)',fontSize:'1.6rem'}}>{title}</h1>
    </div>
  )
}

function DashSection({ setSideOpen }) {
  const [stats, setStats] = useState({pengurus:0,agenda:0,tausiyah:0,jadwal:0,pemasukan:0,pengeluaran:0})
  useEffect(()=>{
    Promise.all([getPengurus(),getAgenda(),getTausiyah(),getJadwalImam(),getPemasukan(),getPengeluaran()])
      .then(([p,a,t,j,pm,pg])=>{
        setStats({pengurus:p.length,agenda:a.length,tausiyah:t.length,jadwal:j.length,
          pemasukan:pm.reduce((s,x)=>s+(x.jumlah||0),0),pengeluaran:pg.reduce((s,x)=>s+(x.jumlah||0),0)})
      }).catch(()=>{})
  },[])
  const cards = [
    {label:'Total Pengurus',value:stats.pengurus,icon:'👥',color:'#4ade80'},
    {label:'Total Agenda',value:stats.agenda,icon:'📅',color:'var(--gold)'},
    {label:'Jadwal Imam',value:stats.jadwal,icon:'🕌',color:'#60a5fa'},
    {label:'Total Tausiyah',value:stats.tausiyah,icon:'📖',color:'#f472b6'},
    {label:'Total Pemasukan',value:fmtRp(stats.pemasukan),icon:'💰',color:'#4ade80'},
    {label:'Saldo Bersih',value:fmtRp(stats.pemasukan-stats.pengeluaran),icon:'🏦',color:'var(--gold)'},
  ]
  return (
    <div>
      <AdminHeader title="Dashboard" setSideOpen={setSideOpen}/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1rem'}}>
        {cards.map(c=>(
          <div key={c.label} className="card" style={{padding:'1.5rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.75rem'}}>
              <p style={{color:'var(--text-muted)',fontSize:'0.85rem'}}>{c.label}</p>
              <span style={{fontSize:'1.5rem'}}>{c.icon}</span>
            </div>
            <p style={{fontSize:'1.3rem',fontWeight:700,color:c.color}}>{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function InfoSection({ setSideOpen }) {
  const [form, setForm] = useState({nama:'',tagline:'',alamat:'',telepon:'',email:'',no_rekening:'',bank:'',atas_nama:'',lat:-7.2575,lng:112.7521,logo_url:'',hero_url:'',qris_url:'',tema:'emerald',ayat:'',terjemah_ayat:''})
  const [saving, setSaving] = useState(false)
  useEffect(()=>{ getMosqueInfo().then(d=>{ if(d) setForm(f=>({...f,...d})) }).catch(()=>{}) },[])
  const save = async(e)=>{
    e.preventDefault(); setSaving(true)
    try { await saveMosqueInfo(form); document.documentElement.setAttribute('data-theme',form.tema||'emerald'); toast.success('Info masjid disimpan!') }
    catch { toast.error('Gagal menyimpan') }
    setSaving(false)
  }
  const fields = [
    {key:'nama',label:'Nama Masjid',placeholder:'Masjid Al-Ikhlas'},
    {key:'tagline',label:'Tagline',placeholder:'Memakmurkan Masjid...'},
    {key:'alamat',label:'Alamat Lengkap',placeholder:'Jl. Masjid No. 1...'},
    {key:'telepon',label:'Telepon',placeholder:'031-1234567'},
    {key:'email',label:'Email',placeholder:'info@masjid.id'},
    {key:'bank',label:'Nama Bank',placeholder:'Bank Syariah Indonesia'},
    {key:'no_rekening',label:'Nomor Rekening',placeholder:'1234-5678-9012'},
    {key:'atas_nama',label:'Atas Nama Rekening',placeholder:'Masjid Al-Ikhlas'},
    {key:'logo_url',label:'URL Logo',placeholder:'https://...'},
    {key:'hero_url',label:'URL Foto Header',placeholder:'https://...'},
    {key:'qris_url',label:'URL Gambar QRIS',placeholder:'https://...'},
    {key:'lat',label:'Latitude',placeholder:'-7.2575',type:'number'},
    {key:'lng',label:'Longitude',placeholder:'112.7521',type:'number'},
  ]
  return (
    <div>
      <AdminHeader title="Info Masjid" setSideOpen={setSideOpen}/>
      <form onSubmit={save} className="card" style={{padding:'2rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'1rem'}}>
          {fields.map(f=>(
            <div key={f.key} className="form-group">
              <label className="form-label">{f.label}</label>
              <input className="input-field" type={f.type||'text'} placeholder={f.placeholder}
                value={form[f.key]||''} onChange={e=>setForm({...form,[f.key]:e.target.value})}/>
            </div>
          ))}
        </div>

        {/* Pilihan Tema Warna */}
        <div className="form-group">
          <label className="form-label">🎨 Tema Warna Website</label>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'0.75rem',marginTop:'0.25rem'}}>
            {THEMES.map(t=>(
              <button type="button" key={t.value}
                onClick={()=>{ setForm({...form,tema:t.value}); document.documentElement.setAttribute('data-theme',t.value) }}
                style={{
                  padding:'0.75rem 1rem', borderRadius:10, cursor:'pointer',
                  border: form.tema===t.value ? '2px solid var(--gold)' : '2px solid rgba(255,255,255,0.1)',
                  background: form.tema===t.value ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
                  color: form.tema===t.value ? 'var(--gold-light)' : 'var(--text-muted)',
                  display:'flex', alignItems:'center', gap:'0.5rem', fontFamily:'inherit', fontSize:'0.85rem',
                  transition:'all 0.2s',
                }}>
                <span style={{width:16,height:16,borderRadius:'50%',background:t.color,flexShrink:0,border:'2px solid rgba(255,255,255,0.3)'}}/>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Ayat Al-Quran (Arab)</label>
          <textarea className="input-field" rows={3} dir="rtl"
            style={{fontFamily:'Amiri,serif',fontSize:'1.2rem'}}
            value={form.ayat||''} onChange={e=>setForm({...form,ayat:e.target.value})}/>
        </div>
        <div className="form-group">
          <label className="form-label">Terjemah Ayat</label>
          <textarea className="input-field" rows={2}
            value={form.terjemah_ayat||''} onChange={e=>setForm({...form,terjemah_ayat:e.target.value})}/>
        </div>
        <button type="submit" className="btn-gold" style={{alignSelf:'flex-start'}} disabled={saving}>
          {saving?'⏳ Menyimpan...':'💾 Simpan Info Masjid'}
        </button>
      </form>
    </div>
  )
}

function CRUDSection({ title, setSideOpen, fields, fetchFn, saveFn, deleteFn, emptyForm, displayRow }) {
  const [items, setItems]   = useState([])
  const [form, setForm]     = useState(emptyForm)
  const [mode, setMode]     = useState('list')
  const [saving, setSaving] = useState(false)
  const load = () => fetchFn().then(setItems).catch(()=>{})
  useEffect(()=>{ load() },[])
  const save = async(e)=>{
    e.preventDefault(); setSaving(true)
    try { await saveFn(form); toast.success('Data disimpan!'); setMode('list'); load() }
    catch { toast.error('Gagal menyimpan') }
    setSaving(false)
  }
  const del = async(id)=>{ if(!confirm('Yakin hapus?')) return; await deleteFn(id); toast.success('Dihapus'); load() }
  return (
    <div>
      <AdminHeader title={title} setSideOpen={setSideOpen}/>
      {mode==='list' ? (
        <div>
          <button className="btn-gold" style={{marginBottom:'1.5rem'}} onClick={()=>{setForm(emptyForm);setMode('form')}}>＋ Tambah {title}</button>
          <div className="card table-wrap">
            <table>
              <thead><tr>{fields.map(f=><th key={f.key}>{f.label}</th>)}<th>Aksi</th></tr></thead>
              <tbody>
                {items.length===0
                  ? <tr><td colSpan={fields.length+1} style={{textAlign:'center',color:'var(--text-muted)',padding:'2rem'}}>Belum ada data</td></tr>
                  : items.map((item,i)=>(
                    <tr key={item.id||i}>
                      {displayRow(item)}
                      <td>
                        <div style={{display:'flex',gap:'0.5rem'}}>
                          <button onClick={()=>{setForm(item);setMode('form')}} style={{background:'rgba(201,168,76,0.15)',color:'var(--gold)',border:'1px solid rgba(201,168,76,0.3)',borderRadius:6,padding:'0.3rem 0.75rem',fontSize:'0.8rem',cursor:'pointer'}}>✏️</button>
                          <button onClick={()=>del(item.id)} style={{background:'rgba(248,113,113,0.1)',color:'#f87171',border:'1px solid rgba(248,113,113,0.2)',borderRadius:6,padding:'0.3rem 0.75rem',fontSize:'0.8rem',cursor:'pointer'}}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <form onSubmit={save} className="card" style={{padding:'2rem',display:'flex',flexDirection:'column',gap:'1rem',maxWidth:600}}>
          <h3 style={{color:'var(--gold-light)'}}>{form.id?'Edit':'Tambah'} {title}</h3>
          {fields.map(f=>(
            <div key={f.key} className="form-group">
              <label className="form-label">{f.label}</label>
              {f.type==='textarea'
                ? <textarea className="input-field" rows={4} placeholder={f.placeholder||''} value={form[f.key]||''} onChange={e=>setForm({...form,[f.key]:e.target.value})}/>
                : f.type==='select'
                  ? <select className="input-field" value={form[f.key]||''} onChange={e=>setForm({...form,[f.key]:e.target.value})}>
                      {f.options.map(o=><option key={o} value={o}>{o}</option>)}
                    </select>
                  : <input className="input-field" type={f.type||'text'} placeholder={f.placeholder||''} value={form[f.key]||''} onChange={e=>setForm({...form,[f.key]:e.target.value})}/>
              }
            </div>
          ))}
          <div style={{display:'flex',gap:'1rem'}}>
            <button type="submit" className="btn-gold" disabled={saving}>{saving?'⏳...':'💾 Simpan'}</button>
            <button type="button" className="btn-green" onClick={()=>setMode('list')}>✕ Batal</button>
          </div>
        </form>
      )}
    </div>
  )
}

const PengurusSection = ({setSideOpen}) => <CRUDSection title="Pengurus" setSideOpen={setSideOpen}
  fields={[{key:'urutan',label:'Urutan'},{key:'nama',label:'Nama'},{key:'jabatan',label:'Jabatan'},{key:'foto_url',label:'URL Foto'}]}
  emptyForm={{nama:'',jabatan:'',foto_url:'',urutan:1}} fetchFn={getPengurus} saveFn={savePengurus} deleteFn={deletePengurus}
  displayRow={p=><><td>{p.urutan}</td><td style={{color:'var(--gold-light)'}}>{p.nama}</td><td>{p.jabatan}</td><td style={{maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:'var(--text-muted)',fontSize:'0.8rem'}}>{p.foto_url||'-'}</td></>}/>

const AgendaSection = ({setSideOpen}) => <CRUDSection title="Agenda" setSideOpen={setSideOpen}
  fields={[{key:'judul',label:'Judul'},{key:'deskripsi',label:'Deskripsi',type:'textarea'},{key:'tanggal',label:'Tanggal',type:'date'},{key:'waktu',label:'Waktu',type:'time'},{key:'tempat',label:'Tempat'}]}
  emptyForm={{judul:'',deskripsi:'',tanggal:'',waktu:'',tempat:''}} fetchFn={getAgenda} saveFn={saveAgenda} deleteFn={deleteAgenda}
  displayRow={a=><><td style={{color:'var(--gold-light)'}}>{a.judul}</td><td style={{color:'var(--text-muted)',fontSize:'0.85rem'}}>{a.deskripsi?.substring(0,40)}...</td><td>{fmtDate(a.tanggal)}</td><td>{a.waktu}</td><td>{a.tempat}</td></>}/>

const JadwalSection = ({setSideOpen}) => <CRUDSection title="Jadwal Imam & Khatib" setSideOpen={setSideOpen}
  fields={[
    {key:'tanggal',label:'Tanggal',type:'date'},
    {key:'jenis',label:'Jenis Sholat',type:'select',options:['Jumat','Idul Fitri','Idul Adha']},
    {key:'imam',label:'Nama Imam',placeholder:'Ustadz...'},
    {key:'khatib',label:'Nama Khatib',placeholder:'Ustadz...'},
    {key:'catatan',label:'Catatan (opsional)',placeholder:'Tema khutbah, dll...'},
  ]}
  emptyForm={{tanggal:'',jenis:'Jumat',imam:'',khatib:'',catatan:''}} fetchFn={getJadwalImam} saveFn={saveJadwalImam} deleteFn={deleteJadwalImam}
  displayRow={j=><><td>{fmtDate(j.tanggal)}</td><td><span className={`badge ${j.jenis==='Jumat'?'badge-green':j.jenis==='Idul Fitri'?'badge-gold':'badge-blue'}`}>{j.jenis}</span></td><td style={{color:'var(--gold-light)'}}>{j.imam}</td><td>{j.khatib}</td><td style={{color:'var(--text-muted)',fontSize:'0.85rem'}}>{j.catatan||'-'}</td></>}/>

const TausiyahSection = ({setSideOpen}) => <CRUDSection title="Tausiyah" setSideOpen={setSideOpen}
  fields={[{key:'judul',label:'Judul'},{key:'penceramah',label:'Penceramah'},{key:'tanggal',label:'Tanggal',type:'date'},{key:'isi',label:'Isi Tausiyah',type:'textarea'},{key:'thumbnail_url',label:'URL Thumbnail'}]}
  emptyForm={{judul:'',penceramah:'',tanggal:'',isi:'',thumbnail_url:''}} fetchFn={getTausiyah} saveFn={saveTausiyah} deleteFn={deleteTausiyah}
  displayRow={t=><><td style={{color:'var(--gold-light)',maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.judul}</td><td>{t.penceramah}</td><td>{fmtDate(t.tanggal)}</td><td style={{maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:'var(--text-muted)',fontSize:'0.85rem'}}>{t.isi}</td></>}/>

const LaporanSection = ({setSideOpen}) => <CRUDSection title="Laporan Infaq" setSideOpen={setSideOpen}
  fields={[{key:'periode',label:'Periode'},{key:'total_pemasukan',label:'Total Pemasukan',type:'number'},{key:'total_pengeluaran',label:'Total Pengeluaran',type:'number'}]}
  emptyForm={{periode:'',total_pemasukan:0,total_pengeluaran:0}} fetchFn={getLaporanInfaq} saveFn={saveLaporanInfaq} deleteFn={deleteLaporanInfaq}
  displayRow={l=><><td style={{color:'var(--gold-light)'}}>{l.periode}</td><td style={{color:'#4ade80'}}>{fmtRp(l.total_pemasukan)}</td><td style={{color:'#f87171'}}>{fmtRp(l.total_pengeluaran)}</td><td style={{color:'var(--gold)',fontWeight:600}}>{fmtRp((l.total_pemasukan||0)-(l.total_pengeluaran||0))}</td></>}/>

function KeuanganSection({ setSideOpen, type }) {
  const isMasuk = type==='pemasukan'
  const [items, setItems]       = useState([])
  const [form, setForm]         = useState({keterangan:'',jumlah:0,tanggal:new Date().toISOString().split('T')[0],kategori:''})
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving]     = useState(false)
  const [bulan, setBulan]       = useState(new Date().getMonth()+1)
  const [tahun, setTahun]       = useState(new Date().getFullYear())
  const fetchFn = isMasuk ? getPemasukan : getPengeluaran
  const addFn   = isMasuk ? addPemasukan : addPengeluaran
  const delFn   = isMasuk ? deletePemasukan : deletePengeluaran
  const load = () => fetchFn(bulan,tahun).then(setItems).catch(()=>{})
  useEffect(()=>{ load() },[bulan,tahun])
  const save = async(e)=>{
    e.preventDefault(); setSaving(true)
    try { await addFn({...form,jumlah:Number(form.jumlah)}); toast.success('Disimpan!'); setShowForm(false); load(); setForm({keterangan:'',jumlah:0,tanggal:new Date().toISOString().split('T')[0],kategori:''}) }
    catch { toast.error('Gagal menyimpan') }
    setSaving(false)
  }
  const del = async(id)=>{ if(!confirm('Hapus?')) return; await delFn(id); toast.success('Dihapus'); load() }
  const total = items.reduce((s,x)=>s+(x.jumlah||0),0)
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des']
  return (
    <div>
      <AdminHeader title={isMasuk?'Detail Pemasukan':'Detail Pengeluaran'} setSideOpen={setSideOpen}/>
      <div style={{display:'flex',gap:'1rem',marginBottom:'1.5rem',flexWrap:'wrap'}}>
        <select className="input-field" style={{width:'auto'}} value={bulan} onChange={e=>setBulan(+e.target.value)}>
          {months.map((m,i)=><option key={i} value={i+1}>{m}</option>)}
        </select>
        <input className="input-field" type="number" style={{width:100}} value={tahun} onChange={e=>setTahun(+e.target.value)}/>
        <button className="btn-gold" onClick={()=>setShowForm(!showForm)}>{showForm?'✕ Tutup':'＋ Tambah'}</button>
      </div>
      <div className="card" style={{padding:'1.25rem',marginBottom:'1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{color:'var(--text-muted)'}}>Total — {months[bulan-1]} {tahun}</span>
        <span style={{fontSize:'1.4rem',fontWeight:700,color:isMasuk?'#4ade80':'#f87171'}}>{fmtRp(total)}</span>
      </div>
      {showForm && (
        <form onSubmit={save} className="card" style={{padding:'1.5rem',marginBottom:'1.5rem',display:'flex',flexDirection:'column',gap:'1rem',maxWidth:600}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            <div className="form-group"><label className="form-label">Tanggal</label><input className="input-field" type="date" value={form.tanggal} onChange={e=>setForm({...form,tanggal:e.target.value})} required/></div>
            <div className="form-group"><label className="form-label">Jumlah (Rp)</label><input className="input-field" type="number" placeholder="500000" value={form.jumlah} onChange={e=>setForm({...form,jumlah:e.target.value})} required/></div>
          </div>
          <div className="form-group"><label className="form-label">Keterangan</label><input className="input-field" placeholder={isMasuk?'Infaq Jumat...':'Bayar listrik...'} value={form.keterangan} onChange={e=>setForm({...form,keterangan:e.target.value})} required/></div>
          <div className="form-group"><label className="form-label">Kategori</label><input className="input-field" placeholder={isMasuk?'Infaq/Zakat/Wakaf':'Operasional/Kegiatan'} value={form.kategori} onChange={e=>setForm({...form,kategori:e.target.value})}/></div>
          <button type="submit" className="btn-gold" style={{alignSelf:'flex-start'}} disabled={saving}>{saving?'⏳...':'💾 Simpan'}</button>
        </form>
      )}
      <div className="card table-wrap">
        <table>
          <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th>Jumlah</th><th>Aksi</th></tr></thead>
          <tbody>
            {items.length===0
              ? <tr><td colSpan={5} style={{textAlign:'center',color:'var(--text-muted)',padding:'2rem'}}>Belum ada data</td></tr>
              : items.map(item=>(
                <tr key={item.id}>
                  <td>{fmtDate(item.tanggal)}</td>
                  <td style={{color:'var(--gold-light)'}}>{item.keterangan}</td>
                  <td><span className="badge badge-gold">{item.kategori||'-'}</span></td>
                  <td style={{color:isMasuk?'#4ade80':'#f87171',fontWeight:600}}>{fmtRp(item.jumlah)}</td>
                  <td><button onClick={()=>del(item.id)} style={{background:'rgba(248,113,113,0.1)',color:'#f87171',border:'1px solid rgba(248,113,113,0.2)',borderRadius:6,padding:'0.3rem 0.75rem',fontSize:'0.8rem',cursor:'pointer'}}>🗑️</button></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const location = useLocation()
  const getKey = () => location.pathname.split('/').pop()||'dashboard'
  const [active, setActive]     = useState(getKey())
  const [sideOpen, setSideOpen] = useState(false)
  useEffect(()=>{ setActive(getKey()) },[location])
  const sp = { setSideOpen }
  return (
    <div className="admin-layout">
      <Sidebar active={active} setActive={setActive} sideOpen={sideOpen} setSideOpen={setSideOpen}/>
      <main className="admin-main">
        <Routes>
          <Route index                element={<DashSection {...sp}/>}/>
          <Route path="dashboard"     element={<DashSection {...sp}/>}/>
          <Route path="info"          element={<InfoSection {...sp}/>}/>
          <Route path="pengurus"      element={<PengurusSection {...sp}/>}/>
          <Route path="agenda"        element={<AgendaSection {...sp}/>}/>
          <Route path="jadwal"        element={<JadwalSection {...sp}/>}/>
          <Route path="tausiyah"      element={<TausiyahSection {...sp}/>}/>
          <Route path="laporan"       element={<LaporanSection {...sp}/>}/>
          <Route path="pemasukan"     element={<KeuanganSection {...sp} type="pemasukan"/>}/>
          <Route path="pengeluaran"   element={<KeuanganSection {...sp} type="pengeluaran"/>}/>
        </Routes>
      </main>
      <style>{`@media(max-width:900px){.sidebar-toggle{display:flex!important}}`}</style>
    </div>
  )
}
