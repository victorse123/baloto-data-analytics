import React, { useEffect, useState } from 'react';

// Recibimos 'filtro' desde App.jsx
export const AnaliticaSB = ({ nuevoSorteoAgregado, filtro }) => {
  const [frecuenciasSB, setFrecuenciasSB] = useState([]);

  const obtenerFrecuenciasSB = async () => {
    try {
      // Le pegamos el filtro a la URL (?tipo=Todos, Tradicional o Revancha)
      const respuesta = await fetch(`http://localhost:5000/api/analitica/superbalota?tipo=${filtro}`);
      const datos = await respuesta.json();
      setFrecuenciasSB(datos);
    } catch (error) {
      console.error('Error al obtener analítica de SB:', error);
    }
  };

  // Se vuelve a ejecutar cada vez que cambia el filtro o se agrega un sorteo
  useEffect(() => {
    obtenerFrecuenciasSB();
  }, [nuevoSorteoAgregado, filtro]);

  return (
    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fdf2e9', borderRadius: '8px', border: '1px solid #fadbd8' }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#e67e22' }}>🔴 Súper Balota Más Frecuente ({filtro})</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {frecuenciasSB.slice(0, 5).map((item, index) => (
          <div key={index} style={{ padding: '6px 10px', backgroundColor: '#d35400', color: 'white', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold' }}>
            SB {item.numero} <span style={{ fontSize: '11px', fontWeight: 'normal', opacity: '0.9' }}>({item.frecuencia}x)</span>
          </div>
        ))}
      </div>
    </div>
  );
};