import React, { useEffect, useState } from 'react';

export const HistorialSorteos = ({ nuevoSorteoAgregado }) => {
  const [sorteos, setSorteos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const obtenerHistorial = async () => {
    try {
      const respuesta = await fetch('http://localhost:5000/api/sorteos');
      const datos = await respuesta.json();
      setSorteos(datos);
      setCargando(false);
    } catch (error) {
      console.error('Error al traer el historial:', error);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerHistorial();
  }, [nuevoSorteoAgregado]);

  return (
    <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>📋 Historial de Sorteos Guardados</h2>
      
      {/* Manejo seguro del estado de carga */}
      {cargando ? (
        <p style={{ textAlign: 'center' }}>Cargando historial...</p>
      ) : sorteos.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No hay sorteos registrados aún.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {sorteos.map((sorteo) => (
            <div 
              key={sorteo.id} 
              style={{ 
                border: '1px solid #ddd', 
                borderRadius: '6px', 
                padding: '15px', 
                backgroundColor: '#f9f9f9',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: 'bold' }}>
                {/* Ajuste por si las columnas en la base de datos se llaman tipo o tipo_sorteo */}
                <span style={{ color: '#007bff' }}>Tipo: {sorteo.tipo || sorteo.tipo_sorteo || 'Tradicional'}</span>
                <span style={{ color: '#666' }}>Fecha: {sorteo.fecha ? new Date(sorteo.fecha).toLocaleDateString() : 'Sin fecha'}</span>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: '500' }}>Balotas:</span>
                {[sorteo.b1, sorteo.b2, sorteo.b3, sorteo.b4, sorteo.b5].map((balota, index) => (
                  <span 
                    key={index} 
                    style={{
                      display: 'inline-block',
                      width: '35px',
                      height: '35px',
                      lineHeight: '35px',
                      textAlign: 'center',
                      borderRadius: '50%',
                      backgroundColor: '#e3f2fd',
                      color: '#0d47a1',
                      fontWeight: 'bold',
                      border: '1px solid #90caf9'
                    }}
                  >
                    {balota}
                  </span>
                ))}
                
                <span style={{ fontWeight: '500', marginLeft: '10px' }}>SB:</span>
                <span 
                  style={{
                    display: 'inline-block',
                    width: '35px',
                    height: '35px',
                    lineHeight: '35px',
                    textAlign: 'center',
                    borderRadius: '50%',
                    backgroundColor: '#fff3e0',
                    color: '#e65100',
                    fontWeight: 'bold',
                    border: '1px solid #ffb74d'
                  }}
                >
                  {sorteo.sb || sorteo.super_balota}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};