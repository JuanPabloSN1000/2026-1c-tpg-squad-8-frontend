import React, { useState, useEffect } from 'react';
import LeadList from './components/LeadList';
import LeadForm from './components/LeadForm';

function App() {
  const [leads, setLeads] = useState([]);
  const [vistaActual, setVistaActual] = useState('LISTADO'); // Vistas: 'LISTADO' o 'FORMULARIO'
  const [leadSeleccionado, setLeadSeleccionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cargando, setCargando] = useState(false);

  // URL de tu API de Java desplegada en Render
  //  const API_URL = 'https://two026-1c-tpg-squad-8-backend.onrender.com/api/leads';
  // URL para despliegue local
    const API_URL = 'http://localhost:8080/api/leads';
//URL para compartir mi localhost
//  const API_URL = 'https://blot-catsup-sector.ngrok-free.dev/api/leads';
  // GET: Consultar los Leads reales a la base de datos de Java
  const fetchLeads = async () => {
    setCargando(true);
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (error) {
      console.error("Error cargando leads:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // POST: Enviar el nuevo Lead usando el formato Map<String, Object> del backend
  const handleSaveLead = async (formData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchLeads(); // Refrescar la lista directo del servidor remoto
        setVistaActual('LISTADO');
        setLeadSeleccionado(null);
      } else {
        alert('Error en el servidor de Java al procesar el Map.');
      }
    } catch (error) {
      console.error("Error de red enviando el formulario:", error);
    }
  };

  // Filtrado reactivo local según el input de búsqueda de tu mockup
  const filteredLeads = leads.filter(lead => 
    lead.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif', background: '#f0f0f0', padding: '20px', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>SQUAD 8 - Gestión de Leads</h1>
      
      {cargando && <p style={{ textAlign: 'center', fontWeight: 'bold' }}>⌛ Sincronizando datos con el backend de Java...</p>}
      
      {vistaActual === 'LISTADO' ? (
        <LeadList 
          leads={filteredLeads} 
          onSelectLead={(lead) => { setLeadSeleccionado(lead); setVistaActual('FORMULARIO'); }} 
          onCreateClick={() => { setLeadSeleccionado(null); setVistaActual('FORMULARIO'); }}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      ) : (
        <LeadForm 
          lead={leadSeleccionado} 
          onSave={handleSaveLead} 
          onCancel={() => { setVistaActual('LISTADO'); setLeadSeleccionado(null); }}
        />
      )}
    </div>
  );
}

export default App;
