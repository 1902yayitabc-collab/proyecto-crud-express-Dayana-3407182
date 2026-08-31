const express = require ('express');
const app = express();
const port = process.env.MIPUERTO || 3003; 
//middlewarc body-partes
app.use(express.json())


app.get('/', (req, res) => {
  res.send('API Rest Full con express');
});

app.get('/api/aprendices', (req, res) => {
 res.status(200).json({mensaje: "Lista aprendices "})
});

app.post('/api/aprendices', (req, res) => {
  const datosAprendiz = req.body
  const edad = req.body.edad

  if (edad <18 ){
    return res.status(200).json({ mensaje:"crear aprendices", datos: datosAprendiz,   Edad: "eres menor de edad"});
  } else { 
  return res.status(200).json({ mensaje:"crear aprendices", datos: datosAprendiz, Edad: "eres mayor de edad"});
}});

app.put('/api/aprendices/:id', (req, res) => {
 res.status(200).json({mensaje: "Actualizar aprencices"})
});

app.delete('/api/aprendices', (req, res) => {
 res.status(200).json({mensaje: "Eliminado"})
});

app.listen(port, () => {
console.log( `Servidor en funcionamiento en el puerto: http://localhost:${port}`);
});