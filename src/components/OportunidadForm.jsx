import React, { useState, useEffect } from 'react';

// Etapas reales según OportunidadService.java
// El backend setea etapa = "negociación" al crear
// Solo permite /ganada y /perdida como transiciones

function etapaBadge(etapa) {
  if (!etapa) return <span className="badge badge-negociacion">—</span>;
  const e = etapa.toLowerCase();
  if (e.includes('negoci'))  return <span className="badge badge-negociacion">Negociación</span>;
  if (e.includes('ganada') || e.includes('ganado')) return <span className="badge badge-ganada">Ganada</span>;
  if (e.includes('perdida') || e.includes('perdido')) return <span className="badge badge-perdida">Perdida</span>;
  return <span className="badge badge-negociacion">{etapa}</span>;
}

// Modo CREATE: POST /api/oportunidades → { leadId, oportunidadId }
// Modo GANADA: PUT /api/oportunidades/{id}/ganada → { montoFinal, observaciones, clienteId }
// Modo PERDIDA: PUT /api/oportunidades/{id}/perdida → { observaciones }
export default function OportunidadForm({ oportunidad, leads, clientes, onSave, onRegistrarGanada, onRegistrarPerdida, onCancel }) {
  const esEdicion = !!(oportunidad?.id && !oportunidad.leadAsociadoId);
  const etapa = oportunidad?.etapa?.toLowerCase() || '';
  const enNegociacion = etapa.includes('negoci') || etapa === '';

  // Estado para creación
  const [leadId, setLeadId] = useState('');

  // Estado para registrar ganada
  const [montoFinal, setMontoFinal] = useState('');
  const [obsGanada, setObsGanada] = useState('');
  const [clienteId, setClienteId] = useState('');

  // Estado para registrar perdida
  const [obsPerdida, setObsPerdida] = useState('');

  // Tab activo en modo edición
  const [tab, setTab] = useState('ganada'); // 'ganada' | 'perdida'

  useEffect(() => {
    if (oportunidad?.leadAsociadoId) {
      setLeadId(oportunidad.leadAsociadoId.toString());
    }
    if (oportunidad?.observaciones) {
      setObsGanada(oportunidad.observaciones);
      setObsPerdida(oportunidad.observaciones);
    }
    if (oportunidad?.montoFinal) {
      setMontoFinal(oportunidad.montoFinal.toString());
    }
  }, [oportunidad]);

  // ── Creación ──
  const handleCreate = (e) => {
    e.preventDefault();
    if (!leadId) { alert('Seleccioná un lead asociado.'); return; }
    onSave({
      leadId:       parseInt(leadId),
      oportunidadId: Math.floor(Math.random() * 900000) + 100000,
    });
  };

  // ── Ganada ──
  const handleGanada = (e) => {
    e.preventDefault();
    if (!montoFinal) { alert('El monto final es obligatorio.'); return; }
    if (!clienteId) { alert('Seleccioná el cliente asociado.'); return; }
    onRegistrarGanada(oportunidad.id, {
      montoFinal:   parseFloat(montoFinal),
      observaciones: obsGanada,
      clienteId:    parseInt(clienteId),
    });
  };

  // ── Perdida ──
  const handlePerdida = (e) => {
    e.preventDefault();
    if (!obsPerdida.trim()) { alert('Las observaciones son obligatorias para registrar una pérdida.'); return; }
    onRegistrarPerdida(oportunidad.id, { observaciones: obsPerdida });
  };

  // ── Render creación ──
  if (!esEdicion) {
    const leadsCalificados = leads.filter(l => l.estado?.toLowerCase() === 'calificado');
    return (
      <div className="form-card">
        <div className="form-card-header">
          <h2>Crear Nueva Oportunidad</h2>
          <p>Convertí un lead calificado en oportunidad comercial</p>
        </div>
        <form onSubmit={handleCreate}>
          <div className="form-card-body">
            <div className="form-group">
              <label className="form-label">Lead Asociado * <span style={{ color: 'var(--gray-400)', fontWeight: 400, textTransform: 'none' }}>(solo calificados)</span></label>
              <select className="form-select" value={leadId} onChange={e => setLeadId(e.target.value)}>
                <option value="">— Seleccioná un lead —</option>
                {leadsCalificados.map(l => (
                  <option key={l.id} value={l.id}>{l.nombre} (#{l.id})</option>
                ))}
              </select>
              {leadsCalificados.length === 0 && (
                <span style={{ fontSize: '12px', color: 'var(--danger)', marginTop: 4 }}>
                  No hay leads en estado <strong>calificado</strong> disponibles.
                </span>
              )}
            </div>
          </div>
          <div className="form-card-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={!leadId}>Crear Oportunidad</button>
          </div>
        </form>
      </div>
    );
  }

  // ── Render edición: ganada / perdida ──
  return (
    <div className="form-card" style={{ maxWidth: 700 }}>
      <div className="form-card-header">
        <h2>Oportunidad #{oportunidad.id}</h2>
        <p>
          Lead: <strong>{oportunidad.prospecto?.nombre || `#${oportunidad.prospecto?.id}`}</strong>
          &nbsp;·&nbsp; Etapa actual: {etapaBadge(oportunidad.etapa)}
        </p>
      </div>

      {!enNegociacion ? (
        <div style={{ padding: '32px', textAlign: 'center', color: 'var(--gray-500)' }}>
          Esta oportunidad ya fue <strong>{oportunidad.etapa}</strong> y no puede modificarse.
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
            {['ganada', 'perdida'].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                style={{
                  padding: '11px 24px',
                  fontFamily: 'var(--font)',
                  fontSize: '13px',
                  fontWeight: tab === t ? 600 : 400,
                  border: 'none',
                  borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
                  background: 'none',
                  cursor: 'pointer',
                  color: tab === t ? 'var(--accent)' : 'var(--gray-500)',
                  marginBottom: '-1px',
                }}
              >
                {t === 'ganada' ? '✅ Registrar como Ganada' : '❌ Registrar como Perdida'}
              </button>
            ))}
          </div>

          {tab === 'ganada' && (
            <form onSubmit={handleGanada}>
              <div className="form-card-body">
                <div className="form-group">
                  <label className="form-label">Cliente *</label>
                  <select className="form-select" value={clienteId} onChange={e => setClienteId(e.target.value)}>
                    <option value="">— Seleccioná el cliente —</option>
                    {clientes.map(c => (
                      <option key={c.id} value={c.id}>{c.razonSocial} (#{c.id})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Monto Final ($) *</label>
                  <input className="form-input" type="number" value={montoFinal} onChange={e => setMontoFinal(e.target.value)} placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label className="form-label">Observaciones</label>
                  <textarea className="form-textarea" value={obsGanada} onChange={e => setObsGanada(e.target.value)} placeholder="Detalles del cierre..." rows={3} />
                </div>
              </div>
              <div className="form-card-footer">
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
                <button type="submit" className="btn btn-success">✅ Confirmar Ganada</button>
              </div>
            </form>
          )}

          {tab === 'perdida' && (
            <form onSubmit={handlePerdida}>
              <div className="form-card-body">
                <div className="form-group">
                  <label className="form-label">Motivo de pérdida *</label>
                  <textarea className="form-textarea" value={obsPerdida} onChange={e => setObsPerdida(e.target.value)} placeholder="Explicá el motivo por el cual se perdió la oportunidad..." rows={4} />
                </div>
              </div>
              <div className="form-card-footer">
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
                <button type="submit" className="btn btn-danger">❌ Confirmar Pérdida</button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}

export { etapaBadge };
