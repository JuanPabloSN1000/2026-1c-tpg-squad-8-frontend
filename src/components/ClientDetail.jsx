import React from 'react';

export default function ClientDetail({ client, opportunities = [], onBackClick, onDeleteClick }) {
  // Filter opportunities for this client
  const clientOps = opportunities.filter(op => op.cliente?.id === client.id);

  const fmtMoney = (v) =>
    v != null ? `$${Number(v).toLocaleString('es-AR')}` : '—';

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div className="page-header-left">
          <button 
            className="btn btn-secondary btn-sm" 
            style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            onClick={onBackClick}
          >
            ← Volver al listado
          </button>
          <h2>Detalle de Cliente</h2>
          <p>Información corporativa y comercial del cliente</p>
        </div>
        <button 
          className="btn btn-danger" 
          style={{ marginBottom: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          onClick={() => onDeleteClick?.(client.id)}
        >
          🗑️ Eliminar Cliente
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Ficha de datos */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--gray-400)', fontFamily: 'monospace' }}>
                CLIENTE #{client.id}
              </span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: 700, color: 'var(--gray-900)' }}>
                {client.razonSocial}
              </h3>
            </div>
            {client.activo !== false ? (
              <span className="badge badge-calificado">Activo</span>
            ) : (
              <span className="badge badge-perdida">Inactivo</span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--gray-400)', fontWeight: 500, textTransform: 'uppercase', marginBottom: '4px' }}>
                CUIT / Identificación Tributaria
              </label>
              <div style={{ fontSize: '15px', color: 'var(--gray-800)', fontWeight: 600, fontFamily: 'monospace' }}>
                {client.cuit || '—'}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--gray-400)', fontWeight: 500, textTransform: 'uppercase', marginBottom: '4px' }}>
                Dirección Física
              </label>
              <div style={{ fontSize: '15px', color: 'var(--gray-800)' }}>
                {client.direccion || '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Historial de Oportunidades asociadas */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: 'var(--gray-800)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💼</span> Negociaciones / Oportunidades
          </h3>

          {clientOps.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--gray-400)', fontSize: '14px', background: 'var(--gray-50)', borderRadius: 'var(--radius)' }}>
              No hay oportunidades registradas para este cliente aún.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {clientOps.map(op => {
                const isGanada = op.etapa?.toLowerCase().includes('ganad');
                const isPerdida = op.etapa?.toLowerCase().includes('perdid');
                let badgeClass = 'badge-negociacion';
                if (isGanada) badgeClass = 'badge-ganada';
                if (isPerdida) badgeClass = 'badge-perdida';

                return (
                  <div 
                    key={op.id}
                    style={{ 
                      padding: '12px 16px', 
                      background: 'var(--gray-50)', 
                      borderRadius: 'var(--radius)', 
                      border: '1px solid var(--border)',
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--gray-800)' }}>
                        {op.prospecto?.nombre || `Oportunidad #${op.id}`}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: 2 }}>
                        Monto Final: <span style={{ fontWeight: 500, fontFamily: 'monospace' }}>{fmtMoney(op.montoFinal)}</span>
                      </div>
                    </div>
                    <span className={`badge ${badgeClass}`}>
                      {op.etapa}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </>
  );
}
