
const { error } = require('console');
const express = require('express');
const app = express();
const port = process.env.MIPUERTO || 3003;
//libreria fs.path
const sistemaArchivo = require("fs")
const ruta = require("path")
const rutaMiArchivo = ruta.join(__dirname,"datos.json")
//importar multer
const multer = require("multer")
//validaciones
const { validarAprendiz } = require("./validaciones/validaciones")
 
//almacenamiento
const almacen = multer.diskStorage({
 
  destination: (req, file, cb)=>{cb(null, "misImagenes/")},
  filename: (req, file, cb)=>{
    const extension = ruta.extname(file.originalname)
    cb(null, `${Date.now()}${extension}`)
  },
 
})
const subir = multer({storage: almacen})
 
//middlewarc body-parse
app.use(express.json())
app.use(express.urlencoded({extended : true}))
 
 
app.get('/', (req, res) => {
  res.send('API Rest Full con express');
});
 
// READ - listar todos los aprendices
app.get('/api/aprendices', (req, res) => {
  sistemaArchivo.readFile(rutaMiArchivo, "utf-8", (error, Datos)=>{
    if (error) return res.status(500).json({error : "No se puede leer el archivo"})
    const listaAprendices = JSON.parse(Datos)
    res.status(200).json({ Listado : listaAprendices})
  })
});
 
// READ - obtener un aprendiz por id
app.get('/api/aprendices/:id', (req, res) => {
  sistemaArchivo.readFile(rutaMiArchivo, "utf-8", (error, Datos)=>{
    if (error) return res.status(500).json({error : "No se puede leer el archivo"})
    const listaAprendices = JSON.parse(Datos)
    const aprendiz = listaAprendices.find(a => Number(a.id) === Number(req.params.id))
    if (!aprendiz) return res.status(404).json({ error: "Aprendiz no encontrado" })
    res.status(200).json(aprendiz)
  })
});
 
// CREATE - crear un aprendiz nuevo (con validaciones)
app.post('/api/aprendices', subir.single("imagen"), (req, res) => {
  const datosAprendiz = req.body
 
  // Validamos nombre y correo antes de guardar
  const errores = validarAprendiz({ nombre: datosAprendiz.nombre, correo: datosAprendiz.correo })
  if (errores.length > 0) {
    return res.status(400).json({ errores })
  }
 
  datosAprendiz.imagen = req.file ? `/misImagenes/${req.file.filename}` : "sin Imagen"
 
  sistemaArchivo.readFile(rutaMiArchivo, "utf-8", (error, Datos)=>{
    if (error) return res.status(500).json({error : "No se puede leer el archivo"})
    const listaAprendices = JSON.parse(Datos)
 
    // Generamos un id automático: el mayor id existente + 1
    const idsExistentes = listaAprendices.map(a => Number(a.id) || 0)
    const nuevoId = idsExistentes.length > 0 ? Math.max(...idsExistentes) + 1 : 1
    datosAprendiz.id = nuevoId
 
    listaAprendices.push(datosAprendiz)
    sistemaArchivo.writeFile(rutaMiArchivo, JSON.stringify(listaAprendices, null, 2), (error)=>{
      if (error) return res.status(500).json({error : "No se puede escribir en el archivo"})
      res.status(201).json({Mensaje : "Creado", Datos: datosAprendiz})
    })
  })
});
 
// UPDATE - actualizar un aprendiz por id (con validaciones)
app.put('/api/aprendices/:id', (req, res) => {
  sistemaArchivo.readFile(rutaMiArchivo, "utf-8", (error, Datos)=>{
    if (error) return res.status(500).json({error : "No se puede leer el archivo"})
    const listaAprendices = JSON.parse(Datos)
 
    const indice = listaAprendices.findIndex(a => Number(a.id) === Number(req.params.id))
    if (indice === -1) return res.status(404).json({ error: "Aprendiz no encontrado" })
 
    const aprendizActual = listaAprendices[indice]
    const nombreNuevo = req.body.nombre !== undefined ? req.body.nombre : aprendizActual.nombre
    const correoNuevo = req.body.correo !== undefined ? req.body.correo : aprendizActual.correo
 
    const errores = validarAprendiz({ nombre: nombreNuevo, correo: correoNuevo })
    if (errores.length > 0) {
      return res.status(400).json({ errores })
    }
 
    listaAprendices[indice] = { ...aprendizActual, ...req.body, id: aprendizActual.id }
 
    sistemaArchivo.writeFile(rutaMiArchivo, JSON.stringify(listaAprendices, null, 2), (error)=>{
      if (error) return res.status(500).json({error : "No se puede escribir en el archivo"})
      res.status(200).json({Mensaje:"actualizado", Datos: listaAprendices[indice]})
    })
  })
});
 
// DELETE - eliminar un aprendiz por id
app.delete('/api/aprendices/:id', (req, res) => {
  sistemaArchivo.readFile(rutaMiArchivo, "utf-8", (error, Datos)=>{
    if (error) return res.status(500).json({error : "No se puede leer el archivo"})
    const listaAprendices = JSON.parse(Datos)
 
    const indice = listaAprendices.findIndex(a => Number(a.id) === Number(req.params.id))
    if (indice === -1) return res.status(404).json({ error: "Aprendiz no encontrado" })
 
    const eliminado = listaAprendices.splice(indice, 1)
 
    sistemaArchivo.writeFile(rutaMiArchivo, JSON.stringify(listaAprendices, null, 2), (error)=>{
      if (error) return res.status(500).json({error : "No se puede escribir en el archivo"})
      res.status(200).json({Mensaje:"eliminado", Datos: eliminado[0]})
    })
  })
});
 
app.listen(port, () => {
console.log( `Servidor en funcionamiento en el puerto: http://localhost:${port}`);
});
 