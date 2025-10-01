const { Skill } = require('../models');

// GET - Obtener todas las habilidades
const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.findAll({
      order: [['category', 'ASC'], ['level', 'DESC']]
    });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener habilidades', error: error.message });
  }
};

// GET - Obtener habilidades por categoría
const getSkillsByCategory = async (req, res) => {
  try {
    const skills = await Skill.findAll({
      where: { category: req.params.category },
      order: [['level', 'DESC']]
    });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener habilidades', error: error.message });
  }
};

// GET - Obtener una habilidad por ID
const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Habilidad no encontrada' });
    }
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener habilidad', error: error.message });
  }
};

// POST - Crear nueva habilidad
const createSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear habilidad', error: error.message });
  }
};

// PUT - Actualizar habilidad
const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Habilidad no encontrada' });
    }
    await skill.update(req.body);
    res.json(skill);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar habilidad', error: error.message });
  }
};

// DELETE - Eliminar habilidad
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Habilidad no encontrada' });
    }
    await skill.destroy();
    res.json({ message: 'Habilidad eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar habilidad', error: error.message });
  }
};

module.exports = {
  getAllSkills,
  getSkillsByCategory,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill
};