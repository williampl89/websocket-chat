const { response } = require('express');
const{ Producto } = require('../models');
const producto = require('../models/producto');


//obtenerProductos  - paginado - total - populate

const obtenerProductos = async(req = request, res = response) => {

    const query = { estado: true }
    const { limite = 5, desde = 0 } = req.query;
    

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        total,
        productos
    })

     
}

//obtenerProducto   - populate {}
const obtenerProducto = async(req, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findById(id)
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');

    res.json(producto);

}

const crearProducto = async(req, res = response) => {

    const { estado, usuario, ...body } = req.body;

    const ProductoDB = await Producto.findOne({ nombre: body.nombre });

    if( ProductoDB ){
        return res.status(400).json({
            msg: `El producto ${ProductoDB.nombre}, ya existe`
        })
    }

    //Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id

    }

    const producto = new Producto (data);

    //save DB
    await producto.save();

    res.status(201).json(producto)


}


// obtenerProducto
const actualizarProducto = async(req, res = response) => {
    const { id } = req.params;

    const { estado, usuario, ...data } = req.body;  //para sacar 2 campos por si viene en el body y afecte

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }
    
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json( producto );

}

// borrarProducto - estado: false
const borrarProducto = async(req, res = response) => {
    const { id } = req.params;

    const productoBorrado = await Producto.findByIdAndUpdate(id, {estado: false }, { new: true })
    res.json( productoBorrado );
}


module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}