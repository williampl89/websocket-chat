const express = require('express');
var cors = require('cors');
const fileUpload = require('express-fileupload');
const {createServer} = require('http');

const { dbConecction } = require('../database/config');
const { socketController } = require('../sockets/controller');

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths = {
            auth: '/api/auth', 
            buscar: '/api/buscar', 
            categorias: '/api/categorias', 
            productos: '/api/productos',
            usuarios: '/api/usuarios',
            uploads: '/api/uploads'
        }
        
        //Conectar a base de datos MongoDB
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicacion
        this.routes();

        //Sockets
        this.sockets();

    }

    async conectarDB(){
        await dbConecction();
    }

    middlewares(){
        //CORS
        this.app.use(cors());

        //Parseo y lectura del body
        this.app.use(express.json());

        //directorio publico
        this.app.use( express.static('public'));

        // para manejar la carga de archivo
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));

    }

    sockets(){
        this.io.on('connection', (socket) => socketController(socket, this.io) );
    }

    listen(){
        this.server.listen(this.port, () => {
            console.log('listening on port ', this.port);
        });
    }


}

module.exports = Server;