const { Router } = require('express');
const {check} = require('express-validator');


const {login, gooogleSignIn, renovarToken} = require('../controllers/auth');
const {validarCampos, validarJWT} = require('../middlewares');

const router = Router();

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], login);

router.post('/google',[
    check('id_token', 'Token de google es necesario').not().isEmpty(),
    validarCampos
], gooogleSignIn);


router.get('/', validarJWT , renovarToken);

module.exports = router;