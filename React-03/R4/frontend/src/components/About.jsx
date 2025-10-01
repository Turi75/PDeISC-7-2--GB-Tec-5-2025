import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" style={{backgroundColor: 'var(--color-bg-alt)'}}>
      <div className="container">
        {/* Título y Subtítulo arriba, ocupando todo el ancho */}
        <h2 className="section-title">Sobre <span className="gradient-text">Mí</span></h2>
        <p className="section-subtitle">Conoce un poco más sobre mi trayectoria.</p>
        
        {/* Contenido en 2 columnas */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Columna Izquierda: Imagen */}
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <img 
              src="https://img.a.transfermarkt.technology/portrait/big/211397-1693315161.png?lm=1" // He cambiado la foto de ejemplo
              alt="Alex Rivera, Full Stack Developer" 
              className="rounded-lg w-full h-full object-cover"
            />
          </motion.div>

          {/* Columna Derecha: Texto y Métricas */}
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
            <p className="text-lg mb-10">
              Soy un desarrollador Full Stack con más de 5 años de experiencia. Mi pasión es transformar ideas en soluciones digitales elegantes y funcionales, especializándome en el ecosistema JavaScript con React, Node.js y PostgreSQL.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="card text-center">
                <h4 className="text-4xl font-bold" style={{color: 'var(--color-primary)'}}>50+</h4>
                <p style={{color: 'var(--color-text-muted)'}}>Proyectos Completados</p>
              </div>
              <div className="card text-center">
                <h4 className="text-4xl font-bold" style={{color: 'var(--color-primary)'}}>5+</h4>
                <p style={{color: 'var(--color-text-muted)'}}>Años de Experiencia</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;