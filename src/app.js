const express = require('express');
const app = express();

// Middlewares para procesar peticiones JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rutas
const indexRoutes = require('./routes/index');
const productoRouter = require('./routes/productoRouter');
const pruebaRouter = require('./routes/pruebaRouter');

// Montar las rutas
app.use('/', indexRoutes);                 // http://localhost:3333/
app.use('/productos', productoRouter);      // http://localhost:3333/productos
app.use('/prueba', pruebaRouter);           // http://localhost:3333/prueba

module.exports = app;