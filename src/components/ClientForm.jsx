import React, { useState } from 'react';

export default function ClientForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({ razonSocial: '', cuit: '', direccion: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.razonSocial.trim() || !formData.cuit.trim()) {
      alert('La Razón Social y el CUIT son obligatorios.');
      return;
    }
    if (!formData.direccion.trim()) {
      alert('La Dirección es obligatoria.');
      return;
    }
    // Payload que espera ClienteController.ClienteRequest del backend
    onSave({
      id:          Date.now(),        // Long autogenerado
      razonSocial: formData.razonSocial.trim(),
      cuit:        formData.cuit.trim(),
      direccion:   formData.direccion.trim(),
      activo:      true,
    });
  };

  return (
    <div className="form-card">
      <div className="form-card-header">
        <h2>Registrar Nuevo Cliente</h2>
        <p>Completá los datos de la empresa que pasa a ser cliente</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-card-body">

          <div className="form-group">
            <label className="form-label">Razón Social *</label>
            <input
              className="form-input"
              type="text"
              name="razonSocial"
              value={formData.razonSocial}
              onChange={handleChange}
              placeholder="Ej: Empresa Tecnológica S.A."
            />
          </div>

          <div className="form-group">
            <label className="form-label">CUIT *</label>
            <input
              className="form-input"
              type="text"
              name="cuit"
              value={formData.cuit}
              onChange={handleChange}
              placeholder="XX-XXXXXXXX-X"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Dirección</label>
            <input
              className="form-input"
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Calle, Altura, Localidad"
            />
          </div>

        </div>

        <div className="form-card-footer">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Guardar Cliente
          </button>
        </div>
      </form>
    </div>
  );
}