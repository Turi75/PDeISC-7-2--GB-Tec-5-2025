const sequelize = require('../config/database');
const Experience = require('./Experience');
const Project = require('./Project');
const Skill = require('./Skill');

const models = {
  Experience,
  Project,
  Skill
};

const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
    
    // Sincronizar modelos con la base de datos
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados con la base de datos.');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  initDatabase,
  ...models
};