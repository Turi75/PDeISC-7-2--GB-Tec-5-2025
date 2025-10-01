import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext.jsx';

const Skills = () => {
  const { skills = [] } = usePortfolio();
  
  const groupedSkills = (skills || []).reduce((acc, skill) => {
    const category = skill.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <h2 className="section-title">Habilidades <span className="gradient-text">Técnicas</span></h2>
          <p className="section-subtitle">Tecnologías y herramientas que domino para construir productos digitales de alta calidad.</p>

          <div className="space-y-12">
            {Object.entries(groupedSkills).map(([category, skillsInCategory], catIndex) => (
              <motion.div 
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: catIndex * 0.2 }}
              >
                <h3 className="text-2xl font-bold mb-6 text-center md:text-left">{category}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {skillsInCategory.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.id || skillIndex}
                      className="card p-4 text-center items-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: skillIndex * 0.05 }}
                    >
                      <span className="text-4xl mb-2">{skill.icon || '⚙️'}</span>
                      <h4 className="font-semibold">{skill.name}</h4>
                    </motion.div>
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

export default Skills;