const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  comprado: {
    type: Boolean,
    default: false
  },
  categoria: {
    type: String,
    default: 'otros'
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Item', itemSchema);