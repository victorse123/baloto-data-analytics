import React, { useEffect, useState } from 'react';

export const AnaliticaFrios = ({ nuevoSorteoAgregado }) => {
  const [frios, setFrios] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Consultamos la API de números fríos
  const obtenerFrios = async () => {
    try {
      const respuesta = await fetch('http://localhost:5000/api/analitica/frios');
      const datos = await respuesta.json();
      setFrios(datos);
      setCargando(false);
    } catch (error) {
      console.error('Error al obtener los números fríos:', error);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerFrios();
  }, [nuevoSorteoAgregado]);

  if (cargando) return <p style={{ textAlign: 'center' }}>Calculando ausencias...</p>;

  // Filtramos para mostrar en el Top de Fríos solo los que lleven al menos 1 sorteo sin salir
  const topFrios = frios.filter(f => f.ausencias > 0);

  return (
    <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
      <h2 style={{ textAlign: 'center', color: '#2980b9' }}>❄️ Top Números Más Fríos (Ausencias)</h2>
      <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginTop: '-10px' }}>
        (Balotas ordenadas por cantidad de sorteos consecutivos sin aparecer)
      </p>

      {topFrios.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>Todos los números han salido recientemente.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '15px', marginTop: '20px' }}>
          {topFrios.map((item) => (
            <div 
              key={item.numero} 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px',
                border: '1px solid #3498db',
                borderRadius: '6px',
                backgroundColor: '#eaf2f8',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              {/* Círculo Azul de Balota Fría */}
              <span style={{
                display: 'inline-block',
                width: '35px',
                height: '35px',
                lineHeight: '35px',
                textAlign: 'center',
                borderRadius: '50%',
                backgroundColor: '#2980b9',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                {item.numero < 10 ? `0${item.numero}` : item.numero}
              </span>
              
              {/* Contador de Ausencias */}
              <span style={{ fontSize: '11px', marginTop: '5px', color: '#2c3e50', fontWeight: 'bold' }}>
                {item.ausencias} {item.ausencias === 1 ? 'ant. sin salir' : 'sorteos sin salir'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};