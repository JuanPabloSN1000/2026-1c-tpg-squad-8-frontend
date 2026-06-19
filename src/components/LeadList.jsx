import React from 'react';

function estadoBadge(estado) {
  if (!estado) return <span className="badge badge-nuevo">—</span>;
  const e = estado.toLowerCase();
  if (e === 'nuevo')      return <span className="badge badge-nuevo">Nuevo</span>;
  if (e === 'contactado') return <span className="badge badge-contactado">Contactado</span>;
  if (e === 'calificado') return <span className="badge badge-calificado">Calificado</span>;
  if (e === 'convertido') return <span className="badge badge-convertido">Convertido</span>;
  return <span className="badge badge-nuevo">{estado}</span>;
}

export default function LeadList({ leads, onSelectLead, onCreateClick, searchTerm, onSearchChange }) {
  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h2>Gestión de Leads</h2>
          <p>Registro y seguimiento de prospectos del pipeline comercial</p>
        </div>
        <button className="btn btn-primary btn-lg" onClick={onCreateClick}>
          + Nuevo Lead
        </button>
      </div>

      <div className="card">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div className="search-input-wrapper" style={{ maxWidth: 380 }}>
            <span className="search-input-icon">🔍</span>
            <input
              className="form-input"
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {leads.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👤</div>
            <p>No se encontraron leads registrados.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Contacto</th>
                <th>Origen</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="clickable" onClick={() => onSelectLead(lead)}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--gray-400)', fontSize: '12px' }}>#{lead.id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{lead.nombre}</td>
                  <td style={{ color: 'var(--gray-500)' }}>{lead.contacto || '—'}</td>
                  <td style={{ color: 'var(--gray-600)' }}>{lead.origen || '—'}</td>
                  <td>{estadoBadge(lead.estado)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {leads.length > 0 && (
          <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', fontSize: '12px', color: 'var(--gray-400)' }}>
            {leads.length} {leads.length === 1 ? 'registro' : 'registros'}
          </div>
        )}
      </div>
    </>
  );
}
