const express = require('express');
const mongoose = require('mongoose');
const VKIModel = require('./VKIModel');

const app = express();
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/saglikliyasam', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB bağlantı hatası:'));
db.once('open', () => {
  console.log('MongoDB bağlantısı başarılı!');
});

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Merhaba, Express!');
});

app.post('/hesapla', async (req, res) => {
  try {
    const { boyUzunlugu, vucutAgirligi, yas, cinsiyet } = req.body;

    if (isNaN(boyUzunlugu) || isNaN(vucutAgirligi) || isNaN(yas) || !cinsiyet) {
      res.status(400).json({ error: 'Geçersiz veri. Lütfen doğru bilgileri girin.' });
      return;
    }

    const vki = vucutAgirligi / ((boyUzunlugu / 100) * (boyUzunlugu / 100));

    if (isNaN(vki) || !isFinite(vki)) {
      res.status(400).json({ error: 'Geçersiz veri. Lütfen doğru bilgileri girin.' });
      return;
    }

    const kategori = vki < 18.5 ? 'Zayıf' : vki >= 18.5 && vki < 24.9 ? 'Normal' : 'Kilolu';

    const yeniVKI = new VKIModel({
      boyUzunlugu: boyUzunlugu,
      vucutAgirligi: vucutAgirligi,
      yas: yas,
      cinsiyet: cinsiyet,
      vki: vki,
      kategori: kategori,
    });

    const savedVKI = await yeniVKI.save();

    console.log('Veri başarıyla kaydedildi!');

    res.status(200).json({ message: 'Veri başarıyla kaydedildi', savedVKI });
  } catch (error) {
    console.error('Veritabanına kaydetme hatası:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${port}`);
});