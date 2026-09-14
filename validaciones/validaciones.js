// validaciones/validaciones.js

//name > 3
function validarNombre(nombre) {
  if (typeof nombre !== "string") return false;
  return nombre.trim().length >= 3;
}

//correo expresiones regulares
function validarCorreo(correo) {
  if (typeof correo !== "string") return false;
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexCorreo.test(correo.trim());
}

//id:
function validarId(id) {
  // el id debe existir y ser un número válido
  return id !== undefined && id !== null && !isNaN(Number(id));
}

// Junta las validaciones de un aprendiz y devuelve un arreglo con los errores encontrados
function validarAprendiz({ nombre, correo }) {
  const errores = [];

  if (!validarNombre(nombre)) {
    errores.push("El nombre debe tener mínimo 3 letras.");
  }

  if (!validarCorreo(correo)) {
    errores.push("El correo debe tener un formato válido, ejemplo: usuario@dominio.com");
  }

  return errores;
}

module.exports = {
  validarId,
  validarNombre,
  validarCorreo,
  validarAprendiz
};