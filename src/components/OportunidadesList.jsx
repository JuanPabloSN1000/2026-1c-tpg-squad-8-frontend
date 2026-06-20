import React from 'react';

function etapaBadge(etapa) {
  if (!etapa) return <span className="badge badge-negociacion">—</span>;
  const e = etapa.toLowerCase();
  if (e.includes('negoci'))  return <span className="badge badge-negociacion">Negociación</span>;
  if (e.includes('ganada') || e.includes('ganado'))   return <span className="badge badge-ganada">Ganada</span>;
  if (e.includes('perdida') || e.includes('perdido')) return <span className="badge badge-perdida">Perdida</span>;
  return <span className="badge badge-negociacion">{etapa}</span>;
}

export default function OportunidadesList({ oportunidades, onSelectOportunidad, onCreateClick, searchTerm, onSearchChange }) {
  const fmtMoney = (v) =>
    v != null ? `$${Number(v).toLocaleString('es-AR')}` : '—';

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h2>Pipeline de Oportunidades</h2>
          <p>Seguimiento de negociaciones comerciales activas y cerradas</p>
        </div>
        <button className="btn btn-primary btn-lg" onClick={onCreateClick}>
          + Nueva Oportunidad
        </button>
      </div>

      <div className="card">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div className="search-input-wrapper" style={{ maxWidth: 380 }}>
            <span className="search-input-icon">🔍</span>
            <input
              className="form-input"
              type="text"
              placeholder="Buscar por ID o prospecto..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {oportunidades.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💼</div>
            <p>No se encontraron oportunidades registradas.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Prospecto</th>
                <th>Cliente</th>
                <th>Monto final</th>
                <th>Etapa</th>
              </tr>
            </thead>
            <tbody>
              {oportunidades.map((op) => (
                <tr key={op.id} className="clickable" onClick={() => onSelectOportunidad(op)}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--gray-400)', fontSize: '12px' }}>#{op.id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--gray-900)' }}>
                    {op.prospecto?.nombre || `Oportunidad #${op.id}`}
                    {op.prospecto?.id && (
                      <span style={{ fontWeight: 400, color: 'var(--gray-400)', fontSize: '11.5px', marginLeft: 6 }}>
                        Lead #{op.prospecto.id}
                      </span>
                    )}
                  </td>
                  <td style={{ color: 'var(--gray-600)', fontSize: '13px' }}>
                    {op.cliente?.razonSocial || '—'}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 500, color: 'var(--gray-700)' }}>
                    {fmtMoney(op.montoFinal)}
                  </td>
                  <td>{etapaBadge(op.etapa)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {oportunidades.length > 0 && (
          <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', fontSize: '12px', color: 'var(--gray-400)' }}>
            {oportunidades.length} {oportunidades.length === 1 ? 'oportunidad' : 'oportunidades'}
          </div>
        )}
      </div>
    </>
  );
}
