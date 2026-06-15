// import React, { useEffect, useState } from 'react';

// export const HistorialSorteos = ({ nuevoSorteoAgregado }) => {
//   const [sorteos, setSorteos] = useState([]);
//   const [cargando, setCargando] = useState(true);

//   const obtenerHistorial = async () => {
//     try {
//       const respuesta = await fetch('http://localhost:5000/api/sorteos');
//       const datos = await respuesta.json();
//       setSorteos(datos);
//       setCargando(false);
//     } catch (error) {
//       console.error('Error al traer el historial:', error);
//       setCargando(false);
//     }
//   };

//   useEffect(() => {
//     obtenerHistorial();
//   }, [nuevoSorteoAgregado]);

//   return (
//     <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
//       <h2 style={{ textAlign: 'center', color: '#333' }}>📋 Historial de Sorteos Guardados</h2>
      
//       {/* Manejo seguro del estado de carga */}
//       {cargando ? (
//         <p style={{ textAlign: 'center' }}>Cargando historial...</p>
//       ) : sorteos.length === 0 ? (
//         <p style={{ textAlign: 'center' }}>No hay sorteos registrados aún.</p>
//       ) : (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//           {sorteos.map((sorteo) => (
//             <div 
//               key={sorteo.id} 
//               style={{ 
//                 border: '1px solid #ddd', 
//                 borderRadius: '6px', 
//                 padding: '15px', 
//                 backgroundColor: '#f9f9f9',
//                 boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
//               }}
//             >
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: 'bold' }}>
//                 {/* Ajuste por si las columnas en la base de datos se llaman tipo o tipo_sorteo */}
//                 <span style={{ color: '#007bff' }}>Tipo: {sorteo.tipo || sorteo.tipo_sorteo || 'Tradicional'}</span>
//                 <span style={{ color: '#666' }}>Fecha: {sorteo.fecha ? new Date(sorteo.fecha).toLocaleDateString() : 'Sin fecha'}</span>
//               </div>
              
//               <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
//                 <span style={{ fontWeight: '500' }}>Balotas:</span>
//                 {[sorteo.b1, sorteo.b2, sorteo.b3, sorteo.b4, sorteo.b5].map((balota, index) => (
//                   <span 
//                     key={index} 
//                     style={{
//                       display: 'inline-block',
//                       width: '35px',
//                       height: '35px',
//                       lineHeight: '35px',
//                       textAlign: 'center',
//                       borderRadius: '50%',
//                       backgroundColor: '#e3f2fd',
//                       color: '#0d47a1',
//                       fontWeight: 'bold',
//                       border: '1px solid #90caf9'
//                     }}
//                   >
//                     {balota}
//                   </span>
//                 ))}
                
//                 <span style={{ fontWeight: '500', marginLeft: '10px' }}>SB:</span>
//                 <span 
//                   style={{
//                     display: 'inline-block',
//                     width: '35px',
//                     height: '35px',
//                     lineHeight: '35px',
//                     textAlign: 'center',
//                     borderRadius: '50%',
//                     backgroundColor: '#fff3e0',
//                     color: '#e65100',
//                     fontWeight: 'bold',
//                     border: '1px solid #ffb74d'
//                   }}
//                 >
//                   {sorteo.sb || sorteo.super_balota}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };


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
      console.error('Error al obtener el historial:', error);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerHistorial();
  }, [nuevoSorteoAgregado]);

  // Función interna para formatear la fecha de YYYY-MM-DD a DD/MM/YYYY
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'Sin fecha';
    // Cortamos solo los primeros 10 caracteres por si viene con zona horaria
    const limpia = fechaStr.split('T')[0];
    const [año, mes, día] = limpia.split('-');
    return `${día}/${mes}/${año}`;
  };

  if (cargando) return <p style={{ textAlign: 'center' }}>Cargando historial...</p>;

  return (
    <div style={{ marginTop: '30px' }}>
      <h3 style={{ textAlign: 'center' }}>📋 Historial de Sorteos (2026)</h3>
      
      {sorteos.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>No hay sorteos registrados aún.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '10px', textAlign: 'center' }}>Fecha</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Tipo</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Balotas</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>SB</th>
              </tr>
            </thead>
            <tbody>
              {sorteos.map((sorteo) => (
                <tr key={sorteo.id} style={{ borderBottom: '1px solid #eee' }}>
                  {/* Columna de Fecha */}
                  <td style={{ padding: '10px', textAlign: 'center', fontWeight: '500', color: '#555' }}>
                    {formatearFecha(sorteo.fecha)}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      backgroundColor: sorteo.tipo === 'Tradicional' ? '#e8f8f5' : '#fef9e7',
                      color: sorteo.tipo === 'Tradicional' ? '#117a65' : '#b7950b'
                    }}>
                      {sorteo.tipo}
                    </span>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', letterSpacing: '2px', fontWeight: 'bold' }}>
                    {`${sorteo.b1} - ${sorteo.b2} - ${sorteo.b3} - ${sorteo.b4} - ${sorteo.b5}`}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      width: '24px',
                      height: '24px',
                      lineHeight: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}>
                      {sorteo.sb}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
