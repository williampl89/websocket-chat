const { Router } = require('express');
const {check} = require('express-validator');
const {validarJWT, validarCampos, esAdminRole} = require('../middlewares');
const { crearProducto, 
        obtenerProductos, 
        obtenerProducto, 
        actualizarProducto, 
        borrarProducto} = require('../controllers/productos');

const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

const router = Router();

/*
    url /api/productos
*/

// 1  Obtener todos las productos - publico 
router.get('/', obtenerProductos); 


// 2  Obtener una categoria por ID - publico
router.get('/:id', [
    check('id', 'El id no es un de MongoDB').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto);

// 3  Crear Producto - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID de mongoDB').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
] , crearProducto); 

// 4  Actualizar Producto - privado - cualquier persona con un token valido
router.put('/:id',[
    validarJWT,
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

// 5 Borrar una Producto - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'El id no es un de MongoDB').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto); 

 

module.exports = router;