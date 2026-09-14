const jwtojen = require ("jsonwebtoken")
const autenticacion  = (req, res, next) => {
    const token = req.header
    ("campoAutenticar")?.split(" ")[1]
    if(!token){
       return res.status (401).json 
        ({Mensaje:" Acceso negado, no provee token"})
    }
    //verificar token 
    jwtojen.verify(token, process.env.JWT_SECRETO,(error, usuario)=>{
        if(error){
            res.status(403).json 
            ({Mensaje:"token invalido"})
        }
        req.usuario = usuario 
    
    })
}
module.exports = autenticacion