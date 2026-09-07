const express = require ('express');
const app = express();
const port = process.env.MIPUERTO || 3003; 

//librerias fs, path
const sistemaArchivo = require("fs");
const ruta = require("path")
const rutaMiArchivo =ruta.join(__dirname, "datos.json");
//middlewarc body-partes
app.use(express.json())
app.use(express.urlencoded({extended: true})) 


app.get('/', (req, res) => {
  res.send('API Rest Full con express');
});

app.get('/api/aprendices', (req, res) => {
  sistemaArchivo.readFile(rutaMiArchivo, "utf-8", (error, datos)=> {
   if(error) res.status(500).json({Error: "No se puede leer el archivo"})
   const listaAprendices = JSON.parse (datos)
   res.status (200).json({listado: listaAprendices})     
  })
});

app.post('/api/aprendices', (req, res) => {
  const datosAprendiz = req.body
  sistemaArchivo.readFile(rutaMiArchivo, "utf-8", (error, datos)=> {
   if(error) res.status(500).json({Error: "No se puede leer el archivo"})
    const listaAprendices = JSON.parse (datos)
    listaAprendices.push(datosAprendiz)
    sistemaArchivo.writeFile(rutaMiArchivo, JSON.stringify(listaAprendices, null, 2), (error)=> {
      if(error) res.status(500).json({Error: "No se puede escribir en el archivo"})
      res.status(200).json({mensaje: "creado", datos: datosAprendiz})
    });     
  });
});

app.put('/api/aprendices/:id', (req, res) => {
 res.status(200).json({mensaje: "Actualizar aprencices"})
});

app.delete('/api/aprendices', (req, res) => {
 res.status(200).json({mensaje: "Eliminado"})
});

app.listen(port, () => {
console.log( `Servidor en funcionamiento en el puerto: http://localhost:${port}`);
});