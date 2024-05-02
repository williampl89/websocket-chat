const { Router } = require('express');
const {check} = require('express-validator');
const {validarJWT, validarCampos, esAdminRole} = require('../middlewares');
const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria, 
        actualizarCategoria, 
        borrarCategoria} = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

/*
    url /api/categorias
*/

// 1  Obtener todas las categorias - publico 
router.get('/', obtenerCategorias); 


// 2  Obtener una categoria por ID - publico
router.get('/:id', [
    check('id', 'El id no es un de MongoDB').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoria); 

// 3  Crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
] , crearCategoria); 

// 4  Actualizar categoria - privado - cualquier persona con un token valido
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria); 

// 5 Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'El id no es un de MongoDB').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria); 

 

module.exports = router;