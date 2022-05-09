const { request,response } = require('express');
const Usuarios = require('../models/Usuario');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res, next) => {
    res.render('crearCuenta', {
        nombrePagina: 'Registrate en UpTask'
    })
}
exports.formIniciarSesion = (req, res, next) => {
    const {error} = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Inicia Sesión en UpTask',
        error
    })
}

exports.crearCuenta = async (req, res, next) => {
    
    const {email, password} = req.body;

    try {
        await Usuarios.create({
            email, password
        });

        //Crear una URL de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //crear el objeto usuario
        const usuario = {
            email
        }
        //enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirmar Cuenta',
            confirmarUrl,
            archivo: 'confirmarCuenta'
        })

        //redirigir al usuario
        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error.errors.map((error) => error.message)),
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta en Uptask',
            email,
            password
        })
    }
}

exports.formRestablecerPassword = (req = request, res = response, next) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu Contraseña'
    })

}

exports.confirmarCuenta = async (req = request, res = response, next) => {

    const {email} = req.params;

    const usuario = await Usuarios.findOne({
        where: {
            email
        }
    });

    if(!usuario){
        req.flash('error', 'No Válido')
        res.redirect('/registrarse')
    }

    usuario.activo = 1;
    await usuario.save();
    req.flash('correcto', 'Cuenta Activada correctamente');
    res.redirect('/iniciar-sesion')
}   