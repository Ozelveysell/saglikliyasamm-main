const mongoose = require('mongoose');

const VKIModel = mongoose.model('VKIModel', {
    boyUzunlugu: { type: Number, required: true },
    vucutAgirligi: { type: Number, required: true },
    yas: { type: Number, required: true },
    cinsiyet: { type: String, required: true },
    vki: { type: Number, required: true },
    kategori: { type: String, required: true },
  });

module.exports = VKIModel;
