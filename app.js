import express from 'express';
const app = express();
const port = process.env.MIPUERTO || 3003; 

app.get('/', (req, res) => {
  res.send('API Rest Full con express');
});

app.listen(port, () => {
console.log( `Servidor en funcionamiento en el puerto:${port}`);
});
