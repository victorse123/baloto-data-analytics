import React, { useEffect, useState } from 'react';

export const AnaliticaSorteos = ({ nuevoSorteoAgregado }) => {
  const [frecuencias, setFrecuencias] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Función para consultar la API de analítica
  const obtenerAnalitica = async () => {
    try {
      const respuesta = await fetch('http://localhost:5000/api/analitica/frecuencias');
      const datos = await respuesta.json();
      setFrecuencias(datos);
      setCargando(false);
    } catch (error) {
      console.error('Error al obtener la analítica:', error);
      setCargando(false);
    }
  };

  // Se ejecuta al cargar el componente y se refresca si se agrega un sorteo nuevo
  useEffect(() => {
    obtenerAnalitica();
  }, [nuevoSorteoAgregado]);

  if (cargando) return <p style={{ textAlign: 'center' }}>Procesando analítica...</p>;

  // Filtramos para mostrar en el TOP solo los números que han salido al menos 1 vez
  const numerosCalientes = frecuencias.filter(f => f.frecuencia > 0);

  return (
    <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
      <h2 style={{ textAlign: 'center', color: '#d35400' }}>🔥 Top Números Más Calientes</h2>
      <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginTop: '-10px' }}>
        (Balotas ordenadas por mayor número de apariciones)
      </p>

      {numerosCalientes.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>Registra más sorteos para encender la analítica.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '15px', marginTop: '20px' }}>
          {numerosCalientes.map((item) => (
            <div 
              key={item.numero} 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px',
                border: '1px solid #f39c12',
                borderRadius: '6px',
                backgroundColor: '#fff9f2',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              {/* Círculo del Número */}
              <span style={{
                display: 'inline-block',
                width: '35px',
                height: '35px',
                lineHeight: '35px',
                textAlign: 'center',
                borderRadius: '50%',
                backgroundColor: '#e67e22',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                {item.numero < 10 ? `0${item.numero}` : item.numero}
              </span>
              
              {/* Veces que ha salido */}
              <span style={{ fontSize: '12px', marginTop: '5px', color: '#555', fontWeight: '500' }}>
                {item.frecuencia} {item.frecuencia === 1 ? 'vez' : 'veces'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};