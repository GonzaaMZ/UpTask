const { Router } = require("express");
const { body } = require("express-validator/check");

const proyectosController = require("../controller/proyectos.controller");
const tareasController = require("../controller/tareas.controller");
const usuariosController = require("../controller/usuarios.controller");
const authController = require("../controller/auth.controller");

const router = Router();

router.get(
  "/",
  authController.usuarioAutenticado,
  proyectosController.proyectosHome
);

router.get(
  "/nuevo-proyecto",
  authController.usuarioAutenticado,
  proyectosController.formularioProyecto
);

router.post(
  "/nuevo-proyecto",
  authController.usuarioAutenticado,
  body("nombre").not().isEmpty().trim().escape(),
  proyectosController.nuevoProyecto
);

//Listar proyecto
router.get(
  "/proyectos/:url",
  authController.usuarioAutenticado,
  proyectosController.proyectoByUrl
);

//Actualizar el proyecto
router.get(
  "/proyecto/editar/:id",
  authController.usuarioAutenticado,
  proyectosController.formularioEditar
);
router.post(
  "/nuevo-proyecto/:id",
  body("nombre").not().isEmpty().trim().escape(),
  proyectosController.actualizarProyecto
);

//Eliminar proyecto
router.delete(
  "/proyectos/:url",
  authController.usuarioAutenticado,
  proyectosController.eliminarProyecto
);

//Tareas
router.post(
  "/proyectos/:url",
  authController.usuarioAutenticado,
  tareasController.agregarTarea
);

//Actualizar tarea
router.patch(
  "/tareas/:id",
  authController.usuarioAutenticado,
  tareasController.cambiarEstadoTarea
);

//Eliminar tarea
router.delete(
  "/tareas/:id",
  authController.usuarioAutenticado,
  tareasController.eliminarTarea
);

//Crear nueva cuenta
router.get("/registrarse", usuariosController.formCrearCuenta);
router.post("/registrarse", usuariosController.crearCuenta);
router.get('/confirmar/:email', usuariosController.confirmarCuenta);

//Iniciar sesion

router.get("/iniciar-sesion", usuariosController.formIniciarSesion);
router.post("/iniciar-sesion", authController.autenticarUsuario);

//Cerrar sesion
router.get('/cerrar-sesion', authController.cerrarSesion);

//Restablecer contraseña
router.get('/reestablecer', usuariosController.formRestablecerPassword);
router.post('/reestablecer', authController.enviarToken);
router.get('/reestablecer/:token', authController.validarToken);
router.post('/reestablecer/:token', authController.actualizarPassword);



module.exports = router;
