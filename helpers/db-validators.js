const Role = require('../models/role');
const { Usuario, Categoria, Producto  } = require('../models');

const esRoleValido = async( rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if(!existeRol){
        throw new Error(`El rol ${rol} no esta registrado en la BD`)
    }
}

//verificar si el correo existe
const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if(existeEmail){
       throw new Error (`El correo ${ correo }, ya esta registrado`);
    }
}

const existeUsuarioPorId = async (id) => {
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){
       throw new Error (`El id no existe: ${ id }`);
    }
}

const existeCategoriaPorId = async (id) => {
 
    const existeCategoria = await Categoria.findById(id);
    if(!existeCategoria){
       throw new Error (`El id no existe: ${ id }`);
    }
}

const existeProductoPorId = async (id) => {
 
    const existeProductoPorId = await Producto.findById(id);
    if(!existeProductoPorId){
       throw new Error (`El id no existe: ${ id }`);
    }
}

//validar colecciones permitidas
const coleccionesPermitidas =  (coleccion = '', colecciones = []) => {
 
    const incluida =  colecciones.includes(coleccion);
    if( !incluida ){
       throw new Error (`La coleccion: ${ coleccion } no es permitida, colecciones permitidas -> ${ colecciones }`);
    }

    return true;
}



module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}