const {Router} = require("express")

const enrutadorPrueba = Router();

enrutadorPrueba.get("/rutaPersonal", (req,res)=>{
    res.json({mensaje: "Ruta de prueba, personal" });
});

//se realiza todas las rutas con (POST, GET, PUT, DELETE)
module.exports = enrutadorPrueba;