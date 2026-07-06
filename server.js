const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Veri dosyası
const DATA_FILE = path.join(__dirname, 'data.json');

// Başlangıç verisi
const DEFAULT_DATA = {
  TEAMS: [
    {id:'backend', name:'Backend Test Ekibi'},
    {id:'mobile',  name:'Mobile Test Ekibi'},
    {id:'web',     name:'Web Test Ekibi'},
  ],
  PEOPLE: [
    {id:'irmak',  name:'Irmak Yılmaz', team:'backend'},
    {id:'ahmet',  name:'Ahmet Kaya',   team:'backend'},
    {id:'zeynep', name:'Zeynep Demir', team:'mobile'},
    {id:'mehmet', name:'Mehmet Çelik', team:'mobile'},
    {id:'elif',   name:'Elif Şahin',   team:'web'},
    {id:'burak',  name:'Burak Aydın',  team:'web'},
  ],
  PROJECTS: [
    {id:'redesign', name:'Redesign Projesi',        color:'#3DB35E'},
    {id:'push',     name:'Push Bildirim Projesi',   color:'#E85D9E'},
    {id:'odeme',    name:'Ödeme Entegrasyonu',      color:'#4C9BE8'},
    {id:'checkin',  name:'Check-in Modülü',          color:'#F0883E'},
    {id:'bagaj',    name:'Bagaj Takip API',          color:'#A87EEA'},
  ],
  HOLIDAYS: [
    {date:'2026-10-29', label:'Cumhuriyet Bayramı'},
    {date:'2026-10-30', label:'Köprü Tatili (Şirket Kararı)'},
  ],
  REGRESSIONS: [
    {start:'2026-10-12', end:'2026-10-16', label:'Q4 Regresyon Koşumu'},
  ],
  RAW_TASKS: [
    {id:'t1', person:'irmak',  project:'redesign', effort:5, start:'2026-10-14'},
    {id:'t2', person:'ahmet',  project:'push',     effort:4, start:'2026-10-28'},
    {id:'t3', person:'zeynep', project:'odeme',    effort:4, start:'2026-10-05'},
    {id:'t4', person:'mehmet', project:'checkin',  effort:3, start:'2026-10-19'},
    {id:'t5', person:'elif',   project:'bagaj',    effort:6, start:'2026-10-06'},
    {id:'t6', person:'burak',  project:'redesign', effort:3, start:'2026-10-26'},
  ],
};

// Veri dosyasını oku
function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Veri okunması hatası:', err);
  }
  return DEFAULT_DATA;
}

// Veri dosyasını yaz
function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Veri yazması hatası:', err);
    return false;
  }
}

// === API ENDPOINTS ===

// Tüm verileri getir
app.get('/api/data', (req, res) => {
  const data = readData();
  res.json(data);
});

// Verileri kaydet
app.post('/api/data', (req, res) => {
  const data = req.body;
  if (writeData(data)) {
    res.json({ success: true, message: 'Veriler kaydedildi' });
  } else {
    res.status(500).json({ success: false, message: 'Veriler kaydedilemedi' });
  }
});

// Verileri sıfırla
app.post('/api/reset', (req, res) => {
  if (writeData(DEFAULT_DATA)) {
    res.json({ success: true, message: 'Veriler sıfırlandı' });
  } else {
    res.status(500).json({ success: false, message: 'Sıfırlama başarısız' });
  }
});

// Sağlık kontrolü
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Server başlat
app.listen(PORT, () => {
  console.log(`✓ Server çalışıyor: http://localhost:${PORT}`);
  console.log(`✓ API: http://localhost:${PORT}/api/data`);
});
