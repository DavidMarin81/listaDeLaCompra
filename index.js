require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Modelo
const Item = require('./models/Item');

const app = express();
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error MongoDB:', err));


// ========================
// ENDPOINTS
// ========================

// 🟢 Añadir item
app.post('/items', async (req, res) => {
  try {
    if (!req.body.nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    const nuevoItem = new Item({
      nombre: req.body.nombre,
      categoria: req.body.categoria || 'otros'
    });

    const guardado = await nuevoItem.save();

    res.status(201).json(guardado);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el item' });
  }
});


// 🔵 Ver lista
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find().sort({ fechaCreacion: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la lista' });
  }
});


// 🟡 Actualizar item (marcar comprado)
app.put('/items/:id', async (req, res) => {
  try {
    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    // Validar campo comprado
    if (typeof req.body.comprado !== 'boolean') {
      return res.status(400).json({ error: 'comprado debe ser true o false' });
    }

    const itemActualizado = await Item.findByIdAndUpdate(
      req.params.id,
      { comprado: req.body.comprado },
      { new: true }
    );

    if (!itemActualizado) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }

    res.json(itemActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el item' });
  }
});


// 🔴 Borrar un item
app.delete('/items/:id', async (req, res) => {
  try {
    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const eliminado = await Item.findByIdAndDelete(req.params.id);

    if (!eliminado) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }

    res.json({ mensaje: 'Item eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el item' });
  }
});


// 🧹 Borrar todos los comprados
app.delete('/items', async (req, res) => {
  try {
    await Item.deleteMany({ comprado: true });
    res.json({ mensaje: 'Items comprados eliminados' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar items' });
  }
});


// 🧪 Ruta de prueba
const PORT = process.env.PORT || 3000;

// Servidor
app.listen(process.env.PORT, () => {
  console.log(`Servidor en puerto ${process.env.PORT}`);
});
