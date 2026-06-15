import React from 'react';

export default function LeadList({ leads, onSelectLead, onCreateClick, searchTerm, onSearchChange }) {
  return (
    <div className="wireframe-container" style={{ width: '900px', margin: 'auto', padding: '20px', background: 'white', border: '3px solid #333', borderRadius: '15px 5px' }}>
      <header style={{ borderBottom: '2px solid #333', display: 'flex', paddingBottom: '10px', marginBottom: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Vendedor: <strong>Juan Pablo</strong> (Sesión Activa)</span>
        <button style={{ border: '2px solid #333', padding: '10px', background: '#fff', cursor: 'pointer', borderRadius: '5px 10px', fontWeight: 'bold' }} onClick={onCreateClick}>+ Crear Nuevo Lead</button>
      </header>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Buscar lead por nombre o código..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ flexGrow: 1, border: '2px solid #333', padding: '10px', borderRadius: '5px', fontFamily: 'inherit' }}
        />
        <button style={{ border: '2px solid #333', padding: '10px 20px', background: '#fff', fontWeight: 'bold', cursor: 'pointer', borderRadius: '5px', fontFamily: 'inherit' }}>🔍 Buscar</button>
      </div>   

      <h2>Listado de Leads</h2>
      
      {leads.length === 0 ? (
        <p>No se encontraron leads cargados en el servidor.</p>
      ) : (
        leads.map((lead) => (
          <div 
            key={lead.id} 
            onClick={() => onSelectLead(lead)}
            style={{ border: '2px solid #333', marginBottom: '10px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#fff' }}
          >
            <div style={{ display: 'flex', gap: '20px' }}>
              <span>ID: {lead.id}</span>
              <span><strong>Nombre:</strong> {lead.nombre}</span>
              <span><strong>Estado:</strong> {lead.estado}</span>
              <span><strong>Origen:</strong> {lead.origen}</span>
            </div>
            <div style={{ fontSize: '24px', border: '1px solid #333', padding: '5px' }}>📝</div>
          </div>
        ))
      )}
    </div>
  );
}
