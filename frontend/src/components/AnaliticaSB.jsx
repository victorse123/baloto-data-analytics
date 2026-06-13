import React, { useEffect, useState } from 'react';

export const AnaliticaSB = ({ nuevoSorteoAgregado }) => {
  const [frecuenciasSB, setFrecuenciasSB] = useState([]);
  const [cargando, setCargando] = useState(true);

  const obtenerAnaliticaSB = async () => {
    try {
      const respuesta = await fetch('http://localhost:5000/api/analitica/superbalota');
      const datos = await respuesta.json();
      setFrecuenciasSB(datos);
      setCargando(false);
    } catch (error) {
      console.error('Error al obtener analítica de SB:', error);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerAnaliticaSB();
  }, [nuevoSorteoAgregado]);

  if (cargando) return <p style={{ textAlign: 'center' }}>Analizando Súper Balotas...</p>;

  // Filtramos para mostrar solo las que ya han salido al menos una vez
  const sbActivas = frecuenciasSB.filter(f => f.frecuencia > 0);

  return (
    <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #f5b7b1', borderRadius: '8px', backgroundColor: '#fff' }}>
      <h2 style={{ textAlign: 'center', color: '#c0392b' }}>🔴 Frecuencia de la Súper Balota</h2>
      <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginTop: '-10px' }}>
        (Análisis exclusivo de la tómbola del 1 al 16)
      </p>

      {sbActivas.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>Registra sorteos para ver el comportamiento de la Súper Balota.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '15px', marginTop: '20px' }}>
          {sbActivas.map((item) => (
            <div 
              key={item.numero} 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px',
                border: '1px solid #e74c3c',
                borderRadius: '6px',
                backgroundColor: '#fdedec',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              {/* Círculo Rojo de la Súper Balota */}
              <span style={{
                display: 'inline-block',
                width: '35px',
                height: '35px',
                lineHeight: '35px',
                textAlign: 'center',
                borderRadius: '50%',
                backgroundColor: '#e74c3c',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                {item.numero < 10 ? `0${item.numero}` : item.numero}
              </span>
              
              {/* Frecuencia */}
              <span style={{ fontSize: '12px', marginTop: '5px', color: '#7b241c', fontWeight: '500' }}>
                {item.frecuencia} {item.frecuencia === 1 ? 'vez' : 'veces'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};