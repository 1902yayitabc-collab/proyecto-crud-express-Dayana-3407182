const fs = require('fs');
const path = require('path');

// Ruta relativa hacia el archivo datos.json ubicado en la raíz del proyecto
const datosPath = path.join(__dirname, '../../datos.json');

// Función auxiliar para leer los datos del archivo JSON
const leerDatos = () => {
    if (!fs.existsSync(datosPath)) {
        fs.writeFileSync(datosPath, '[]', 'utf-8');
    }
    const jsonBytes = fs.readFileSync(datosPath, 'utf-8');
    return JSON.parse(jsonBytes || '[]');
};

// Función auxiliar para escribir y guardar en el archivo JSON
const guardarDatos = (datos) => {
    fs.writeFileSync(datosPath, JSON.stringify(datos, null, 2), 'utf-8');
};

const productoController = {
    // GET /productos - Obtener la lista completa
    obtenerTodos: (req, res) => {
        try {
            const productos = leerDatos();
            res.json(productos);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al leer los datos', error: error.message });
        }
    },

    // GET /productos/:id - Obtener un registro por su ID
    obtenerPorId: (req, res) => {
        try {
            const productos = leerDatos();
            const id = parseInt(req.params.id);
            const producto = productos.find(p => p.id === id);

            if (!producto) {
                return res.status(404).json({ mensaje: 'Registro no encontrado' });
            }

            res.json(producto);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al buscar el registro', error: error.message });
        }
    },

    // POST /productos - Crear un nuevo registro
    crear: (req, res) => {
        try {
            const productos = leerDatos();
            
            // Si usas Multer guarda la ruta en /misImagenes/, de lo contrario toma el string enviado
            const imagenRuta = req.file ? `/misImagenes/${req.file.filename}` : (req.body.imagen || '');

            const nuevoRegistro = {
                id: productos.length > 0 ? (productos[productos.length - 1].id || 0) + 1 : 1,
                nombre: req.body.nombre,
                edad: req.body.edad,
                correo: req.body.correo,
                clave: req.body.clave,
                imagen: imagenRuta
            };

            productos.push(nuevoRegistro);
            guardarDatos(productos);

            res.status(201).json({ mensaje: 'Creado exitosamente', producto: nuevoRegistro });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al guardar el registro', error: error.message });
        }
    },

    // PUT /productos/:id - Actualizar un registro existente
    actualizar: (req, res) => {
        try {
            const productos = leerDatos();
            const id = parseInt(req.params.id);
            const index = productos.findIndex(p => p.id === id);

            if (index === -1) {
                return res.status(404).json({ mensaje: 'Registro no encontrado' });
            }

            // Mantiene las propiedades anteriores y sobrescribe con las recibidas
            productos[index] = { ...productos[index], ...req.body };
            guardarDatos(productos);

            res.json({ mensaje: 'Actualizado exitosamente', producto: productos[index] });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al actualizar el registro', error: error.message });
        }
    },

    // DELETE /productos/:id - Eliminar un registro
    eliminar: (req, res) => {
        try {
            const productos = leerDatos();
            const id = parseInt(req.params.id);

            const elementoAEliminar = productos.find(p => p.id === id);
            if (!elementoAEliminar) {
                return res.status(404).json({ mensaje: 'Registro no encontrado' });
            }

            // Opcional: elimina la imagen del disco si está guardada en la carpeta misImagenes
            if (elementoAEliminar.imagen && elementoAEliminar.imagen.includes('/misImagenes/')) {
                const nombreArchivo = path.basename(elementoAEliminar.imagen);
                const rutaImagen = path.join(__dirname, '../misImagenes', nombreArchivo);
                if (fs.existsSync(rutaImagen)) {
                    fs.unlinkSync(rutaImagen);
                }
            }

            const productosFiltrados = productos.filter(p => p.id !== id);
            guardarDatos(productosFiltrados);

            res.json({ mensaje: 'Eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al eliminar el registro', error: error.message });
        }
    }
};

module.exports = productoController;