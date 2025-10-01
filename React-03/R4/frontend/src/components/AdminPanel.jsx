import { useState } from 'react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('experiences');
  const tabs = [ { id: 'experiences', label: 'Experiencias' }, { id: 'projects', label: 'Proyectos' }, { id: 'skills', label: 'Habilidades' } ];

  return (
    <section id="admin" style={{backgroundColor: 'var(--color-bg-alt)'}}>
      <div className="container">
        <h2 className="section-title">Panel de Administración</h2>
        <p className="section-subtitle">Gestiona el contenido de tu portfolio</p>
        <div className="admin-panel-layout">
          <aside className="flex flex-col gap-4">
            <div className="admin-tabs">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}>
                  {tab.label}
                </button>
              ))}
            </div>
            <button className="btn btn-secondary w-full">+ Agregar Nuevo</button>
          </aside>
          <main>
            <div className="card h-full">
              <h3 className="text-2xl font-bold mb-4">Gestionar {tabs.find(t => t.id === activeTab).label}</h3>
              <p style={{color: 'var(--color-text-muted)'}}>
                El contenido y formulario para '{tabs.find(t => t.id === activeTab).label}' aparecería aquí.
              </p>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default AdminPanel;