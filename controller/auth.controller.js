const { request, response } = require("express");
const passport = require("passport");
const { Op } = require("sequelize");
const bcrypt = require('bcrypt-nodejs')
const enviarEmail = require('../handlers/email');


const crypto = require("crypto");

const Usuarios = require("../models/Usuario");

exports.autenticarUsuario = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/iniciar-sesion",
  failureFlash: true,
  badRequestMessage: "Ambos Campos son Obligatorios",
});

exports.usuarioAutenticado = (req = request, res = response, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/iniciar-sesion");
};

exports.cerrarSesion = (req = request, res = response, next) => {
  req.session.destroy(() => {
    res.redirect("/iniciar-sesion");
  });
};

exports.enviarToken = async (req = request, res = response, next) => {
  //Verificar que el usuario existe
  const { email } = req.body;
  const usuario = await Usuarios.findOne({ where: { email } });

  if (!usuario) {
    req.flash("error", "No existe esa cuenta");
    res.redirect("/reestablecer");
  }

  usuario.token = crypto.randomBytes(20).toString("hex");
  usuario.expiracion = Date.now() + 3600000;

  await usuario.save();

  const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

  //Enviar el correo con el token
  await enviarEmail.enviar({
      usuario,
      subject: 'Password Reset',
      resetUrl,
      archivo: 'reestablecerPassword'
  })

  req.flash('correcto', 'Se envió un mensaje a tu correo')
  res.redirect('/iniciar-sesion')
};

exports.validarToken = async (req = request, res = response, next) => {
  const { token } = req.params;
  const usuario = await Usuarios.findOne({
    where: {
      token,
    },
  });

  if (!usuario) {
    req.flash("error", "No Válido");
    res.redirect("/reestablecer");
  }

  res.render("resetPassword", {
    nombrePagina: "Reestablecer Contraseña",
  });
};

exports.actualizarPassword = async (req = request, res = response, next) => {
    const {token} = req.params;

    const usuario = await Usuarios.findOne({
        where: {
            token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });

    if(!usuario){
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer')
    }

    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

   await usuario.save();

   req.flash('correcto', 'Tu Contraseña se ha modificado correctamente');
   res.redirect('/iniciar-sesion');

};
