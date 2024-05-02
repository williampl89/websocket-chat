const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async(req = request, res = response) => {

    const query = { estado: true }
    const { limite = 5, desde = 0 } = req.query;
    
    /* const usuarios = await Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))

    const total = await Usuario.countDocuments(query)   

    A continuacion se optimiza en una sola query multiples consultas

     */
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    })

    //const {q, nombre='No name', apikey, page= 1} = req.query

    /*   para mostrar x info
    res.json({
        msg: 'get API - constrollador',
        q,
        nombre,
        apikey,
        page
    })
    */

     
}

const usuariosPost = async(req, res = response) => {


    const { nombre, correo, password, rol, img } = req.body;

    const usuario = new Usuario({ nombre, correo, password, rol, img});
    
    //Encriptar la contrasena 
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //guardar en BD

    await usuario.save();

    res.json({
        usuario
    })
}

const usuariosPut = async(req, res = response) => {

    const { id } = req.params;

    //se ponen los datos que no se quieren actualizar
    const {_id, password, google, correo,  ...resto} = req.body;

    //todo validar contra base de datos

    if( password ){
    
        //Encriptar la contrasena 
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, {new: true});


    res.json(usuario)
}


const usuariosPatch= (req, res = response) => {
    res.json({
        msg: 'patch API - constrollador'
    })
}

const usuariosDelete= async(req, res = response) => {


    const { id } = req.params;

    //const uid = req.uid;

    //Dos formas de borrar de la base de datos

    //1 Borrando fisicamente en la bd
    //const usuario = await Usuario.findByIdAndDelete(id);

    //2 Borrando con una variable bandera, cambiarla a false 

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    //const usuarioAutenticado = req.usuario;

    res.json({
        usuario
    })
}

module.exports = { 
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
 }