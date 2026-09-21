require("dotenv").config()
const { error } = require('console');
const express = require('express');
const app = express();
const port = process.env.MIPUERTO || 3003; 
const jwtoken = require ("jsonwebtoken")
//importar mis Mmiddleware
const registroMiddleware = require("./src/middleware/registroMiddleware")
const manejandoErroresMiddleware = require("./src/middleware/manejandoErroresMiddleware")
const auntenjiboibticacionMiddleware = require ("./src/middleware/autenticacionMiddleware")
//libreria fs.path
const sistemaArchivo = require("fs")
const ruta = require("path")
const rutaMiArchivo = ruta.join(__dirname,"datos.json")

//importar validacion
const { validarAprendiz } = require("./src/validaciones/validaciones")

//importar multer
const multer =require("multer")
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
//usar nuestros Middleware
app.use(registroMiddleware)


app.get('/', (req, res) => {
  res.send('API Rest Full con express');
});

app.get('/api/aprendices', (req, res) => {
  sistemaArchivo.readFile(rutaMiArchivo, "utf-8", (error, Datos)=>{
    if (error) res.status(500).json({error : "No se puede leer el archivo"})
    const listaAprendices = JSON.parse (Datos)
    res.status(200).json({ Listado : listaAprendices})
  })
});


app.post('/api/aprendices', subir.single("imagen"), validarAprendiz, (req, res) => {
  sistemaArchivo.readFile(rutaMiArchivo, "utf-8", (error, Datos)=>{
    if (error) res.status(500).json({error : "No se puede leer el archivo"})
    const listaAprendices = JSON.parse (Datos)

    // Generar el ID empezando desde 1
    const nuevoId = listaAprendices.length > 0 
      ? Number(listaAprendices[listaAprendices.length - 1].id || 0) + 1 
      : 1;

    const datosAprendiz = {
      id: nuevoId,
      ...req.body,
      imagen: req.file ? `/misImagenes/${req.file.filename}` : "sin Imagen"
    }

    listaAprendices.push(datosAprendiz)
    sistemaArchivo.writeFile(rutaMiArchivo, JSON.stringify(listaAprendices, null, 2), (error)=>{
      if (error) res.status(500).json({error : "No se puede escribir en el archivo"})
      res.status(200).json({Mensaje : "Creado", Datos: datosAprendiz})
    })
  
  })
});


app.put('/api/aprendices/:id', (req, res) => {
res.status(200).json({Mensaje:"actualiza aprendices"})
});

app.delete('/api/aprendices', (req, res) => {
res.status(200).json({Mensaje:"eliminado"})
});

//provocar error
app.get("/api/error", (req,res,next)=>{
  next(new Error("este es un error provocado"))
})

app.get("/api/rutaprotegida", auntenjiboibticacionMiddleware, (req, res) => {
  res.json({ mensaje: "Ruta protegida, acceso con token"});
});

//endpoint o ruta de inicio de sesion para generar un token
app.post("/api/iniciarsesion",  (req, res) => {
  //capturar datos del usuario 
  const { usuario, clave } = req.body;
  //simular datos deusuario en la BD 
  const bdUsuario = {"usuario": "Dayana", "clave": "abc123"}
  //validar datos 
  if (usuario !== bdUsuario.usuario || clave !== bdUsuario.clave)
    {
    res.json({ mensaje: "usuario y/o calve incorrecta"})
  }
  //verificacion y generacion del token 
  const token = jwtoken.sign(
    {"user": req.usuario},
    process.env.JWT_SECRETO,{
      expiresIn: "1h"
    });
  res.json({ token })
});

app.use(manejandoErroresMiddleware)

app.listen(port, () => {
console.log( `Servidor en funcionamiento en el puerto: http://localhost:${port}`);
});