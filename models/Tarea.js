const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyecto');

const Tareas = db.define('tareas',{
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tareas: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1)
});

Tareas.belongsTo(Proyectos);

module.exports = Tareas;