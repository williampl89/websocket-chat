const dbValidators = require('./db-validators');
const generarJWP = require('./generar-JWT');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');

module.exports = {
    ...dbValidators,
    ...generarJWP,
    ...googleVerify,
    ...subirArchivo
}