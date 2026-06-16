// import React, { useEffect, useState } from 'react';

// export const AnaliticaSB = ({ nuevoSorteoAgregado }) => {
//   const [frecuenciasSB, setFrecuenciasSB] = useState([]);
//   const [cargando, setCargando] = useState(true);

//   const obtenerAnaliticaSB = async () => {
//     try {
//       const respuesta = await fetch('http://localhost:5000/api/analitica/superbalota');
//       const datos = await respuesta.json();
//       setFrecuenciasSB(datos);
//       setCargando(false);
//     } catch (error) {
//       console.error('Error al obtener analítica de SB:', error);
//       setCargando(false);
//     }
//   };

//   useEffect(() => {
//     obtenerAnaliticaSB();
//   }, [nuevoSorteoAgregado]);

//   if (cargando) return <p style={{ textAlign: 'center' }}>Analizando Súper Balotas...</p>;

//   // Filtramos para mostrar solo las que ya han salido al menos una vez
//   const sbActivas = frecuenciasSB.filter(f => f.frecuencia > 0);

//   return (
//     <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #f5b7b1', borderRadius: '8px', backgroundColor: '#fff' }}>
//       <h2 style={{ textAlign: 'center', color: '#c0392b' }}>🔴 Frecuencia de la Súper Balota</h2>
//       <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginTop: '-10px' }}>
//         (Análisis exclusivo de la tómbola del 1 al 16)
//       </p>

//       {sbActivas.length === 0 ? (
//         <p style={{ textAlign: 'center', color: '#999' }}>Registra sorteos para ver el comportamiento de la Súper Balota.</p>
//       ) : (
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '15px', marginTop: '20px' }}>
//           {sbActivas.map((item) => (
//             <div 
//               key={item.numero} 
//               style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 padding: '10px',
//                 border: '1px solid #e74c3c',
//                 borderRadius: '6px',
//                 backgroundColor: '#fdedec',
//                 boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
//               }}
//             >
//               {/* Círculo Rojo de la Súper Balota */}
//               <span style={{
//                 display: 'inline-block',
//                 width: '35px',
//                 height: '35px',
//                 lineHeight: '35px',
//                 textAlign: 'center',
//                 borderRadius: '50%',
//                 backgroundColor: '#e74c3c',
//                 color: 'white',
//                 fontWeight: 'bold',
//                 fontSize: '16px'
//               }}>
//                 {item.numero < 10 ? `0${item.numero}` : item.numero}
//               </span>
              
//               {/* Frecuencia */}
//               <span style={{ fontSize: '12px', marginTop: '5px', color: '#7b241c', fontWeight: '500' }}>
//                 {item.frecuencia} {item.frecuencia === 1 ? 'vez' : 'veces'}
//               </span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };





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