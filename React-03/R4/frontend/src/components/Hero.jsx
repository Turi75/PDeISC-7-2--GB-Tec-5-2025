import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center text-center">
      <div className="container">
        <motion.p className="mb-4 font-bold text-lg" style={{ color: 'var(--color-primary)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          Hola, soy Ramiro Garcia
        </motion.p>
        <motion.h1 className="hero-title font-extrabold mb-6 leading-tight" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
          Full Stack Developer<br/>
          <span className="gradient-text">Innovador.</span>
        </motion.h1>
        <motion.p className="hero-subtitle max-w-3xl mx-auto mb-10" style={{ color: 'var(--color-text-body)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
          Apasionado por crear experiencias web excepcionales con código limpio, diseños modernos y arquitecturas escalables.
        </motion.p>
        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }}>
          <a href="#projects" className="btn btn-primary">Ver Proyectos</a>
          <a href="#contact" className="btn btn-secondary">Contactar</a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;