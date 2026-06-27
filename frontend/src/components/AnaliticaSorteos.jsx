import React, { useEffect, useState } from 'react';

// Recibimos 'filtro' desde el componente padre (App.jsx)
export const AnaliticaSorteos = ({ nuevoSorteoAgregado, filtro }) => {
  const [frecuencias, setFrecuencias] = useState([]);

  const obtenerFrecuencias = async () => {
    try {
      // Inyectamos el filtro dinámicamente en la URL de la petición
      const respuesta = await fetch(`http://localhost:5000/api/analitica/frecuencias?tipo=${filtro}`);
      const datos = await respuesta.json();
      setFrecuencias(datos);
    } catch (error) {
      console.error('Error al obtener frecuencias:', error);
    }
  };

  // Agregamos [filtro] aquí para que React ejecute la función cada vez que cambies de botón
  useEffect(() => {
    obtenerFrecuencias();
  }, [nuevoSorteoAgregado, filtro]);

  return (
    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff8f7', borderRadius: '8px', border: '1px solid #fadbd8' }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#c0392b' }}>🔥 Números Más Calientes ({filtro})</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {frecuencias.slice(0, 7).map((item, index) => (
          <div key={index} style={{ padding: '6px 10px', backgroundColor: '#e74c3c', color: 'white', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold' }}>
            N° {item.numero} <span style={{ fontSize: '11px', fontWeight: 'normal', opacity: '0.9' }}>({item.frecuencia}x)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

