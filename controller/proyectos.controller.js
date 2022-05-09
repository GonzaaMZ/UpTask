const { request, response } = require("express");
const Proyectos = require("../models/Proyecto");
const Tareas = require("../models/Tarea");

const proyectosHome = async (req, res = response) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({where: {usuarioId}});
  res.render("index", {
    nombrePagina: "Proyectos",
    proyectos,
  });
};

const formularioProyecto = async (req, res = response) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({where: {usuarioId}});

  res.render("nuevoProyecto", {
    nombrePagina: "Nuevo Proyecto",
    proyectos,
  });
};

const nuevoProyecto = async (req = request, res = response) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({where: {usuarioId}});

  const { nombre } = req.body;

  let errores = [];

  if (!nombre) {
    errores.push({ texto: "Agregar un nombre al proyecto" });
  }

  if (errores.length > 0) {
    res.render("nuevoProyecto", {
      nombrePagina: "Nuevo Proyecto",
      errores,
      proyectos,
    });
  } else {
    //Insertar en la BD
    const usuarioId = res.locals.usuario.id;
    const proyecto = await Proyectos.create({ nombre, usuarioId });
    res.redirect("/");
  }
};

const proyectoByUrl = async (req, res, next) => {

  const usuarioId = res.locals.usuario.id;
  const proyectosPromise =  Proyectos.findAll({where: {usuarioId}});

  const proyectoPromise = Proyectos.findOne({
    where: {
      url: req.params.url,
      usuarioId
    },
  });

  const [proyecto, proyectos] = await Promise.all([
    proyectoPromise,
    proyectosPromise,
  ]);

  //Consultar tareas del proyecto actual
  const tareas = await Tareas.findAll({
    where: {
      proyectoId: proyecto.id,
    },
    // include: [{model: Proyectos}]
  });

  if (!proyecto) next();
  res.render("tareas", {
    nombrePagina: "Tareas del Proyecto",
    proyecto,
    proyectos,
    tareas,
  });
};

const formularioEditar = async (req, res) => {

  const usuarioId = res.locals.usuario.id;
  const proyectosPromise =  Proyectos.findAll({where: {usuarioId}});

  const proyectoPromise = Proyectos.findOne({
    where: {
      id: req.params.id,
      usuarioId
    },
  });

  const [proyecto, proyectos] = await Promise.all([
    proyectoPromise,
    proyectosPromise,
  ]);

  res.render("nuevoProyecto", {
    nombrePagina: "Editar Proyecto",
    proyectos,
    proyecto,
  });
};

const actualizarProyecto = async (req = request, res = response) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({where: {usuarioId}});

  const { nombre } = req.body;

  let errores = [];

  if (!nombre) {
    errores.push({ texto: "Agregar un nombre al proyecto" });
  }

  if (errores.length > 0) {
    res.render("nuevoProyecto", {
      nombrePagina: "Nuevo Proyecto",
      errores,
      proyectos,
    });
  } else {
    //Insertar en la BD
    await Proyectos.update(
      { nombre: nombre },
      { where: { id: req.params.id } }
    );
    res.redirect("/");
  }
};

const eliminarProyecto = async (req, res, next) => {
  const { urlProyecto } = req.query;

  const resultado = await Proyectos.destroy({
    where: {
      url: urlProyecto,
    },
  });
  if (!resultado) {
    next();
  }
  res.send("Proyecto eliminado correctamente");
};

module.exports = {
  proyectosHome,
  formularioProyecto,
  nuevoProyecto,
  proyectoByUrl,
  formularioEditar,
  actualizarProyecto,
  eliminarProyecto,
};
