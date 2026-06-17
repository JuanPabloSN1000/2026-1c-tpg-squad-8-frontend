import React, { useState, useEffect } from 'react';

export default function OpportunityForm({ opportunity, leads, clients, onSave, onCancel, onGenerateClient }) {
  const [formData, setFormData] = useState({
    nombre: '',
    leadId: '',
    montoEstimado: '',
    origen: 'Campaña',
    estado: 'Inicial',
    descripcion: '',
    esCliente: false,
    clienteId: '',
    nombreContacto: '',
    datoContacto: ''
  });

  useEffect(() => {
    if (opportunity) {
      setFormData({
        id: opportunity.id,
        nombre: opportunity.nombre || '',
        leadId: opportunity.leadId || '',
        montoEstimado: opportunity.montoEstimado || '',
        origen: opportunity.origen || 'Campaña',
        estado: opportunity.estado || 'Inicial',
        descripcion: opportunity.descripcion || '',
        esCliente: opportunity.esCliente || false,
        clienteId: opportunity.clienteId || '',
        nombreContacto: opportunity.nombreContacto || '',
        datoContacto: opportunity.datoContacto || ''
      });
    } else {
      // Resetear para una nueva oportunidad
      setFormData({
        nombre: '',
        leadId: '',
        montoEstimado: '',
        origen: 'Campaña',
        estado: 'Inicial',
        descripcion: '',
        esCliente: false,
        clienteId: '',
        nombreContacto: '',
        datoContacto: ''
      });
    }
  }, [opportunity]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre) {
      alert('Por favor, completa el nombre de la oportunidad.');
      return;
    }
    onSave(formData);
  };

  const styles = {
    wireframeContainer: {
      maxWidth: '700px',
      margin: 'auto',
      background: 'white',
      border: '3px solid #333',
      padding: '30px',
      borderRadius: '15px 5px 20px 5px',
      boxShadow: '8px 8px 0px #222',
      fontFamily: '"Comic Sans MS", cursive, sans-serif',
    },
    h2: { textDecoration: 'underline', marginTop: 0 },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
    },
    formGroup: { display: 'flex', flexDirection: 'column', marginBottom: '15px' },
    fullWidth: { gridColumn: 'span 2' },
    label: { fontWeight: 'bold', marginBottom: '5px', display: 'block' },
    input: {
      border: '2px solid #333',
      padding: '10px',
      borderRadius: '6px 4px',
      fontFamily: 'inherit',
      background: '#fff',
      width: '100%',
      boxSizing: 'border-box',
    },
    inputDisabled: { background: '#eee', cursor: 'not-allowed' },
    checkboxGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      border: '2px dashed #999',
      padding: '10px',
    },
    actions: {
      marginTop: '30px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '15px',
      borderTop: '2px solid #333',
      paddingTop: '20px',
    },
    btn: {
      border: '2px solid #333',
      padding: '12px 20px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontFamily: 'inherit',
      borderRadius: '5px',
    },
    btnSave: { background: '#ccffcc' },
    btnClient: { background: '#cce5ff' },
    btnCancel: { background: '#ffcccc' },
  };

  return (
    <div style={styles.wireframeContainer}>
      <h2 style={styles.h2}>{opportunity ? 'Editar Oportunidad' : 'Nueva Oportunidad'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>ID Oportunidad:</label>
            <input type="text" value={opportunity ? opportunity.id : 'OP-2026-AUTOGEN'} disabled style={{...styles.input, ...styles.inputDisabled}} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Nombre de la Oportunidad:</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Venta de Servidores" style={styles.input} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Lead Asociado:</label>
            <select name="leadId" value={formData.leadId} onChange={handleChange} style={styles.input}>
              <option value="">Seleccionar lead...</option>
              {leads && leads.map(lead => (
                <option key={lead.id} value={lead.id}>{lead.nombre} (ID: {lead.id})</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Monto Estimado ($):</label>
            <input type="number" name="montoEstimado" value={formData.montoEstimado} onChange={handleChange} placeholder="0.00" style={styles.input} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Origen:</label>
            <select name="origen" value={formData.origen} onChange={handleChange} style={styles.input}>
              <option>Campaña</option>
              <option>Recomendación</option>
              <option>Contacto Directo</option>
              <option>Vendedor</option>
              <option>Ticket</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Estado:</label>
            <select name="estado" value={formData.estado} onChange={handleChange} style={styles.input}>
              <option>Inicial</option>
              <option>En negociación</option>
              <option>Propuesta enviada</option>
              <option>Ganada</option>
              <option>Perdida</option>
            </select>
          </div>

          <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
            <label style={styles.label}>Descripción (Opcional):</label>
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="3" placeholder="Aquí aparecerá la descripción previa del lead..." style={styles.input}></textarea>
          </div>

          <div style={{ ...styles.formGroup, ...styles.checkboxGroup }}>
            <label style={styles.label}>¿Es cliente actualmente?</label>
            <input type="checkbox" name="esCliente" checked={formData.esCliente} onChange={handleChange} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Cliente Asociado (Si aplica):</label>
            <select name="clienteId" value={formData.clienteId} onChange={handleChange} style={styles.input} disabled={!formData.esCliente}>
              <option value="">Buscar cliente existente...</option>
              {clients && clients.map(client => (
                <option key={client.id} value={client.id}>{client.razonSocial}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Nombre de Contacto:</label>
            <input type="text" name="nombreContacto" value={formData.nombreContacto} onChange={handleChange} style={styles.input} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Dato de Contacto (Tel/Email):</label>
            <input type="text" name="datoContacto" value={formData.datoContacto} onChange={handleChange} style={styles.input} />
          </div>
        </div>

        <div style={styles.actions}>
          <button type="submit" style={{ ...styles.btn, ...styles.btnSave }}>💾 Guardar Oportunidad</button>
          {onGenerateClient && <button type="button" onClick={onGenerateClient} style={{ ...styles.btn, ...styles.btnClient }}>👤 Generar Cliente</button>}
          <button type="button" onClick={onCancel} style={{ ...styles.btn, ...styles.btnCancel }}>❌ Cancelar</button>
        </div>
      </form>
    </div>
  );
}