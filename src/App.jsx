import React, { useState, useEffect } from 'react';
import './App.css';
import LeadList from './components/LeadList';
import LeadForm from './components/LeadForm';
import OportunidadesList from './components/OportunidadesList';
import OportunidadForm from './components/OportunidadForm';
import ClientList from './components/ClientList';
import ClientForm from './components/ClientForm';
import CampaniaList from './components/CampaniaList';
import CampaniaForm from './components/CampaniaForm';
import CampaniaRanking from './components/CampaniaRanking';
import ClientDetail from './components/ClientDetail';
import CampaniaDetail from './components/CampaniaDetail';

const NAV = [
  { key: 'LEADS',         icon: '👤', label: 'Leads'         },
  { key: 'OPORTUNIDADES', icon: '💼', label: 'Oportunidades'  },
  { key: 'CLIENTES',      icon: '🏢', label: 'Clientes'       },
  { key: 'CAMPANIAS',     icon: '📣', label: 'Campañas'       },
];

const BASE = 'https://two026-1c-tpg-squad-8-backend.onrender.com/api';

function App() {
  const [leads,         setLeads]         = useState([]);
  const [oportunidades, setOportunidades] = useState([]);
  const [clientes,      setClientes]      = useState([]);
  const [campanias,     setCampanias]     = useState([]);
  const [ranking,       setRanking]       = useState([]);

  const [seccion, setSeccion] = useState('LEADS');
  // vista: 'LISTADO' | 'FORMULARIO' | 'RANKING'
  const [vista,   setVista]   = useState('LISTADO');

  const [leadSeleccionado,        setLeadSeleccionado]        = useState(null);
  const [oportunidadSeleccionada, setOportunidadSeleccionada] = useState(null);
  const [clienteSeleccionado,     setClienteSeleccionado]     = useState(null);
  const [campaniaSeleccionada,    setCampaniaSeleccionada]    = useState(null);

  const [searchLeads,       setSearchLeads]       = useState('');
  const [searchOportunidades, setSearchOportunidades] = useState('');
  const [searchClientes,    setSearchClientes]    = useState('');
  const [searchCampanias,   setSearchCampanias]   = useState('');

  const [cargando, setCargando] = useState(false);
  const [error,    setError]    = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAll = async () => {
    setCargando(true);
    setError(null);
    try {
      const [rLeads, rOps, rClients, rCamp] = await Promise.all([
        fetch(`${BASE}/leads`),
        fetch(`${BASE}/oportunidades`),
        fetch(`${BASE}/clientes`),
        fetch(`${BASE}/campanias`),
      ]);
      if (rLeads.ok)   setLeads(await rLeads.json());
      if (rOps.ok)     setOportunidades(await rOps.json());
      if (rClients.ok) setClientes(await rClients.json());
      if (rCamp.ok)    setCampanias(await rCamp.json());
    } catch (e) {
      console.error('Error cargando datos:', e);
      setError('No se pudo conectar con el backend. Puede estar iniciando (Render cold start).');
    } finally {
      setCargando(false);
    }
  };

  const fetchRanking = async () => {
    try {
      const res = await fetch(`${BASE}/campanias/ranking`);
      if (res.ok) setRanking(await res.json());
    } catch (e) { console.error('Error cargando ranking:', e); }
  };

  useEffect(() => { fetchAll(); }, []);

  const navTo = (s) => { setSeccion(s); setVista('LISTADO'); };
  const volverAlListado = () => {
    setVista('LISTADO');
    setLeadSeleccionado(null);
    setOportunidadSeleccionada(null);
    setClienteSeleccionado(null);
    setCampaniaSeleccionada(null);
  };

  // ── Leads ──────────────────────────────────────────────────────────────────
  const handleSaveLead = async (payload) => {
    try {
      const res = await fetch(`${BASE}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) { await fetchAll(); volverAlListado(); }
      else alert(`Error al crear el Lead: ${await res.text()}`);
    } catch (e) { console.error(e); alert('Error de conexión.'); }
  };

  const handleUpdateLead = async (id, datosBase, nuevoEstado) => {
    try {
      const r1 = await fetch(`${BASE}/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosBase),
      });
      if (!r1.ok) { alert(`Error al actualizar: ${await r1.text()}`); return; }
      if (nuevoEstado) {
        const r2 = await fetch(`${BASE}/leads/${id}/estado`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: nuevoEstado }),
        });
        if (!r2.ok) { alert(`Error al actualizar estado: ${await r2.text()}`); return; }
      }
      await fetchAll();
      volverAlListado();
    } catch (e) { console.error(e); alert('Error de conexión.'); }
  };

  // ── Oportunidades ──────────────────────────────────────────────────────────
  const handleCreateOportunidad = async (payload) => {
    try {
      const res = await fetch(`${BASE}/oportunidades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) { await fetchAll(); volverAlListado(); }
      else alert(`Error al crear la Oportunidad: ${await res.text()}`);
    } catch (e) { console.error(e); alert('Error de conexión.'); }
  };

  const handleRegistrarGanada = async (id, payload) => {
    try {
      const res = await fetch(`${BASE}/oportunidades/${id}/ganada`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) { await fetchAll(); volverAlListado(); }
      else alert(`Error al registrar ganada: ${await res.text()}`);
    } catch (e) { console.error(e); alert('Error de conexión.'); }
  };

  const handleRegistrarPerdida = async (id, payload) => {
    try {
      const res = await fetch(`${BASE}/oportunidades/${id}/perdida`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) { await fetchAll(); volverAlListado(); }
      else alert(`Error al registrar perdida: ${await res.text()}`);
    } catch (e) { console.error(e); alert('Error de conexión.'); }
  };

  const handleGenerarOportunidad = (lead) => {
    setOportunidadSeleccionada({ leadAsociadoId: lead.id });
    setSeccion('OPORTUNIDADES');
    setVista('FORMULARIO');
  };

  // ── Clientes ───────────────────────────────────────────────────────────────
  const handleSaveCliente = async (formData) => {
    try {
      const res = await fetch(`${BASE}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) { await fetchAll(); volverAlListado(); }
      else alert(`Error al crear el Cliente: ${await res.text()}`);
    } catch (e) { console.error(e); alert('Error de conexión.'); }
  };

  const handleUpdateCliente = async (payload) => {
    try {
      const res = await fetch(`${BASE}/clientes/${payload.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await fetchAll();
        volverAlListado();
      } else {
        alert(`Error al actualizar el Cliente: ${await res.text()}`);
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión.');
    }
  };

  const handleVerDetalleCliente = async (cliente) => {
    try {
      const res = await fetch(`${BASE}/clientes/${cliente.id}`);
      if (res.ok) {
        const data = await res.json();
        setClienteSeleccionado(data);
        setVista('DETALLE');
      } else {
        alert(`Error al obtener los detalles del cliente: ${await res.text()}`);
      }
    } catch (e) {
      console.error('Error fetching client details:', e);
      // Fallback to local item if network/server has issues
      setClienteSeleccionado(cliente);
      setVista('DETALLE');
    }
  };

  const handleDeleteCliente = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este cliente?')) {
      return;
    }
    try {
      const res = await fetch(`${BASE}/clientes/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchAll();
        volverAlListado();
      } else {
        const errorMsg = await res.text();
        alert(`Error al eliminar el Cliente: ${errorMsg}`);
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión.');
    }
  };

  // ── Campañas ───────────────────────────────────────────────────────────────
  const handleSaveCampania = async (payload) => {
    try {
      const res = await fetch(`${BASE}/campanias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) { await fetchAll(); volverAlListado(); }
      else alert(`Error al crear la Campaña: ${await res.text()}`);
    } catch (e) { console.error(e); alert('Error de conexión.'); }
  };

  const handleVerRanking = async () => {
    await fetchRanking();
    setVista('RANKING');
  };

  const handleVerDetalleCampania = async (campania) => {
    try {
      const res = await fetch(`${BASE}/campanias/${campania.id}`);
      if (res.ok) {
        const data = await res.json();
        setCampaniaSeleccionada(data);
        setVista('DETALLE');
      } else {
        alert(`Error al obtener detalles de campaña: ${await res.text()}`);
      }
    } catch (e) {
      console.error('Error fetching campaign details:', e);
      setCampaniaSeleccionada(campania);
      setVista('DETALLE');
    }
  };

  // ── Filtros ────────────────────────────────────────────────────────────────
  const filteredLeads = leads.filter(l =>
    l.nombre?.toLowerCase().includes(searchLeads.toLowerCase())
  );
  const filteredOps = oportunidades.filter(op =>
    op.prospecto?.nombre?.toLowerCase().includes(searchOportunidades.toLowerCase()) ||
    op.id?.toString().includes(searchOportunidades)
  );
  const filteredClientes = clientes.filter(c =>
    c.razonSocial?.toLowerCase().includes(searchClientes.toLowerCase()) ||
    c.cuit?.toString().includes(searchClientes)
  );
  const filteredCampanias = campanias.filter(c =>
    c.nombre?.toLowerCase().includes(searchCampanias.toLowerCase()) ||
    c.tipo?.toLowerCase().includes(searchCampanias.toLowerCase())
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-logo">
          <div className="topbar-logo-icon">🏦</div>
          <div>
            <div className="topbar-logo-text">PSA · CRM</div>
            <div className="topbar-logo-sub">SQUAD 8</div>
          </div>
        </div>

        <div className="topbar-divider" />

        <nav className="topbar-nav">
          {NAV.map(n => (
            <button
              key={n.key}
              className={`topbar-nav-btn${seccion === n.key ? ' active' : ''}`}
              onClick={() => navTo(n.key)}
            >
              <span className="nav-icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>

        <div className="topbar-right">
          {cargando
            ? <div className="topbar-sync"><div className="spinner" /> Sincronizando...</div>
            : <div className="topbar-sync" style={{ cursor: 'pointer' }} onClick={fetchAll} title="Reintentar">
                <div className="sync-dot" style={{ background: error ? '#f87171' : '#4ade80' }} />
                {error ? 'Sin conexión · Reintentar' : 'Conectado'}
              </div>
          }
        </div>
      </header>

      <main className="main-content">
        {error && vista === 'LISTADO' && (
          <div style={{
            padding: '12px 16px', marginBottom: 20,
            background: 'var(--danger-light)', border: '1px solid #fca5a5',
            borderRadius: 'var(--radius)', color: 'var(--danger)', fontSize: '13px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span>⚠️ {error}</span>
            <button className="btn btn-secondary btn-sm" onClick={fetchAll}>Reintentar</button>
          </div>
        )}

        {/* ── LEADS ── */}
        {seccion === 'LEADS' && vista === 'LISTADO' && (
          <LeadList
            leads={filteredLeads}
            searchTerm={searchLeads}
            onSearchChange={setSearchLeads}
            onSelectLead={(l) => { setLeadSeleccionado(l); setVista('FORMULARIO'); }}
            onCreateClick={() => { setLeadSeleccionado(null); setVista('FORMULARIO'); }}
          />
        )}
        {seccion === 'LEADS' && vista === 'FORMULARIO' && (
          <LeadForm
            lead={leadSeleccionado}
            onSave={handleSaveLead}
            onUpdate={handleUpdateLead}
            onGenerarOportunidad={handleGenerarOportunidad}
            onCancel={volverAlListado}
          />
        )}

        {/* ── OPORTUNIDADES ── */}
        {seccion === 'OPORTUNIDADES' && vista === 'LISTADO' && (
          <OportunidadesList
            oportunidades={filteredOps}
            searchTerm={searchOportunidades}
            onSearchChange={setSearchOportunidades}
            onSelectOportunidad={(op) => { setOportunidadSeleccionada(op); setVista('FORMULARIO'); }}
            onCreateClick={() => { setOportunidadSeleccionada(null); setVista('FORMULARIO'); }}
          />
        )}
        {seccion === 'OPORTUNIDADES' && vista === 'FORMULARIO' && (
          <OportunidadForm
            oportunidad={oportunidadSeleccionada}
            leads={leads}
            clientes={clientes}
            onSave={handleCreateOportunidad}
            onRegistrarGanada={handleRegistrarGanada}
            onRegistrarPerdida={handleRegistrarPerdida}
            onCancel={volverAlListado}
          />
        )}

        {/* ── CLIENTES ── */}
        {seccion === 'CLIENTES' && vista === 'LISTADO' && (
          <ClientList
            clients={filteredClientes}
            searchTerm={searchClientes}
            onSearchChange={setSearchClientes}
            onCreateClick={() => { setClienteSeleccionado(null); setVista('FORMULARIO'); }}
            onSelectClient={handleVerDetalleCliente}
          />
        )}
        {seccion === 'CLIENTES' && vista === 'FORMULARIO' && (
          <ClientForm
            client={clienteSeleccionado}
            onSave={clienteSeleccionado ? handleUpdateCliente : handleSaveCliente}
            onCancel={volverAlListado}
          />
        )}
        {seccion === 'CLIENTES' && vista === 'DETALLE' && clienteSeleccionado && (
          <ClientDetail
            client={clienteSeleccionado}
            opportunities={oportunidades}
            onBackClick={volverAlListado}
            onDeleteClick={handleDeleteCliente}
            onEditClick={(c) => { setClienteSeleccionado(c); setVista('FORMULARIO'); }}
          />
        )}

        {/* ── CAMPAÑAS ── */}
        {seccion === 'CAMPANIAS' && vista === 'LISTADO' && (
          <CampaniaList
            campanias={filteredCampanias}
            searchTerm={searchCampanias}
            onSearchChange={setSearchCampanias}
            onCreateClick={() => setVista('FORMULARIO')}
            onSelectCampania={(val) => {
              if (val === 'ranking') handleVerRanking();
              else handleVerDetalleCampania(val);
            }}
          />
        )}
        {seccion === 'CAMPANIAS' && vista === 'FORMULARIO' && (
          <CampaniaForm
            onSave={handleSaveCampania}
            onCancel={volverAlListado}
          />
        )}
        {seccion === 'CAMPANIAS' && vista === 'DETALLE' && campaniaSeleccionada && (
          <CampaniaDetail
            campania={campaniaSeleccionada}
            leads={leads}
            onBackClick={volverAlListado}
            baseApiUrl={BASE}
          />
        )}
        {seccion === 'CAMPANIAS' && vista === 'RANKING' && (
          <CampaniaRanking
            ranking={ranking}
            onVolver={() => setVista('LISTADO')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
