import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
  return (
    <section id="contact">
      <div className="container">
        <h2 className="section-title">Contacta Conmigo</h2>
        <p className="section-subtitle">¿Tienes un proyecto en mente o una oportunidad? ¡Hablemos!</p>
        <div className="card max-w-5xl mx-auto">
          <div className="contact-grid">
            <div className="space-y-8">
              <h3 className="text-3xl font-bold">Información de Contacto</h3>
              <ContactInfoItem icon={<FaEnvelope />} title="Email" text="RamiroGarcia@example.com" />
              <ContactInfoItem icon={<FaPhone />} title="Teléfono" text="+54 9 11 2345-6789" />
              <ContactInfoItem icon={<FaMapMarkerAlt />} title="Ubicación" text="Buenos Aires, Argentina" />
            </div>
            <form className="space-y-4">
              <input type="text" className="input-field" placeholder="Tu Nombre Completo" required />
              <input type="email" className="input-field" placeholder="Tu Email" required />
              <textarea rows="5" className="input-field" placeholder="Cuéntame sobre tu proyecto..." required></textarea>
              <button type="submit" className="w-full btn btn-primary">Enviar Mensaje</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactInfoItem = ({ icon, title, text }) => (
  <div>
    <div className="flex items-center gap-4">
      <div className="text-2xl" style={{ color: 'var(--color-primary)' }}>{icon}</div>
      <h4 className="font-semibold text-xl">{title}</h4>
    </div>
    <p className="pl-10 text-lg" style={{ color: 'var(--color-text-muted)' }}>{text}</p>
  </div>
);

export default Contact;