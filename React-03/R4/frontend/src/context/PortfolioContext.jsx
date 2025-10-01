import { createContext, useContext, useState, useEffect } from 'react';
import { experiencesAPI, projectsAPI, skillsAPI } from '../services/api';

const PortfolioContext = createContext();

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio debe usarse dentro de PortfolioProvider');
  }
  return context;
};

export const PortfolioProvider = ({ children }) => {
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [expRes, projRes, skillsRes] = await Promise.all([
        experiencesAPI.getAll(),
        projectsAPI.getAll(),
        skillsAPI.getAll(),
      ]);

      setExperiences(expRes.data);
      setProjects(projRes.data);
      setSkills(skillsRes.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Experience CRUD
  const addExperience = async (data) => {
    try {
      const response = await experiencesAPI.create(data);
      setExperiences([...experiences, response.data]);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const updateExperience = async (id, data) => {
    try {
      const response = await experiencesAPI.update(id, data);
      setExperiences(experiences.map(exp => exp.id === id ? response.data : exp));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteExperience = async (id) => {
    try {
      await experiencesAPI.delete(id);
      setExperiences(experiences.filter(exp => exp.id !== id));
    } catch (err) {
      throw err;
    }
  };

  // Project CRUD
  const addProject = async (data) => {
    try {
      const response = await projectsAPI.create(data);
      setProjects([...projects, response.data]);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const updateProject = async (id, data) => {
    try {
      const response = await projectsAPI.update(id, data);
      setProjects(projects.map(proj => proj.id === id ? response.data : proj));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteProject = async (id) => {
    try {
      await projectsAPI.delete(id);
      setProjects(projects.filter(proj => proj.id !== id));
    } catch (err) {
      throw err;
    }
  };

  // Skill CRUD
  const addSkill = async (data) => {
    try {
      const response = await skillsAPI.create(data);
      setSkills([...skills, response.data]);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const updateSkill = async (id, data) => {
    try {
      const response = await skillsAPI.update(id, data);
      setSkills(skills.map(skill => skill.id === id ? response.data : skill));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteSkill = async (id) => {
    try {
      await skillsAPI.delete(id);
      setSkills(skills.filter(skill => skill.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const value = {
    experiences,
    projects,
    skills,
    loading,
    error,
    addExperience,
    updateExperience,
    deleteExperience,
    addProject,
    updateProject,
    deleteProject,
    addSkill,
    updateSkill,
    deleteSkill,
    refreshData: fetchAllData,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};