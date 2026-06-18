import React, { useState, useEffect } from 'react';

export default function LeadForm({ lead, onSave, onCancel, onGenerarOportunidad }) {
  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    origen: 'Campaña',
    estado: 'Nuevo',
    descripcion: ''
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        id: lead.id,
        nombre: lead.nombre || '',
        contacto: lead.contacto || '',
        origen: lead.origen || 'Campaña',
        estado: lead.estado || 'Nuevo',
        descripcion: lead.descripcion || ''
      });
    }
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  //const handleSubmit = (e) => {
  //  e.preventDefault();
  //  if (!formData.nombre || !formData.contacto) {
  //    alert('Por favor, completa el nombre y el contacto del Lead.');
  //    return;
  //  }
  //  onSave(formData);
 // };

const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!formData.nombre || !formData.contacto) {
    alert("Por favor, completa el nombre y el contacto del Lead.");
    return;
  }

  // Generamos un ID numérico provisorio usando los milisegundos actuales
  // para que la clave primaria de la base de datos no sea nula.
  const idProvisorio = lead ? lead.id : Date.now();

  const payload = {
    id: idProvisorio,
    nombre: formData.nombre,
    apellido: formData.apellido || "", // Evitamos problemas enviando string vacío
    contacto: formData.contacto,
    origen: formData.origen,            // Se envía "Vendedor" tal cual
    estado: formData.estado,            // Se envía "Nuevo" tal cual
    campania: null                      // Cumplimos la regla: sin campaña asociada
  };

  onSave(payload);
};

  return (
    <div className="wireframe-container" style={{ border: '3px solid #333', background: 'white', width: '600px', margin: 'auto', padding: '30px', borderRadius: '8px 12px' }}>
      <h2>{lead ? 'Editar Lead' : 'Formulario de Lead'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: '5px' }}>Nombre del Lead:</label>
          <input 
            type="text" 
            name="nombre"
            value={formData.nombre} 
            onChange={handleChange}
            placeholder="Escriba nombre aquí..." 
            style={{ border: '2px solid #333', padding: '8px', borderRadius: '4px', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: '5px' }}>Contacto del Lead:</label>
          <input 
            type="text" 
            name="contacto"
            value={formData.contacto} 
            onChange={handleChange}
            placeholder="Teléfono o Email" 
            style={{ border: '2px solid #333', padding: '8px', borderRadius: '4px', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: '5px' }}>Origen:</label>
          <select name="origen" value={formData.origen} onChange={handleChange} style={{ border: '2px solid #333', padding: '8px', borderRadius: '4px', fontFamily: 'inherit' }}>
            <option>Campaña</option>
            <option>Recomendación</option>
            <option>Contacto Directo</option>
            <option>Vendedor</option>
            <option>Ticket</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: '5px' }}>Estado:</label>
          <select name="estado" value={formData.estado} onChange={handleChange} style={{ border: '2px solid #333', padding: '8px', borderRadius: '4px', fontFamily: 'inherit' }}>
            <option>Nuevo</option>
            <option>Contactado</option>
            <option>Calificado</option>
            <option>Oportunidad</option>
            <option>Cliente</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: '5px' }}>Descripción (Opcional):</label>
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="3" style={{ border: '2px solid #333', padding: '8px', borderRadius: '4px', fontFamily: 'inherit' }}></textarea>
        </div>
       
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ border: '2px solid #333', padding: '10px 20px', background: '#d4f7d4', cursor: 'pointer', fontFamily: 'inherit' }}>Guardar</button>
          <button type="button" onClick={onCancel} style={{ border: '2px solid #333', padding: '10px 20px', background: 'white', cursor: 'pointer', fontFamily: 'inherit' }}>Cancelar</button>
          <button 
            type="button"
            onClick={() => { 
            // Validamos usando el estado del formulario (formData.estado)
            
            if (formData.estado !== "Calificado") {
            alert("El lead debe estar calificado para generar una oportunida.");
            return; // Bloquea la ejecución y no pasa al formulario de oportunidad
           }
           onGenerarOportunidad(lead)}}
            disabled={!lead?.id} // Solo habilitado si el lead ya fue guardado y tiene ID
            style={{ border: '2px solid #333', padding: '10px 20px', background: '#fff9c4', cursor: lead?.id ? 'pointer' : 'not-allowed' }}
          >
          Generar Oportunidad
        </button>
        </div>
      </form>
    </div>
  );
}
