import React, { useState } from 'react';

const TIPOS = ['Lanzamiento', 'Mantenimiento de marca', 'Capacitación', 'Promoción', 'Otro'];
const ESTADOS = ['activa', 'planificada', 'pausada', 'finalizada'];

export default function CampaniaForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nombre:      '',
    costo:       '',
    tipo:        'Lanzamiento',
    descripcion: '',
    estado:      'activa',
    fechaInicio: '',
    fechaFin:    '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) { setError('El nombre de la campaña es obligatorio.'); return; }
    if (formData.costo && Number(formData.costo) < 0) { setError('El costo no puede ser negativo.'); return; }
    if (!formData.fechaInicio) { setError('La fecha de inicio es obligatoria.'); return; }
    if (formData.fechaFin && formData.fechaFin < formData.fechaInicio) {
      setError('La fecha de fin no puede ser anterior a la fecha de inicio.'); return;
    }

    // El backend espera LocalDateTime → "2026-01-01T00:00:00"
    const toISO = (d) => d ? `${d}T00:00:00` : null;

    onSave({
      id:          Date.now(),
      nombre:      formData.nombre.trim(),
      costo:       formData.costo ? Number(formData.costo) : null,
      tipo:        formData.tipo,
      descripcion: formData.descripcion.trim() || null,
      estado:      formData.estado,
      fechaInicio: toISO(formData.fechaInicio),
      fechaFin:    toISO(formData.fechaFin),
    });
  };

  return (
    <div className="form-card">
      <div className="form-card-header">
        <h2>Registrar Nueva Campaña</h2>
        <p>Completá los datos de la campaña de marketing</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-card-body">

          {error && (
            <div style={{
              padding: '10px 14px', background: 'var(--danger-light)',
              borderRadius: 'var(--radius)', fontSize: '13px', color: 'var(--danger)',
              border: '1px solid #fca5a5'
            }}>
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Nombre *</label>
            <input
              className="form-input"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Campaña de Lanzamiento Q1 2026"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Tipo</label>
              <select className="form-select" name="tipo" value={formData.tipo} onChange={handleChange}>
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Estado</label>
              <select className="form-select" name="estado" value={formData.estado} onChange={handleChange}>
                {ESTADOS.map(e => (
                  <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Costo ($)</label>
            <input
              className="form-input"
              type="number"
              name="costo"
              value={formData.costo}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Fecha de Inicio *</label>
              <input
                className="form-input"
                type="date"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Fecha de Fin</label>
              <input
                className="form-input"
                type="date"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción (opcional)</label>
            <textarea
              className="form-textarea"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Objetivo, canales utilizados, audiencia objetivo..."
              rows={3}
            />
          </div>

        </div>

        <div className="form-card-footer">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="btn btn-primary">Guardar Campaña</button>
        </div>
      </form>
    </div>
  );
}
