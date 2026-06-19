import React from 'react';

const ESTADO_COLORS = {
  activa:     'badge-calificado',
  pausada:    'badge-contactado',
  finalizada: 'badge-perdida',
  planificada:'badge-oportunidad',
};

function estadoBadge(estado) {
  if (!estado) return <span className="badge badge-nuevo">—</span>;
  const cls = ESTADO_COLORS[estado.toLowerCase()] || 'badge-nuevo';
  return <span className={`badge ${cls}`}>{estado.charAt(0).toUpperCase() + estado.slice(1)}</span>;
}

export default function CampaniaList({ campanias, onCreateClick, onSelectCampania, searchTerm, onSearchChange }) {
  const fmt = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h2>Gestión de Campañas</h2>
          <p>Registro y seguimiento de campañas de marketing y su ROI</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-lg" onClick={() => onSelectCampania('ranking')}>
            📊 Ver Ranking ROI
          </button>
          <button className="btn btn-primary btn-lg" onClick={onCreateClick}>
            + Nueva Campaña
          </button>
        </div>
      </div>

      <div className="card">
        {/* Search */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div className="search-input-wrapper" style={{ maxWidth: 380 }}>
            <span className="search-input-icon">🔍</span>
            <input
              className="form-input"
              type="text"
              placeholder="Buscar por nombre o tipo..."
              value={searchTerm || ''}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {campanias.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📣</div>
            <p>No se encontraron campañas registradas.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Costo</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {campanias.map((c) => (
                <tr key={c.id} className="clickable" onClick={() => onSelectCampania(c)}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--gray-400)', fontSize: '12px' }}>#{c.id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{c.nombre}</td>
                  <td style={{ color: 'var(--gray-600)' }}>{c.tipo || '—'}</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--gray-700)' }}>
                    {c.costo != null ? `$${Number(c.costo).toLocaleString('es-AR')}` : '—'}
                  </td>
                  <td style={{ color: 'var(--gray-500)', fontSize: '13px' }}>{fmt(c.fechaInicio)}</td>
                  <td style={{ color: 'var(--gray-500)', fontSize: '13px' }}>{fmt(c.fechaFin)}</td>
                  <td>{estadoBadge(c.estado)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {campanias.length > 0 && (
          <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', fontSize: '12px', color: 'var(--gray-400)' }}>
            {campanias.length} {campanias.length === 1 ? 'campaña' : 'campañas'}
          </div>
        )}
      </div>
    </>
  );
}
