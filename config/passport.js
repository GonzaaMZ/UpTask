const passport = require('passport');
const localStrategy = require('passport-local');

//Referencia al modelo que vamos a autenticar
const Usuarios = require('../models/Usuario');

//local strategy - Login con credenciales propia (usuario y password)
passport.use(
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                })
                if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message: 'Password Incorrecto'
                    }) 
                }

                return done(null, usuario);

            } catch (error) {
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
)

//serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
})

//deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
})

module.exports = passport;