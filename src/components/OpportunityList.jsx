import React from 'react';

export default function OpportunityList({ opportunities, onSelectOpportunity, searchTerm, onSearchChange }) {
  // NOTA: Los efectos :hover del CSS original no se pueden replicar directamente
  // con estilos en línea. Para ello se necesitarían clases de CSS o manejar
  // el estado onMouseEnter/onMouseLeave. Por simplicidad, se omiten.
  const styles = {
    container: {
      maxWidth: '1000px',
      margin: 'auto',
      background: 'white',
      border: '3px solid #222',
      padding: '25px',
      borderRadius: '20px 5px 25px 8px',
      boxShadow: '5px 5px 0px #333',
      fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive, sans-serif',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '2px dashed #222',
      paddingBottom: '15px',
      marginBottom: '30px',
    },
    userInfo: {
      fontSize: '1.1em',
    },
    searchContainer: {
      marginBottom: '20px',
      display: 'flex',
      gap: '10px',
    },
    searchInput: {
      flexGrow: 1,
      border: '2px solid #222',
      padding: '10px',
      fontFamily: 'inherit',
      borderRadius: '5px',
    },
    searchButton: {
      border: '2px solid #222',
      padding: '10px 20px',
      background: '#fff',
      fontFamily: 'inherit',
      fontWeight: 'bold',
      cursor: 'pointer',
      borderRadius: '5px',
    },
    h2: {
      textDecoration: 'underline',
    },
    oportunidadItem: {
      border: '2px solid #222',
      marginBottom: '15px',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'background 0.2s',
      borderRadius: '5px 15px 5px 10px',
    },
    dataGroup: {
      display: 'flex',
      gap: '40px',
      flexGrow: 1,
    },
    idTag: {
      fontFamily: 'monospace',
      fontWeight: 'bold',
    },
    estado: {
      border: '1px solid #222',
      padding: '2px 8px',
      borderRadius: '10px',
      fontSize: '0.9em',
    },
    editIcon: {
      fontSize: '1.5em',
      padding: '5px',
      border: '1px solid transparent',
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.userInfo}>
          👤 Vendedor Logueado: <strong>Juan Pablo</strong>
        </div>
        <div>
          <small>Módulo: Ventas &gt; Oportunidades</small>
        </div>
      </header>

      <div style={styles.searchContainer}>
        <input type="text" placeholder="Buscar oportunidad por nombre o ID..." style={styles.searchInput} value={searchTerm || ''} onChange={(e) => onSearchChange(e.target.value)} />
        <button style={styles.searchButton}>🔍 Buscar</button>
      </div>

      <h2 style={styles.h2}>Listado de Oportunidades</h2>

      {opportunities && opportunities.map((op) => (
        <div key={op.id} style={styles.oportunidadItem} onClick={() => onSelectOpportunity(op)}>
          <div style={styles.dataGroup}>
            <span style={styles.idTag}>#{op.id}</span>
            <span><strong>Proyecto:</strong> {op.proyecto}</span>
            <span style={styles.estado}>Estado: {op.estado}</span>
          </div>
          <div style={styles.editIcon}>✏️</div>
        </div>
      ))}
    </div>
  );
}