import React from 'react';

export default function ClientList({ clients, onCreateClick, onSelectClient, searchTerm, onSearchChange }) {
  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h2>Gestión de Clientes</h2>
          <p>Registro de empresas que contratan productos o servicios</p>
        </div>
        <button className="btn btn-primary btn-lg" onClick={onCreateClick}>
          + Nuevo Cliente
        </button>
      </div>

      <div className="card">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div className="search-input-wrapper" style={{ maxWidth: 380 }}>
            <span className="search-input-icon">🔍</span>
            <input
              className="form-input"
              type="text"
              placeholder="Buscar por razón social o CUIT..."
              value={searchTerm || ''}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {!clients || clients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏢</div>
            <p>No se encontraron clientes registrados.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                 <th>Razón Social</th>
                <th>CUIT</th>
                <th>Dirección</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className={onSelectClient ? 'clickable' : ''}
                  onClick={() => onSelectClient?.(client)}
                >
                  <td style={{ fontFamily: 'monospace', color: 'var(--gray-400)', fontSize: '12px' }}>#{client.id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{client.razonSocial}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--gray-600)' }}>{client.cuit}</td>
                  <td style={{ color: 'var(--gray-500)' }}>{client.direccion || '—'}</td>
                  <td>
                    {client.activo !== false
                      ? <span className="badge badge-calificado">Activo</span>
                      : <span className="badge badge-perdida">Inactivo</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {clients && clients.length > 0 && (
          <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', fontSize: '12px', color: 'var(--gray-400)' }}>
            {clients.length} {clients.length === 1 ? 'cliente' : 'clientes'}
          </div>
        )}
      </div>
    </>
  );
}