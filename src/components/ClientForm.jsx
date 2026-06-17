import React, { useState, useEffect } from 'react';

export default function ClientForm({ client, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    razonSocial: '',
    cuit: '',
    direccion: '',
    telefono: '',
    email: '',
    nombreFantasia: ''
  });

  useEffect(() => {
    if (client) {
      setFormData({
        id: client.id,
        razonSocial: client.razonSocial || '',
        cuit: client.cuit || '',
        direccion: client.direccion || '',
        telefono: client.telefono || '',
        email: client.email || '',
        nombreFantasia: client.nombreFantasia || ''
      });
    } else {
        // Resetea el formulario para un nuevo cliente
        setFormData({
            razonSocial: '',
            cuit: '',
            direccion: '',
            telefono: '',
            email: '',
            nombreFantasia: ''
        });
    }
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.razonSocial || !formData.cuit) {
      alert('Por favor, completa la Razón Social y el CUIT.');
      return;
    }
    onSave(formData);
  };

  const styles = {
    wireframeContainer: {
      maxWidth: '600px',
      margin: 'auto',
      background: 'white',
      border: '3px solid #222',
      padding: '30px',
      borderRadius: '20px 10px 15px 5px',
      boxShadow: '7px 7px 0px #333',
    },
    header: {
      borderBottom: '2px dashed #222',
      paddingBottom: '10px',
      marginBottom: '25px',
      display: 'flex',
      justifyContent: 'space-between',
    },
    formGroup: {
      marginBottom: '15px',
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    input: {
      border: '2px solid #222',
      padding: '10px',
      borderRadius: '5px',
      fontFamily: 'inherit',
    },
    inputDisabled: {
      background: '#eee',
      borderStyle: 'dotted',
    },
    actions: {
      marginTop: '30px',
      display: 'flex',
      gap: '15px',
    },
    btn: {
      padding: '12px 25px',
      fontFamily: 'inherit',
      fontWeight: 'bold',
      cursor: 'pointer',
      border: '2px solid #222',
      borderRadius: '8px',
    },
    btnSave: { background: '#b2fab4' },
    btnCancel: { background: '#ffb2b2' },
  };

  return (
    <div style={styles.wireframeContainer}>
      <header style={styles.header}>
        <span>👤 Usuario: <strong>Juan Pablo</strong></span>
        <span>{client ? 'Editar Cliente' : 'Nuevo Cliente'}</span>
      </header>

      <h2>{client ? 'Editar Cliente' : 'Generar Nuevo Cliente'}</h2>

      <form onSubmit={handleSubmit}>
        {client && (
          <div style={styles.formGroup}>
            <label style={styles.label}>ID Cliente:</label>
            <input
              type="text"
              value={formData.id || ''}
              disabled
              style={{ ...styles.input, ...styles.inputDisabled }}
            />
          </div>
        )}

        <div style={styles.formGroup}>
          <label style={styles.label}>Razón Social:</label>
          <input
            type="text"
            name="razonSocial"
            value={formData.razonSocial}
            onChange={handleChange}
            placeholder="Ej: Empresa S.A."
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>CUIT / CUIL:</label>
          <input
            type="text"
            name="cuit"
            value={formData.cuit}
            onChange={handleChange}
            placeholder="XX-XXXXXXXX-X"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Dirección:</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Calle, Altura, Localidad"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Teléfono:</label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="+54 ..."
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Correo Electrónico (Mail):</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Nombre de Fantasía (Opcional):</label>
          <input
            type="text"
            name="nombreFantasia"
            value={formData.nombreFantasia}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.actions}>
          <button type="submit" style={{ ...styles.btn, ...styles.btnSave }}>
            💾 Guardar Cliente
          </button>
          <button type="button" onClick={onCancel} style={{ ...styles.btn, ...styles.btnCancel }}>
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}