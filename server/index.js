import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuid } from 'uuid'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.json({ limit: '2mb' }))
// Serve uploads statically
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.join(__dirname, 'uploads')
app.use('/uploads', express.static(uploadsDir))

// Multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${uuid()}${ext}`)
  }
})
const upload = multer({ storage })

// In-memory data stores (replace with DB later)
const db = {
  users: [],
  ngos: [],
  donations: [],
  requests: [],
  usageReports: [],
  notifications: [],
  feedbacks: [],
}

// Helper
const now = () => new Date().toISOString()

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true, time: now() }))

// Debug: dump in-memory database (do not expose in production)
app.get('/api/debug/db', (_req, res) => {
  res.json({
    users: db.users,
    ngos: db.ngos,
    donations: db.donations,
    requests: db.requests,
    usageReports: db.usageReports,
    notifications: db.notifications,
    feedbacks: db.feedbacks,
  })
})

// Auth - demo only (no passwords stored/checked for real)
app.post('/api/auth/register', (req, res) => {
  const user = { id: Date.now(), ...req.body, createdAt: now() }
  db.users.push(user)
  res.json({ success: true, user })
})

app.post('/api/auth/login', (req, res) => {
  const { email, role } = req.body
  let user = db.users.find(u => u.email === email)
  if (!user) {
    user = { id: Date.now(), email, role, name: role === 'ngo' ? 'NGO User' : 'Donor User', createdAt: now() }
    db.users.push(user)
  }
  res.json({ success: true, user })
})

// NGOs
app.get('/api/ngos', (_req, res) => res.json(db.ngos))
app.post('/api/ngos', (req, res) => {
  const ngo = { id: Date.now(), ...req.body, createdAt: now() }
  db.ngos.push(ngo)
  res.json({ success: true, ngo })
})

// Requests
app.get('/api/requests', (_req, res) => res.json(db.requests))
app.post('/api/requests', (req, res) => {
  const request = { id: Date.now(), status: 'active', currentQuantity: 0, ...req.body, createdAt: now() }
  db.requests.unshift(request)
  res.json({ success: true, request })
})
app.patch('/api/requests/:id', (req, res) => {
  const id = Number(req.params.id)
  db.requests = db.requests.map(r => (r.id === id ? { ...r, ...req.body, updatedAt: now() } : r))
  res.json({ success: true })
})

// Donations
app.get('/api/donations', (_req, res) => res.json(db.donations))
app.post('/api/donations', (req, res) => {
  const donation = { id: Date.now(), status: 'pending', ...req.body, createdAt: now() }
  db.donations.unshift(donation)
  res.json({ success: true, donation })
})
app.patch('/api/donations/:id/status', (req, res) => {
  const id = Number(req.params.id)
  const { status } = req.body
  db.donations = db.donations.map(d => (d.id === id ? { ...d, status, updatedAt: now() } : d))
  res.json({ success: true })
})
// Upload images - returns array of URLs
app.post('/api/uploads', upload.array('images', 5), (req, res) => {
  const files = req.files || []
  const urls = files.map(f => `/uploads/${f.filename}`)
  res.json({ success: true, urls })
})
// Generic update donation (e.g., edit items, notes, pickup info)
app.patch('/api/donations/:id', (req, res) => {
  const id = Number(req.params.id)
  let updated = null
  db.donations = db.donations.map(d => {
    if (d.id === id) {
      updated = { ...d, ...req.body, updatedAt: now() }
      return updated
    }
    return d
  })
  res.json({ success: true, donation: updated })
})
// Delete donation
app.delete('/api/donations/:id', (req, res) => {
  const id = Number(req.params.id)
  db.donations = db.donations.filter(d => d.id !== id)
  res.json({ success: true })
})

// Usage Reports
app.get('/api/usage-reports', (_req, res) => res.json(db.usageReports))
app.post('/api/usage-reports', (req, res) => {
  const report = { id: Date.now(), ...req.body, createdAt: now() }
  db.usageReports.unshift(report)
  res.json({ success: true, report })
})

// Feedback (public read)
app.get('/api/feedbacks', (_req, res) => res.json(db.feedbacks))
app.post('/api/feedbacks', (req, res) => {
  const feedback = { id: Date.now(), ...req.body, createdAt: now() }
  db.feedbacks.unshift(feedback)
  res.json({ success: true, feedback })
})

// Notifications (per user)
app.get('/api/users/:userId/notifications', (req, res) => {
  const userId = Number(req.params.userId)
  res.json(db.notifications.filter(n => n.userId === userId))
})
app.post('/api/notifications', (req, res) => {
  const note = { id: uuid(), read: false, ...req.body, createdAt: now() }
  db.notifications.unshift(note)
  res.json({ success: true, notification: note })
})
app.patch('/api/notifications/:id/read', (req, res) => {
  const id = req.params.id
  db.notifications = db.notifications.map(n => (n.id === id ? { ...n, read: true } : n))
  res.json({ success: true })
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${PORT}`)
})


