import React from 'react';

function OportunidadesList({ oportunidades, onSelectOportunidad, onCreateClick, searchTerm, onSearchChange }) {
  return (
    <div style={{ maxWidth: '900px', margin: 'auto', background: 'white', border: '3px solid #222', padding: '25px', borderRadius: '20px 5px 25px 8px', boxShadow: '5px 5px 0px #333' }}>
      
      {/* Buscador y Botón de Creación */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed #222', paddingBottom: '15px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Buscar oportunidad (ID o Nombre)..." 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ border: '2px solid #222', padding: '8px', borderRadius: '5px', width: '250px', fontFamily: 'inherit' }}
          />
        </div>
      </div>

      <h2 style={{ textDecoration: 'underline' }}>Listado de Oportunidades</h2>

      {oportunidades.length === 0 ? (
        <p style={{ textAlign: 'center', fontStyle: 'italic' }}>No se encontraron oportunidades cargadas en el sistema.</p>
      ) : (
        oportunidades.map((op) => (
          <div 
            key={op.id} 
            onClick={() => onSelectOportunidad(op)}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '2px solid #222', padding: '15px', marginBottom: '12px', borderRadius: '8px', background: '#fafafa', cursor: 'pointer', transition: 'transform 0.1s' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <span style={{ background: '#e0e0e0', border: '1px solid #999', padding: '2px 6px', fontSize: '0.85em', borderRadius: '4px', fontWeight: 'bold', width: 'fit-content' }}>
                #{op.id || 'TEMP'}
              </span>
              <span><strong>Proyecto:</strong> {op.prospecto?.nombre || `Oportunidad #${op.id}`}</span>
              <span style={{ fontSize: '0.9em', color: '#555' }}>
                <strong>Estado:</strong> {op.estado || 'En Negociación'}
              </span>
            </div>
            <div style={{ fontSize: '1.3em' }}>✏️</div>
          </div>
        ))
      )}
    </div>
  );
}

export default OportunidadesList;
