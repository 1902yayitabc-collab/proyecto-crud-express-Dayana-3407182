require("dotenv").config();
const express = require("express");
const enrutadorGeneral = require("./routes");

const app = express();
//debmos importar los enrutadores de la carpeta router 

//importar los middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//usamos el enrutador general 
app.use("/api", enrutadorGeneral)

//enpoint de la ruta raiz de la bienvenida a la API 
app.get ("/", (req, res) => {
    res.send("Api Rest 3407182 en funcionamiento");
});
module.exports = app;