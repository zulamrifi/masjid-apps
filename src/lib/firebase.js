import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc, query, orderBy } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const auth    = getAuth(app)
export const db      = getFirestore(app)
export const storage = getStorage(app)

export const signIn  = (email, password) => signInWithEmailAndPassword(auth, email, password)
export const signOut = () => fbSignOut(auth)
export { onAuthStateChanged }

// ── Mosque Info ───────────────────────────────────────────────────────────────
export const getMosqueInfo = async () => {
  const snap = await getDoc(doc(db, 'settings', 'mosque_info'))
  return snap.exists() ? snap.data() : null
}
export const saveMosqueInfo = async (data) => {
  await setDoc(doc(db, 'settings', 'mosque_info'), data, { merge: true })
}

// ── Pengurus ──────────────────────────────────────────────────────────────────
export const getPengurus = async () => {
  const snap = await getDocs(query(collection(db, 'pengurus'), orderBy('urutan')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
export const savePengurus = async (data) => {
  if (data.id) { const { id, ...rest } = data; await setDoc(doc(db, 'pengurus', id), rest, { merge: true }); return id }
  const ref = await addDoc(collection(db, 'pengurus'), data); return ref.id
}
export const deletePengurus = async (id) => deleteDoc(doc(db, 'pengurus', id))

// ── Agenda ────────────────────────────────────────────────────────────────────
export const getAgenda = async () => {
  const snap = await getDocs(query(collection(db, 'agenda'), orderBy('tanggal')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
export const saveAgenda = async (data) => {
  if (data.id) { const { id, ...rest } = data; await setDoc(doc(db, 'agenda', id), rest, { merge: true }); return id }
  const ref = await addDoc(collection(db, 'agenda'), data); return ref.id
}
export const deleteAgenda = async (id) => deleteDoc(doc(db, 'agenda', id))

// ── Jadwal Imam & Khatib ──────────────────────────────────────────────────────
export const getJadwalImam = async () => {
  const snap = await getDocs(query(collection(db, 'jadwal_imam'), orderBy('tanggal')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
export const saveJadwalImam = async (data) => {
  const { id, ...rest } = data
  // Pastikan field wajib ada
  if (!rest.imam || !rest.khatib || !rest.tanggal) throw new Error('Imam, khatib, dan tanggal wajib diisi')
  if (id) {
    await setDoc(doc(db, 'jadwal_imam', id), rest, { merge: true })
    return id
  }
  const ref = await addDoc(collection(db, 'jadwal_imam'), rest)
  return ref.id
}
export const deleteJadwalImam = async (id) => deleteDoc(doc(db, 'jadwal_imam', id))

// ── Tausiyah ──────────────────────────────────────────────────────────────────
export const getTausiyah = async () => {
  const snap = await getDocs(query(collection(db, 'tausiyah'), orderBy('tanggal', 'desc')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
export const saveTausiyah = async (data) => {
  if (data.id) { const { id, ...rest } = data; await setDoc(doc(db, 'tausiyah', id), rest, { merge: true }); return id }
  const ref = await addDoc(collection(db, 'tausiyah'), data); return ref.id
}
export const deleteTausiyah = async (id) => deleteDoc(doc(db, 'tausiyah', id))

// ── Laporan Infaq ─────────────────────────────────────────────────────────────
export const getLaporanInfaq = async () => {
  const snap = await getDocs(query(collection(db, 'laporan_infaq'), orderBy('periode', 'desc')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
export const saveLaporanInfaq = async (data) => {
  if (data.id) { const { id, ...rest } = data; await setDoc(doc(db, 'laporan_infaq', id), rest, { merge: true }); return id }
  const ref = await addDoc(collection(db, 'laporan_infaq'), data); return ref.id
}
export const deleteLaporanInfaq = async (id) => deleteDoc(doc(db, 'laporan_infaq', id))

// ── Pemasukan ─────────────────────────────────────────────────────────────────
export const getPemasukan = async (bulan, tahun) => {
  const snap = await getDocs(query(collection(db, 'pemasukan'), orderBy('tanggal', 'desc')))
  let results = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  if (bulan && tahun) {
    const prefix = `${tahun}-${String(bulan).padStart(2,'0')}`
    results = results.filter(r => r.tanggal?.startsWith(prefix))
  }
  return results
}
export const addPemasukan    = async (data) => addDoc(collection(db, 'pemasukan'), data)
export const deletePemasukan = async (id)   => deleteDoc(doc(db, 'pemasukan', id))

// ── Pengeluaran ───────────────────────────────────────────────────────────────
export const getPengeluaran = async (bulan, tahun) => {
  const snap = await getDocs(query(collection(db, 'pengeluaran'), orderBy('tanggal', 'desc')))
  let results = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  if (bulan && tahun) {
    const prefix = `${tahun}-${String(bulan).padStart(2,'0')}`
    results = results.filter(r => r.tanggal?.startsWith(prefix))
  }
  return results
}
export const addPengeluaran    = async (data) => addDoc(collection(db, 'pengeluaran'), data)
export const deletePengeluaran = async (id)   => deleteDoc(doc(db, 'pengeluaran', id))
