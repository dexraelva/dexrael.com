const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const DATA_FILE = path.join(__dirname, 'data.json');
const PORT = process.env.PORT || 3000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'change_me';

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const def = { available: true, referral: { name: '', email: '', calendly: '' }, updatedAt: new Date().toISOString() };
      fs.writeFileSync(DATA_FILE, JSON.stringify(def, null, 2));
      return def;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('readData error', err);
    return { available: true, referral: { name: '', email: '', calendly: '' }, updatedAt: new Date().toISOString() };
  }
}

function writeData(obj) {
  obj.updatedAt = new Date().toISOString();
  fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2));
}

// Public read endpoint
app.get('/api/availability', (req, res) => {
  const data = readData();
  res.json(data);
});

// Protected write endpoint - requires header `x-admin-token`
app.post('/api/availability', (req, res) => {
  const token = req.get('x-admin-token');
  if (!token || token !== ADMIN_TOKEN) return res.status(401).json({ error: 'Unauthorized' });

  const payload = req.body;
  if (typeof payload.available !== 'boolean') return res.status(400).json({ error: 'Invalid payload, missing available boolean' });

  const current = readData();
  current.available = payload.available;
  current.referral = payload.referral || current.referral || { name: '', email: '', calendly: '' };
  writeData(current);
  res.json({ ok: true, data: current });
});

app.get('/api/ping', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`Availability API listening on port ${PORT}`);
  console.log('Set an admin token with ADMIN_TOKEN env var to protect POST requests.');
});
