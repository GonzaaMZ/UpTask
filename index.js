
const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
require('dotenv').config({path: 'variables.env'});

//Helpers
const helpers = require('./helpers');

//Crear la conexion a la base de datos
const db = require('./config/db');

//Importar modelo
require('./models/Proyecto');
require('./models/Tarea');
require('./models/Usuario');


db.sync()
.then(() => console.log('Conexion a Base de datos exitosa'))
.catch(error => console.log(error));
//Crear app de express
const app = express();


// app.use(expressValidator());



//Donde cargar los archivos estaticos
app.use(express.static('public'))

//habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}))

//Habilitar pug
app.set('view engine', 'pug');

//Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

//Agregar flash messages
app.use(flash());

app.use(cookieParser());

app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

//Pasar var dump a la aplicacion
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
})

app.use('/', routes);

//Servidor y Puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8080;

app.listen(port, host, () => {
    console.log('El servidor esta funcionando')
})
