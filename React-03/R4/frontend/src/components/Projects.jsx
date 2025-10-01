import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext.jsx';

const Projects = () => {
  const { projects = [] } = usePortfolio() || {};

  return (
    <section id="projects">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <h2 className="section-title">Mis <span className="gradient-text">Proyectos</span></h2>
          <p className="section-subtitle">Una selección de mis trabajos más destacados, desde aplicaciones web hasta soluciones complejas.</p>
          
          <div className="content-grid">
            {(projects || []).map((project, index) => (
              <motion.div
                key={project.id ?? index}
                className="card group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <img src={project.imageUrl || 'https://via.placeholder.com/400x200'} alt={project.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="mb-4" style={{ color: 'var(--color-text-muted)' }}>{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-auto">
                  {(project.technologies || "").split(',').map((tech, i) => (
                    <span key={i} className="tech-tag">{tech.trim()}</span>
                  ))}
                </div>
                <div className="flex gap-3 pt-4 mt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center btn btn-primary">Ver Demo</a>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center btn btn-secondary">GitHub</a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;