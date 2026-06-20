import React, { useState, useEffect } from 'react';

export const EmuladorJuego = () => {
  // --- ESTADOS DEL EMULADOR ---
  const [tipoJuego, setTipoJuego] = useState('Tradicional');
  const [estrategia, setEstrategia] = useState('balanceado');
  const [combinacionGenerada, setCombinacionGenerada] = useState(null);
  const [simulacionResultados, setSimulacionResultados] = useState(null);
  const [cargando, setCargando] = useState(false);

  // --- ESTADO PARA LA DATA REAL DESDE SUPABASE ---
  const [estadisticasReales, setEstadisticasReales] = useState(null);

  // Cargar las estadísticas en tiempo real basándonos en el tipo de juego seleccionado
  useEffect(() => {
    const cargarEstadisticasRealTime = async () => {
      try {
        const respuesta = await fetch(`http://localhost:5000/api/estadisticas-emulador?tipo=${tipoJuego}`);
        if (respuesta.ok) {
          const datos = await respuesta.json();
          setEstadisticasReales(datos);
        }
      } catch (error) {
        console.error('Error al conectar el emulador con la API del Backend:', error);
      }
    };

    cargarEstadisticasRealTime();
    // Limpiamos pantallas viejas al cambiar de modalidad para evitar confusión de datos
    setCombinacionGenerada(null);
    setSimulacionResultados(null);
  }, [tipoJuego]);

// --- MOTOR GENERADOR DE JUGADAS OPTIMIZADO Y AUDITADO ---
  const generarJugadaEstadistica = () => {
    if (!estadisticasReales) {
      alert('Aún no se han cargado las estadísticas del servidor backend.');
      return;
    }

    // 🛑 LOG DE AUDITORÍA: Ver qué nos está mandando el backend exactamente
    console.log("=== AUDITORÍA DEL BACKEND ===");
    console.log("Calientes recibidos:", estadisticasReales.calientes);
    console.log("Fríos recibidos:", estadisticasReales.frios);
    console.log("SB Calientes:", estadisticasReales.sbCalientes);
    console.log("SB Frías:", estadisticasReales.sbFrias);
    console.log("=============================");

    setCargando(true);
    
    setTimeout(() => {
      let grupoBalotas = [];
      let grupoSB = [];

      // 1. Asignación según la estrategia seleccionada
      if (estrategia === 'caliente') {
        grupoBalotas = estadisticasReales.calientes || []; 
        grupoSB = estadisticasReales.sbCalientes || [];
      } else if (estrategia === 'frio') {
        grupoBalotas = estadisticasReales.frios || [];
        grupoSB = estadisticasReales.sbFrias || [];
      } else {
        // Balanceado (Mezclado)
        grupoBalotas = [
          ...(estadisticasReales.calientes || []).slice(0, 7), 
          ...(estadisticasReales.frios || []).slice(0, 7)
        ];
        grupoSB = [
          ...(estadisticasReales.sbCalientes || []).slice(0, 2), 
          ...(estadisticasReales.sbFrias || []).slice(0, 2)
        ];
      }

      // 2. Extracción estricta de 5 balotas únicas
      const balotasSeleccionadas = [];
      
      grupoBalotas.forEach(num => {
        const n = parseInt(num, 10);
        // Filtramos que sea un número válido entre 1 y 43 y que no esté ya repetido
        if (!isNaN(n) && n >= 1 && n <= 43 && !balotasSeleccionadas.includes(n) && balotasSeleccionadas.length < 5) {
          balotasSeleccionadas.push(n);
        }
      });

      // BLINDAJE: Si faltan balotas por empates o filtros, rellenamos con el pool de respaldo histórico
      const respaldoRelleno = [3, 9, 14, 21, 26, 33, 40, 1, 5, 11, 19, 27, 30, 36];
      if (balotasSeleccionadas.length < 5) {
        respaldoRelleno.forEach(num => {
          if (!balotasSeleccionadas.includes(num) && balotasSeleccionadas.length < 5) {
            balotasSeleccionadas.push(num);
          }
        });
      }

      // Ordenar de menor a mayor para la visualización en las esferas
      balotasSeleccionadas.sort((a, b) => a - b);

      // 3. Selección estricta de la Súper Balota
      let sbSeleccionada;
      const poolSBLimpio = grupoSB.map(n => parseInt(n, 10)).filter(n => !isNaN(n) && n >= 1 && n <= 16);

      if (poolSBLimpio.length > 0 && !isNaN(poolSBLimpio[0])) {
        // Tomamos la primera opción fría o caliente disponible que nos dio el backend
        sbSeleccionada = poolSBLimpio[0];
      } else {
        // Si por alguna razón viene vacío, usamos una de respaldo seguro
        sbSeleccionada = estrategia === 'frio' ? 4 : 1; 
      }

      // 4. Cargar los estados en React para pintar las esferas
      setCombinacionGenerada({
        balotas: balotasSeleccionadas,
        sb: sbSeleccionada
      });
      
      setSimulacionResultados(null);
      setCargando(false);
    }, 600);
  };

  // --- MOTOR DE SIMULACIÓN MASIVA (10,000 SORTEOS MATEMÁTICOS) ---
  const ejecutarSimulacionMasiva = () => {
    if (!combinacionGenerada) return;

    let aciertos0_SB = 0;
    let aciertos1_SB = 0;
    let aciertos3_0 = 0;
    let aciertos4_0 = 0;
    let granPremio = 0; 

    const totalSorteosSimulados = 10000;
    const costoTicket = 5700; 
    const inversionTotal = totalSorteosSimulados * costoTicket;

    for (let i = 0; i < totalSorteosSimulados; i++) {
      const balotasGanadoras = [];
      while (balotasGanadoras.length < 5) {
        const num = Math.floor(Math.random() * 43) + 1;
        if (!balotasGanadoras.includes(num)) balotasGanadoras.push(num);
      }
      const sbGanadora = Math.floor(Math.random() * 16) + 1;

      const coincidenciasBalotas = combinacionGenerada.balotas.filter(b => balotasGanadoras.includes(b)).length;
      const coincidenciaSB = combinacionGenerada.sb === sbGanadora;

      if (coincidenciasBalotas === 0 && coincidenciaSB) aciertos0_SB++;
      if (coincidenciasBalotas === 1 && coincidenciaSB) aciertos1_SB++;
      if (coincidenciasBalotas === 3 && !coincidenciaSB) aciertos3_0++;
      if (coincidenciasBalotas === 4 && !coincidenciaSB) aciertos4_0++;
      if (coincidenciasBalotas === 5 && coincidenciaSB) granPremio++;
    }

    setSimulacionResultados({
      totalSorteosSimulados,
      inversionTotal,
      aciertos0_SB,
      aciertos1_SB,
      aciertos3_0,
      aciertos4_0,
      granPremio
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '20px auto', backgroundColor: '#f9f9f9', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '20px' }}>🎰 Emulador de Juego Estadístico</h2>

      {/* Selector de Tipo de Juego */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button 
          onClick={() => setTipoJuego('Tradicional')}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: tipoJuego === 'Tradicional' ? '#117a65' : '#e0e0e0', color: tipoJuego === 'Tradicional' ? 'white' : '#555' }}
        >
          Baloto Tradicional
        </button>
        <button 
          onClick={() => setTipoJuego('Revancha')}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: tipoJuego === 'Revancha' ? '#b7950b' : '#e0e0e0', color: tipoJuego === 'Revancha' ? 'white' : '#555' }}
        >
          Revancha
        </button>
      </div>

      {/* Selector de Estrategia */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>Estrategia Analítica:</label>
        <select 
          value={estrategia} 
          onChange={(e) => setEstrategia(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
        >
          <option value="balanceado">Equilibrada (Fusión Calientes + Fríos)</option>
          <option value="caliente">Optimizar por Frecuencia Alta (Puros Números Calientes)</option>
          <option value="frio">Ley de Compensación (Puros Números Fríos)</option>
        </select>
      </div>

      {/* Botón Principal */}
      <button 
        onClick={generarJugadaEstadistica}
        disabled={cargando}
        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#2980b9', color: 'white', fontWeight: 'bold', fontSize: '16px', cursor: cargando ? 'not-allowed' : 'pointer', transition: '0.3s' }}
      >
        {cargando ? 'Analizando base de datos real...' : '🎲 Generar Jugada Inteligente'}
      </button>

      {/* Visualización de la Combinación Generada */}
      {combinacionGenerada && (
        <div style={{ marginTop: '25px', textAlign: 'center', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eee' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>TU COMBINACIÓN SUGERIDA ({tipoJuego}):</h4>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            {combinacionGenerada.balotas.map((num, idx) => (
              <span key={idx} style={{ display: 'inline-block', width: '36px', height: '36px', lineHeight: '36px', borderRadius: '50%', backgroundColor: '#34495e', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
                {num}
              </span>
            ))}
            <span style={{ display: 'inline-block', width: '36px', height: '36px', lineHeight: '36px', borderRadius: '50%', backgroundColor: '#e74c3c', color: 'white', fontWeight: 'bold', fontSize: '14px', marginLeft: '5px' }}>
              {combinacionGenerada.sb}
            </span>
          </div>

          <button 
            onClick={ejecutarSimulacionMasiva}
            style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #27ae60', backgroundColor: '#2ecc71', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
          >
            ⚡ Simular 10,000 Sorteos con estos números
          </button>
        </div>
      )}

      {/* Resultados Matemáticos de la Simulación */}
      {simulacionResultados && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#ebf5fb', borderRadius: '8px', border: '1px solid #aec6cf' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#2980b9', textAlign: 'center' }}>📊 Informe Macroeconómico de Simulación</h4>
          <p style={{ fontSize: '13px', margin: '5px 0' }}>Sorteos evaluados: <strong>{simulacionResultados.totalSorteosSimulados.toLocaleString()}</strong></p>
          <p style={{ fontSize: '13px', margin: '5px 0' }}>Capital invertido virtual: <strong style={{ color: '#c0392b' }}>${simulacionResultados.inversionTotal.toLocaleString()} COP</strong></p>
          
          <hr style={{ border: '0', borderTop: '1px solid #ccc', margin: '10px 0' }} />
          <h5 style={{ margin: '0 0 5px 0', color: '#34495e' }}>Premios Capturados:</h5>
          <ul style={{ fontSize: '13px', paddingLeft: '20px', margin: '0' }}>
            <li>Solo Súper Balota (0 + SB): <strong>{simulacionResultados.aciertos0_SB} veces</strong></li>
            <li>1 Balota + Súper Balota (1 + SB): <strong>{simulacionResultados.aciertos1_SB} veces</strong></li>
            <li>3 Balotas limpias (3 + 0): <strong>{simulacionResultados.aciertos3_0} veces</strong></li>
            <li>4 Balotas limpias (4 + 0): <strong>{simulacionResultados.aciertos4_0} veces</strong></li>
            <li style={{ color: '#27ae60', fontWeight: 'bold', marginTop: '5px' }}>¡GRAN ACUMULADO! (5 + SB): {simulacionResultados.granPremio > 0 ? `🎉 ¡SÍ! ${simulacionResultados.granPremio} veces` : '0 veces'}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

