const Proyectos = require("../models/Proyecto");
const Tareas = require("../models/Tarea");

const agregarTarea = async (req, res, next) => {
  //Obtenemos el proyecto actual
  const proyecto = await Proyectos.findOne({ where: { url: req.params.url } });

  //leer el valor del input
  const { tarea } = req.body;

  const estado = 0;
  const proyectoId = proyecto.id;

  const resultado = await Tareas.create({ tareas: tarea, estado, proyectoId });

  if (!resultado) {
    next();
  }

  res.redirect(`/proyectos/${req.params.url}`);
};


const cambiarEstadoTarea = async (req, res, next) => {
    const {id} = req.params;
    const tarea = await Tareas.findOne({where: { id }});

    //cambiat el estado
    let estado = 0;
    if(tarea.estado === estado){
      estado = 1
    }
    tarea.estado = estado;

    const resultado = await tarea.save();
    if(!resultado) return next()
    res.status(200).send('Estado actualizado')
}

const eliminarTarea = async (req, res, next) => {

    const {id} = req.params;
    const tarea = await Tareas.destroy({where: { id }});

    if(!tarea) return next();
    res.status(200).send('Tarea Eliminada');
}

module.exports = {
  agregarTarea,
  cambiarEstadoTarea,
  eliminarTarea
};
