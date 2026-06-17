import React from 'react';

export default function ClientList({ clients, onSelectClient, searchTerm, onSearchChange }) {
  // NOTA: Los efectos :hover del CSS original no se pueden replicar directamente
  // con estilos en línea. Para ello se necesitarían clases de CSS o manejar
  // el estado onMouseEnter/onMouseLeave. Por simplicidad, se omiten.
  const styles = {
    wireframeContainer: {
      maxWidth: '950px',
      margin: 'auto',
      background: 'white',
      border: '3px solid #111',
      padding: '25px',
      borderRadius: '12px 25px 10px 30px',
      boxShadow: '10px 10px 0px #444',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '3px dashed #111',
      paddingBottom: '15px',
      marginBottom: '25px',
    },
    userTag: {
      background: '#eee',
      padding: '5px 15px',
      border: '2px solid #111',
      borderRadius: '5px',
    },
    searchContainer: {
      marginBottom: '20px',
      display: 'flex',
      gap: '10px',
    },
    searchInput: {
      flexGrow: 1,
      border: '2px solid #111',
      padding: '10px',
      fontFamily: 'inherit',
      borderRadius: '5px',
    },
    searchButton: {
      border: '2px solid #111',
      padding: '10px 20px',
      background: '#fff',
      fontFamily: 'inherit',
      fontWeight: 'bold',
      cursor: 'pointer',
      borderRadius: '5px',
    },
    clienteCard: {
      border: '2px solid #111',
      marginBottom: '12px',
      padding: '15px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      background: '#fff',
      transition: 'all 0.1s',
    },
    clienteData: {
      display: 'grid',
      gridTemplateColumns: '120px 1fr 200px',
      gap: '20px',
      flexGrow: 1,
    },
    idLabel: { fontFamily: 'monospace', fontWeight: 'bold', color: '#555' },
    razonSocial: { fontSize: '1.1em', fontWeight: 'bold' },
    cuitData: { color: '#333' },
    editBtn: {
      fontSize: '1.4em',
      background: 'none',
      border: '1px solid transparent',
      cursor: 'pointer',
      padding: '5px',
    },
  };

  return (
    <div style={styles.wireframeContainer}>
      <header style={styles.header}>
        <div style={styles.userTag}>
          👤 Usuario: <strong>Juan Pablo</strong>
        </div>
        <div>
          <strong>Módulo: Ventas &gt; Clientes</strong>
        </div>
      </header>

      <div style={styles.searchContainer}>
        <input type="text" placeholder="Buscar por Razón Social o CUIT..." style={styles.searchInput} value={searchTerm || ''} onChange={(e) => onSearchChange(e.target.value)} />
        <button style={styles.searchButton}>🔍 Buscar</button>
      </div>

      <h2>Listado de Clientes</h2>

      {clients && clients.length > 0 ? (
        clients.map((client) => (
          <div key={client.id} style={styles.clienteCard} onClick={() => onSelectClient(client)}>
            <div style={styles.clienteData}>
              <span style={styles.idLabel}>ID: {client.id}</span>
              <span style={styles.razonSocial}>{client.razonSocial}</span>
              <span style={styles.cuitData}>CUIT: {client.cuit}</span>
            </div>
            <button style={styles.editBtn}>✏️</button>
          </div>
        ))
      ) : (
        <p>No se encontraron clientes cargados.</p>
      )}
    </div>
  );
}