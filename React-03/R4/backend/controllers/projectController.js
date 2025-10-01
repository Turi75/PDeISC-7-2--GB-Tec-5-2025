const { Project } = require('../models');

// GET - Obtener todos los proyectos
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener proyectos', error: error.message });
  }
};

// GET - Obtener proyectos destacados
const getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { featured: true },
      order: [['createdAt', 'DESC']]
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener proyectos destacados', error: error.message });
  }
};

// GET - Obtener un proyecto por ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener proyecto', error: error.message });
  }
};

// POST - Crear nuevo proyecto
const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear proyecto', error: error.message });
  }
};

// PUT - Actualizar proyecto
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    await project.update(req.body);
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar proyecto', error: error.message });
  }
};

// DELETE - Eliminar proyecto
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    await project.destroy();
    res.json({ message: 'Proyecto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar proyecto', error: error.message });
  }
};

module.exports = {
  getAllProjects,
  getFeaturedProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};