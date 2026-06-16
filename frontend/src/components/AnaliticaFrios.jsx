// import React, { useEffect, useState } from 'react';

// export const AnaliticaFrios = ({ nuevoSorteoAgregado }) => {
//   const [frios, setFrios] = useState([]);
//   const [cargando, setCargando] = useState(true);

//   // Consultamos la API de números fríos
//   const obtenerFrios = async () => {
//     try {
//       const respuesta = await fetch('http://localhost:5000/api/analitica/frios');
//       const datos = await respuesta.json();
//       setFrios(datos);
//       setCargando(false);
//     } catch (error) {
//       console.error('Error al obtener los números fríos:', error);
//       setCargando(false);
//     }
//   };

//   useEffect(() => {
//     obtenerFrios();
//   }, [nuevoSorteoAgregado]);

//   if (cargando) return <p style={{ textAlign: 'center' }}>Calculando ausencias...</p>;

//   // Filtramos para mostrar en el Top de Fríos solo los que lleven al menos 1 sorteo sin salir
//   const topFrios = frios.filter(f => f.ausencias > 0);

//   return (
//     <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
//       <h2 style={{ textAlign: 'center', color: '#2980b9' }}>❄️ Top Números Más Fríos (Ausencias)</h2>
//       <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginTop: '-10px' }}>
//         (Balotas ordenadas por cantidad de sorteos consecutivos sin aparecer)
//       </p>

//       {topFrios.length === 0 ? (
//         <p style={{ textAlign: 'center', color: '#999' }}>Todos los números han salido recientemente.</p>
//       ) : (
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '15px', marginTop: '20px' }}>
//           {topFrios.map((item) => (
//             <div 
//               key={item.numero} 
//               style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 padding: '10px',
//                 border: '1px solid #3498db',
//                 borderRadius: '6px',
//                 backgroundColor: '#eaf2f8',
//                 boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
//               }}
//             >
//               {/* Círculo Azul de Balota Fría */}
//               <span style={{
//                 display: 'inline-block',
//                 width: '35px',
//                 height: '35px',
//                 lineHeight: '35px',
//                 textAlign: 'center',
//                 borderRadius: '50%',
//                 backgroundColor: '#2980b9',
//                 color: 'white',
//                 fontWeight: 'bold',
//                 fontSize: '16px'
//               }}>
//                 {item.numero < 10 ? `0${item.numero}` : item.numero}
//               </span>
              
//               {/* Contador de Ausencias */}
//               <span style={{ fontSize: '11px', marginTop: '5px', color: '#2c3e50', fontWeight: 'bold' }}>
//                 {item.ausencias} {item.ausencias === 1 ? 'ant. sin salir' : 'sorteos sin salir'}
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