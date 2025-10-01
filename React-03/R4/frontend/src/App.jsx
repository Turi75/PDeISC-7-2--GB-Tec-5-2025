import { useEffect } from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    document.body.classList.add('body-with-navbar-padding');
    return () => document.body.classList.remove('body-with-navbar-padding');
  }, []);

  return (
    <PortfolioProvider>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
        <AdminPanel />
      </main>
      <Footer />
    </PortfolioProvider>
  );
}

export default App;