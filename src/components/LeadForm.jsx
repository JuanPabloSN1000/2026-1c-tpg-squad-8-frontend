import React, { useState, useEffect } from 'react';

// Estados exactos según LeadService.java (comparación case-insensitive en el back)
const ESTADOS_LEAD = ['nuevo', 'contactado', 'calificado', 'convertido'];
const ORIGENES_LEAD = ['Campaña', 'Recomendación', 'Contacto Directo', 'Vendedor', 'Ticket'];

export default function LeadForm({ lead, onSave, onUpdate, onCancel, onGenerarOportunidad }) {
  const [formData, setFormData] = useState({
    nombre: '', contacto: '', origen: 'Vendedor', estado: 'nuevo'
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        nombre:     lead.nombre      || '',
        contacto:   lead.contacto    || '',
        origen:     lead.origen      || 'Vendedor',
        estado:     lead.estado      || 'nuevo',
      });
    } else {
      setFormData({ nombre: '', contacto: '', origen: 'Vendedor', estado: 'nuevo' });
    }
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.contacto.trim()) {
      alert('Nombre y contacto son obligatorios.');
      return;
    }

    if (lead?.id) {
      // PUT /api/leads/{id} — actualiza nombre, contacto, origen
      // PUT /api/leads/{id}/estado — si el estado cambió
      onUpdate(lead.id, {
        nombre:   formData.nombre,
        contacto: formData.contacto,
        origen:   formData.origen,
      }, formData.estado !== lead.estado ? formData.estado : null);
    } else {
      // POST /api/leads — id obligatorio (Long)
      const nuevoId = Math.floor(Math.random() * 900000) + 100000;
      onSave({
        id:         nuevoId,
        nombre:     formData.nombre,
        contacto:   formData.contacto,
        origen:     formData.origen,
        estado:     formData.estado,
      });
    }
  };

  const esCalificado = formData.estado === 'calificado';
  const puedeGenerarOportunidad = lead?.id && esCalificado;

  return (
    <div className="form-card">
      <div className="form-card-header">
        <h2>{lead ? `Editar Lead #${lead.id}` : 'Registrar Nuevo Lead'}</h2>
        <p>{lead ? 'Modificá los datos del prospecto' : 'Completá los datos del nuevo prospecto'}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-card-body">

          <div className="form-group">
            <label className="form-label">Nombre *</label>
            <input
              className="form-input"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre del prospecto o empresa"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contacto *</label>
            <input
              className="form-input"
              type="text"
              name="contacto"
              value={formData.contacto}
              onChange={handleChange}
              placeholder="Teléfono o correo electrónico"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Origen</label>
              <select className="form-select" name="origen" value={formData.origen} onChange={handleChange}>
                {ORIGENES_LEAD.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Estado</label>
              <select className="form-select" name="estado" value={formData.estado} onChange={handleChange}>
                {ESTADOS_LEAD.map(e => (
                  <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>



          {lead?.id && !esCalificado && (
            <div style={{
              padding: '10px 14px',
              background: 'var(--warning-light)',
              borderRadius: 'var(--radius)',
              fontSize: '12.5px',
              color: 'var(--warning)',
              border: '1px solid #fde68a'
            }}>
              ⚠️ El lead debe estar en estado <strong>calificado</strong> para generar una oportunidad.
            </div>
          )}

        </div>

        <div className="form-card-footer">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          {lead?.id && (
            <button
              type="button"
              className="btn btn-success"
              disabled={!puedeGenerarOportunidad}
              style={{ opacity: puedeGenerarOportunidad ? 1 : 0.4, cursor: puedeGenerarOportunidad ? 'pointer' : 'not-allowed' }}
              onClick={() => onGenerarOportunidad(lead)}
            >
              💼 Generar Oportunidad
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            {lead ? 'Actualizar Lead' : 'Guardar Lead'}
          </button>
        </div>
      </form>
    </div>
  );
}
