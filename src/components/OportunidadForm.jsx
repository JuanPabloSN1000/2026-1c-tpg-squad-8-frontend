import React, { useState, useEffect } from 'react';

function OportunidadForm({ oportunidad, leads, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    leadId: '',
    estado: 'En negociación',
    montoEstimado: '',
    descripcion: ''
  });

  // 1. Efecto adaptado al modelo real de la base de datos de Java
  useEffect(() => {
    if (oportunidad) {
      setFormData({
        // Tu backend anida el Lead dentro de 'prospecto'. Sacamos el ID de ahí.
        leadId: oportunidad.prospecto?.id || oportunidad.leadAsociadoId || '',
        estado: oportunidad.etapa || 'En negociación',
        montoEstimado: oportunidad.montoFinal || '',
        descripcion: oportunidad.observaciones || oportunidad.descripcion || ''
      });
    }
  }, [oportunidad]);

  // 2. Efecto para autocompletar si cambia el Lead seleccionado
  useEffect(() => {
    if (formData.leadId) {
      const leadAsociado = leads.find(l => l.id.toString() === formData.leadId.toString());
      if (leadAsociado) {
        setFormData(prev => ({
          ...prev,
          // Si no hay observaciones previas de la oportunidad, usamos el origen del lead
          descripcion: prev.descripcion || (leadAsociado.descripcion ? `Origen Lead: ${leadAsociado.descripcion}` : '')
        }));
      }
    }
  }, [formData.leadId, leads]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.leadId) {
      alert('Por favor, seleccione un Lead Asociado obligatorio.');
      return;
    }

    const esEdicion = !!(oportunidad && oportunidad.id && !oportunidad.leadAsociadoId);

    let payload = {};

    if (esEdicion) {
      // Payload para el @PutMapping matching con ActualizarOportunidadRequest del Backend
      payload = {
        id: oportunidad.id,
        esEdicion: true,
        montoEstimado: parseFloat(formData.montoEstimado) || 0,
        observaciones: formData.descripcion,
        etapa: formData.estado
      };
    } else {
      // Payload para el @PostMapping matching con ConversionRequest del Backend
      payload = {
        esEdicion: false,
        leadId: parseInt(formData.leadId),
        oportunidadId: Math.floor(Math.random() * 10000)
      };
    }

    onSave(payload);
  };

  return (
    <div style={{ maxWidth: '700px', margin: 'auto', background: 'white', border: '3px solid #333', padding: '30px', borderRadius: '15px 5px 20px 5px', boxShadow: '8px 8px 0px #222' }}>
      <h2 style={{ textDecoration: 'underline', marginTop: 0 }}>
        {oportunidad?.id ? `Editar Oportunidad #${oportunidad.id}` : 'Crear Nueva Oportunidad'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Nombre de la Oportunidad */}
          <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
            <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Nombre del Proyecto / Requerimiento:</label>
            <input 
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Implementación ERP Cloud"
              style={{ border: '2px solid #333', padding: '8px', borderRadius: '4px', fontFamily: 'inherit' }}
            />
          </div>

          {/* Selector de Lead Asociado */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Lead Asociado:</label>
            <select 
              name="leadId"
              value={formData.leadId}
              onChange={handleChange}
              style={{ border: '2px solid #333', padding: '8px', borderRadius: '4px', fontFamily: 'inherit' }}
            >
              <option value="">-- Seleccionar un Lead --</option>
              {leads.map(lead => (
                <option key={lead.id} value={lead.id}>
                  {lead.nombre} (#{lead.id})
                </option>
              ))}
            </select>
          </div>

          {/* Selector de Estado */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Estado Comercial:</label>
            <select 
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              style={{ border: '2px solid #333', padding: '8px', borderRadius: '4px', fontFamily: 'inherit' }}
            >
              <option value="En negociación">En negociación</option>
              <option value="Propuesta enviada">Propuesta enviada</option>
              <option value="Ganada">Ganada</option>
              <option value="Perdida">Perdida</option>
            </select>
          </div>

          {/* NUEVO: Monto Estimado */}
          <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
            <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Monto Estimado ($):</label>
            <input 
              type="number"
              name="montoEstimado"
              value={formData.montoEstimado}
              onChange={handleChange}
              placeholder="Ej: 150000"
              style={{ border: '2px solid #333', padding: '8px', borderRadius: '4px', fontFamily: 'inherit' }}
            />
          </div>

          {/* Descripción */}
          <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
            <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Descripción (Opcional - Trae datos del Lead):</label>
            <textarea 
              name="descripcion"
              rows="3"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Aquí aparecerá la descripción previa del lead..."
              style={{ border: '2px solid #333', padding: '8px', borderRadius: '4px', fontFamily: 'inherit' }}
            />
          </div>

          {/* Checkbox es cliente */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', gridColumn: 'span 2' }}>
            <input 
              type="checkbox"
              name="esCliente"
              id="esCliente"
              checked={formData.esCliente}
              onChange={handleChange}
            />
            <label htmlFor="esCliente" style={{ fontWeight: 'bold', cursor: 'pointer' }}>¿Es cliente actualmente?</label>
          </div>

          {/* Datos de contacto (Automáticos por Lead o editables manuales) */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Nombre de Contacto:</label>
            <input 
              type="text"
              name="contactoNombre"
              value={formData.contactoNombre}
              onChange={handleChange}
              style={{ border: '2px solid #333', padding: '8px', borderRadius: '4px', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Dato de Contacto (Tel/Email):</label>
            <input 
              type="text"
              name="contactoDato"
              value={formData.contactoDato}
              onChange={handleChange}
              style={{ border: '2px solid #333', padding: '8px', borderRadius: '4px', fontFamily: 'inherit' }}
            />
          </div>

        </div>

        {/* Botonera */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button 
            type="button"
            onClick={onCancel}
            style={{ border: '2px solid #333', padding: '10px 20px', background: 'white', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ❌ Cancelar
          </button>
          <button 
            type="submit"
            style={{ border: '2px solid #333', padding: '10px 20px', background: '#d4f7d4', cursor: 'pointer', fontWeight: 'bold' }}
          >
            💾 Guardar Oportunidad
          </button>
        </div>
      </form>
    </div>
  );
}

export default OportunidadForm;
