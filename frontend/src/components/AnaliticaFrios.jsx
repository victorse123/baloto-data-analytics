import React, { useEffect, useState } from 'react';

// Recibimos 'filtro' desde App.jsx
export const AnaliticaFrios = ({ nuevoSorteoAgregado, filtro }) => {
  const [frios, setFrios] = useState([]);

  const obtenerFrios = async () => {
    try {
      // Le pegamos el filtro a la URL (?tipo=Todos, Tradicional o Revancha)
      const respuesta = await fetch(`http://localhost:5000/api/analitica/frios?tipo=${filtro}`);
      const datos = await respuesta.json();
      setFrios(datos);
    } catch (error) {
      console.error('Error al obtener números fríos:', error);
    }
  };

  // Se vuelve a ejecutar cada vez que cambia el filtro o se agrega un sorteo
  useEffect(() => {
    obtenerFrios();
  }, [nuevoSorteoAgregado, filtro]);

  return (
    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f7fa', borderRadius: '8px', border: '1px solid #d5dbdb' }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>❄️ Números Más Fríos ({filtro})</h4>
      <p style={{ fontSize: '12px', color: '#7f8c8d', margin: '-5px 0 10px 0' }}>Los que más sorteos llevan sin salir:</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {frios.slice(0, 7).map((item, index) => (
          <div key={index} style={{ padding: '6px 10px', backgroundColor: '#34495e', color: 'white', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold' }}>
            N° {item.numero} <span style={{ fontSize: '11px', fontWeight: 'normal', opacity: '0.8' }}>({item.ausencias}s)</span>
          </div>
        ))}
      </div>
    </div>
  );
};