import React from 'react';

// CampaniaROI: { campania: { id, nombre, costo, tipo, estado, ... }, roi: BigDecimal }
// ROI = costo / sumaContratos  →  menor ROI = mejor retorno relativo al costo
export default function CampaniaRanking({ ranking, onVolver }) {
  const fmtMoney = (v) =>
    v != null ? `$${Number(v).toLocaleString('es-AR', { minimumFractionDigits: 2 })}` : '—';

  const fmtROI = (v) => {
    const n = Number(v);
    if (n === 0) return <span style={{ color: 'var(--gray-400)' }}>Sin ventas</span>;
    const pct = (n * 100).toFixed(1);
    return (
      <span style={{ fontWeight: 600, color: n < 0.5 ? 'var(--success)' : n < 1 ? 'var(--warning)' : 'var(--danger)' }}>
        {pct}%
      </span>
    );
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h2>Ranking de ROI por Campaña</h2>
          <p>Relación costo/beneficio de cada campaña — menor ROI indica mejor retorno relativo al costo invertido</p>
        </div>
        <button className="btn btn-secondary btn-lg" onClick={onVolver}>
          ← Volver a Campañas
        </button>
      </div>

      {/* Leyenda */}
      <div style={{
        display: 'flex', gap: 16, marginBottom: 20,
        padding: '12px 16px', background: 'var(--surface)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        fontSize: '12.5px', color: 'var(--gray-600)'
      }}>
        <span>Fórmula: <strong>ROI = Costo / Beneficios totales</strong></span>
        <span style={{ color: 'var(--success)' }}>● &lt;50% — Excelente</span>
        <span style={{ color: 'var(--warning)' }}>● 50–100% — Regular</span>
        <span style={{ color: 'var(--danger)' }}>● &gt;100% — Deficitaria</span>
      </div>

      <div className="card">
        {ranking.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <p>No hay campañas para calcular el ranking.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Campaña</th>
                <th>Tipo</th>
                <th>Costo invertido</th>
                <th>ROI (costo/beneficios)</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((item, idx) => (
                <tr key={item.campania.id}>
                  <td>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 28, height: 28, borderRadius: '50%', fontSize: '12px', fontWeight: 700,
                      background: idx === 0 ? '#fef3c7' : idx === 1 ? '#f1f5f9' : 'var(--gray-100)',
                      color: idx === 0 ? '#92400e' : 'var(--gray-600)',
                    }}>
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{item.campania.nombre}</td>
                  <td style={{ color: 'var(--gray-500)' }}>{item.campania.tipo || '—'}</td>
                  <td style={{ fontFamily: 'monospace' }}>{fmtMoney(item.campania.costo)}</td>
                  <td>{fmtROI(item.roi)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
