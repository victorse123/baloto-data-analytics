import React, { useEffect, useState } from 'react';

export const HistorialSorteos = ({ nuevoSorteoAgregado }) => {
  const [sorteos, setSorteos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // --- ESTADOS PARA LA PAGINACIÓN ---
  const [paginaActual, setPaginaActual] = useState(1);
  const sorteosPorPagina = 5; // Puedes cambiar este número a 10 si prefieres ver más por página

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

  // Cada vez que se agregue un sorteo nuevo, nos aseguramos de volver a la página 1 para que lo vea de primero
  useEffect(() => {
    obtenerHistorial();
    setPaginaActual(1);
  }, [nuevoSorteoAgregado]);

  // --- LÓGICA DE MATEMÁTICA DE PAGINACIÓN ---
  const indiceUltimoSorteo = paginaActual * sorteosPorPagina;
  const indicePrimerSorteo = indiceUltimoSorteo - sorteosPorPagina;
  
  // Cortamos el array original para mostrar solo el segmento de la página actual
  const sorteosPaginados = sorteos.slice(indicePrimerSorteo, indiceUltimoSorteo);
  
  // Calculamos el total de páginas necesarias
  const totalPaginas = Math.ceil(sorteos.length / sorteosPorPagina);

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'Sin fecha';
    const limpia = fechaStr.split('T')[0];
    const [año, mes, día] = limpia.split('-');
    return `${día}/${mes}/${año}`;
  };

  if (cargando) return <p style={{ textAlign: 'center' }}>Cargando historial...</p>;

  return (
    <div style={{ marginTop: '30px', paddingBottom: '20px' }}>
      <h3 style={{ textAlign: 'center' }}>📋 Historial de Sorteos (2026)</h3>
      
      {sorteos.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>No hay sorteos registrados aún.</p>
      ) : (
        <>
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
                {sorteosPaginados.map((sorteo) => (
                  <tr key={sorteo.id} style={{ borderBottom: '1px solid #eee' }}>
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

          {/* --- CONTROLADORES DE PAGINACIÓN (INTERFAZ) --- */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '20px' }}>
            <button
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
              style={{
                padding: '6px 12px',
                backgroundColor: paginaActual === 1 ? '#e0e0e0' : '#3498db',
                color: paginaActual === 1 ? '#a0a0a0' : 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: paginaActual === 1 ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '13px'
              }}
            >
              ◀ Anterior
            </button>

            <span style={{ fontSize: '14px', fontWeight: '500', color: '#555' }}>
              Página <strong>{paginaActual}</strong> de {totalPaginas}
            </span>

            <button
              onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
              disabled={paginaActual === totalPaginas}
              style={{
                padding: '6px 12px',
                backgroundColor: paginaActual === totalPaginas ? '#e0e0e0' : '#3498db',
                color: paginaActual === totalPaginas ? '#a0a0a0' : 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '13px'
              }}
            >
              Siguiente ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
};

