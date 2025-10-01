import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext.jsx';

const Experience = () => {
  const { experiences, loading } = usePortfolio();

  const formatDate = (dateString) => {
    if (!dateString) return 'Presente';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
  };

  return (
    <section id="experience">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <h2 className="section-title">Experiencia <span className="gradient-text">Laboral</span></h2>
          <p className="section-subtitle">Mi trayectoria profesional y los desafíos que he superado.</p>
          
          <div className="content-grid">
            {(experiences || []).map((exp, index) => (
              <motion.div
                key={exp.id || index}
                className="card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <p className="font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>
                  {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                </p>
                <h3 className="text-2xl font-bold mb-1">{exp.position}</h3>
                <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-muted)' }}>{exp.company}</h4>
                <p className="mb-auto">{exp.description}</p>
                <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  {(exp.technologies || "").split(',').map((tech, i) => (
                    <span key={i} className="tech-tag">{tech.trim()}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;