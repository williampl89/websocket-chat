const {response} = require('express');
const bcryptjs = require('bcryptjs');
const { jwtDecode } = require('jwt-decode');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-JWT');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res = response) => {

    const {correo, password} = req.body;

    try {
        //verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        //verificar si usuario esta activo en BD
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        //validar password
        const validarPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validarPassword){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }


        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

   
}

const gooogleSignIn = async(req, res = response) => {

    const {id_token} = req.body;

    //funcion para verificar la firma del token por google.
    //Nota dev, en local no se pudo verificar la firma :  unable to verify the first certificate
    try {

        /*const googleUser = await googleVerify(id_token);
        console.log('id token: ' + id_token);
        console.log('googleUser: ' + googleUser);*/

        const decoded = jwtDecode(id_token);  
      
        //const {name, picture, email } = decoded;
        const nombre = decoded.name;
        const correo = decoded.email;
        const img = decoded.picture;
        //console.log(id_token);
        //console.log(correo);
        //console.log(img);

        //verificar si usuario existe en base de datos

        const usuario = await Usuario.findOne({ correo: correo });
    
        //console.log("usuario: " + usuario);
        if( !usuario ){ //if usuario no existe
            //data para crearlo

            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
                rol: 'USER_ROLE',
                estado: true
            }

            const newusuario = new Usuario(data);
            await newusuario.save();

        }

        //si el usuario en DB es true con google pero en esta borrado (estado false)

        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        //generar el json web token
        //Generar el JWT
        const token = await generarJWT(usuario.id);



        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        });
    } 
    
    
}

const renovarToken = async(req, res = response) => {
    const {usuario} = req

    //generar el JWT
    const token = await generarJWT(usuario.id);
    res.json({
        usuario,
        token
    });

}

module.exports = {
    login,
    gooogleSignIn,
    renovarToken
}