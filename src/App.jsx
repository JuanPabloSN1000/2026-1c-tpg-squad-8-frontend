import React, { useState, useEffect } from 'react';
import LeadList from './components/LeadList';
import LeadForm from './components/LeadForm';
import OportunidadesList from './components/OportunidadesList';
import OportunidadForm from './components/OportunidadForm';

function App() {
  const [leads, setLeads] = useState([]);
  const [oportunidades, setOportunidades] = useState([]);
  
  // Vistas: 'LISTADO_LEADS', 'FORMULARIO_LEAD', 'LISTADO_OPORTUNIDADES', 'FORMULARIO_OPORTUNIDAD'
  const [vistaActual, setVistaActual] = useState('LISTADO_LEADS'); 
  
  const [leadSeleccionado, setLeadSeleccionado] = useState(null);
  const [oportunidadSeleccionada, setOportunidadSeleccionada] = useState(null);
  
  const [searchTermLeads, setSearchTermLeads] = useState('');
  const [searchTermOportunidades, setSearchTermOportunidades] = useState('');
  const [cargando, setCargando] = useState(false);

  // URLs de los Endpoints en Render
  const LEADS_API_URL = 'https://two026-1c-tpg-squad-8-backend.onrender.com/api/leads';
  const OPORTUNIDADES_API_URL = 'https://two026-1c-tpg-squad-8-backend.onrender.com/api/oportunidades';

  // GET: Cargar Leads
  const fetchLeads = async () => {
    setCargando(true);
    try {
      const response = await fetch(LEADS_API_URL);
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

  // GET: Cargar Oportunidades
  const fetchOportunidades = async () => {
    setCargando(true);
    try {
      const response = await fetch(OPORTUNIDADES_API_URL);
      if (response.ok) {
        const data = await response.json();
        setOportunidades(data);
      }
    } catch (error) {
      console.error("Error cargando oportunidades:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchOportunidades();
  }, []);

  // POST: Guardar/Actualizar Lead
  const handleSaveLead = async (formData) => {
    try {
      const response = await fetch(LEADS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        fetchLeads();
        setVistaActual('LISTADO_LEADS');
        setLeadSeleccionado(null);
      } else {
        alert('Error en el servidor al procesar el Lead.');
      }
    } catch (error) {
      console.error("Error enviando lead:", error);
    }
  };

  

// POST / PUT: Guardar o Actualizar Oportunidad de forma inteligente
  const handleSaveOportunidad = async (payload) => {
    // Si el payload viene con "esEdicion", sabemos que hay que ir por PUT
    const esEdicion = payload.esEdicion;
    
    // Limpiamos la bandera temporal para que no viaje al backend
    delete payload.esEdicion;

    const url = esEdicion 
      ? `${OPORTUNIDADES_API_URL}/${payload.id}`
      : OPORTUNIDADES_API_URL;

    const metodo = esEdicion ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        fetchOportunidades();
        setVistaActual('LISTADO_OPORTUNIDADES');
        setOportunidadSeleccionada(null);
      } else {
        alert('Error en el servidor al procesar la Oportunidad (Verificar reglas de negocio o CORS).');
      }
    } catch (error) {
      console.error("Error enviando oportunidad:", error);
    }
  };




  // Acción: Cuando en el formulario de Lead tocan "Generar Oportunidad"
  const handleGenerarOportunidadDesdeLead = (leadData) => {
    // Seteamos la oportunidad inicial cargándole el lead asociado por defecto
    setOportunidadSeleccionada({
      leadAsociadoId: leadData.id,
      descripcion: leadData.descripcion || `Oportunidad originada del lead: ${leadData.nombre}`
    });
    setVistaActual('FORMULARIO_OPORTUNIDAD');
  };

  // Filtrados reactivos locales
  const filteredLeads = leads.filter(lead =>
    lead.nombre?.toLowerCase().includes(searchTermLeads.toLowerCase())
  );

  const filteredOportunidades = oportunidades.filter(op =>
    op.nombre?.toLowerCase().includes(searchTermOportunidades.toLowerCase()) ||
    op.id?.toString().includes(searchTermOportunidades)
  );

  return (
    <div style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif', background: '#f0f0f0', padding: '20px', minHeight: '100vh' }}>
      {/* Barra de Navegación Simple Superior al estilo Mockup */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
        <button 
          onClick={() => setVistaActual('LISTADO_LEADS')}
          style={{ padding: '10px 20px', fontWeight: 'bold', border: '2px solid #333', cursor: 'pointer', background: vistaActual.includes('LEAD') ? '#fff9c4' : '#white' }}
        >
          📁 Gestión de Leads
        </button>
        <button 
          onClick={() => setVistaActual('LISTADO_OPORTUNIDADES')}
          style={{ padding: '10px 20px', fontWeight: 'bold', border: '2px solid #333', cursor: 'pointer', background: vistaActual.includes('OPORTUNIDAD') ? '#fff9c4' : '#white' }}
        >
          💼 Módulo de Oportunidades
        </button>
      </div>

      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>SQUAD 8 - CRM Corporativo</h1>

      {cargando && <p style={{ textAlign: 'center', fontWeight: 'bold' }}>⌛ Sincronizando datos con el backend de Java...</p>}

      {/* Renderizado Condicional de Vistas */}
      {vistaActual === 'LISTADO_LEADS' && (
        <LeadList
          leads={filteredLeads}
          onSelectLead={(lead) => { setLeadSeleccionado(lead); setVistaActual('FORMULARIO_LEAD'); }}
          onCreateClick={() => { setLeadSeleccionado(null); setVistaActual('FORMULARIO_LEAD'); }}
          searchTerm={searchTermLeads}
          onSearchChange={setSearchTermLeads}
        />
      )}

      {vistaActual === 'FORMULARIO_LEAD' && (
        <LeadForm
          lead={leadSeleccionado}
          onSave={handleSaveLead}
          onGenerarOportunidad={handleGenerarOportunidadDesdeLead}
          onCancel={() => { setVistaActual('LISTADO_LEADS'); setLeadSeleccionado(null); }}
        />
      )}

      {vistaActual === 'LISTADO_OPORTUNIDADES' && (
        <OportunidadesList
          oportunidades={filteredOportunidades}
          onSelectOportunidad={(op) => { setOportunidadSeleccionada(op); setVistaActual('FORMULARIO_OPORTUNIDAD'); }}
          onCreateClick={() => { setOportunidadSeleccionada(null); setVistaActual('FORMULARIO_OPORTUNIDAD'); }}
          searchTerm={searchTermOportunidades}
          onSearchChange={setSearchTermOportunidades}
        />
      )}

      {vistaActual === 'FORMULARIO_OPORTUNIDAD' && (
        <OportunidadForm
          oportunidad={oportunidadSeleccionada}
          leads={leads} // Se los pasamos para armar el select de "Lead Asociado"
          onSave={handleSaveOportunidad}
          onCancel={() => { setVistaActual('LISTADO_OPORTUNIDADES'); setOportunidadSeleccionada(null); }}
        />
      )}
    </div>
  );
}

export default App;
