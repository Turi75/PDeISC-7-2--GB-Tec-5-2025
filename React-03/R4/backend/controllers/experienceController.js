const { Experience } = require('../models');

// GET - Obtener todas las experiencias
const getAllExperiences = async (req, res) => {
  try {
    const experiences = await Experience.findAll({
      order: [['startDate', 'DESC']]
    });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener experiencias', error: error.message });
  }
};

// GET - Obtener una experiencia por ID
const getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findByPk(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experiencia no encontrada' });
    }
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener experiencia', error: error.message });
  }
};

// POST - Crear nueva experiencia
const createExperience = async (req, res) => {
  try {
    const experience = await Experience.create(req.body);
    res.status(201).json(experience);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear experiencia', error: error.message });
  }
};

// PUT - Actualizar experiencia
const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findByPk(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experiencia no encontrada' });
    }
    await experience.update(req.body);
    res.json(experience);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar experiencia', error: error.message });
  }
};

// DELETE - Eliminar experiencia
const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findByPk(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experiencia no encontrada' });
    }
    await experience.destroy();
    res.json({ message: 'Experiencia eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar experiencia', error: error.message });
  }
};

module.exports = {
  getAllExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience
};