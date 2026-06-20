require('dotenv').config(); 
const express = require('express');
const { Pool } = require('pg'); 
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración segura conectada a Supabase (usando las variables del .env)
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false // Requerido para conexiones seguras en la nube
  },
  connectionTimeoutMillis: 5000, // Tiempo de espera para evitar bloqueos
});

// Probar la conexión con Supabase al arrancar el servidor
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Error conectando a la base de datos SQL en Supabase:', err.stack);
  }
  console.log('✨ ¡Conexión exitosa a la base de datos PostgreSQL en Supabase!');
  release();
});


// GUARDAR UN SORTEO (Incluyendo la fecha)
app.post('/api/sorteos', async (req, res) => {
  try {
    const { tipo, b1, b2, b3, b4, b5, sb, fecha } = req.body;

    if (!fecha) {
      return res.status(400).json({ error: 'La fecha es obligatoria' });
    }

    const consulta = `
      INSERT INTO sorteos (tipo, b1, b2, b3, b4, b5, sb, fecha) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *
    `;
    
    const valores = [tipo, b1, b2, b3, b4, b5, sb, fecha];
    const nuevoSorteo = await pool.query(consulta, valores);

    res.json({ 
      mensaje: 'Sorteo registrado con éxito en la base de datos', 
      sorteo: nuevoSorteo.rows[0] 
    });

  } catch (error) {
    console.error('Error al insertar sorteo:', error);
    res.status(500).json({ error: 'Error interno del servidor al guardar' });
  }
});

// OBTENER HISTORIAL DE SORTEOS
app.get('/api/sorteos', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT id, tipo, b1, b2, b3, b4, b5, sb, fecha FROM sorteos ORDER BY fecha DESC, id DESC');
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener sorteos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Calcular frecuencias con filtro opcional (?tipo=Tradicional o ?tipo=Revancha)
app.get('/api/analitica/frecuencias', async (req, res) => {
  try {
    const { tipo } = req.query; 
    
    let consulta = 'SELECT b1, b2, b3, b4, b5 FROM sorteos';
    let valores = [];

    if (tipo && tipo !== 'Todos') {
      consulta += ' WHERE tipo = $1';
      valores.push(tipo);
    }

    const resultado = await pool.query(consulta, valores);
    const sorteos = resultado.rows;

    const conteo = {};
    for (let i = 1; i <= 43; i++) {
      conteo[i] = 0;
    }

    sorteos.forEach(sorteo => {
      if (sorteo.b1) conteo[sorteo.b1]++;
      if (sorteo.b2) conteo[sorteo.b2]++;
      if (sorteo.b3) conteo[sorteo.b3]++;
      if (sorteo.b4) conteo[sorteo.b4]++;
      if (sorteo.b5) conteo[sorteo.b5]++;
    });

    const frecuenciasOrdenadas = Object.keys(conteo)
      .map(numero => ({
        numero: parseInt(numero),
        frecuencia: conteo[numero]
      }))
      .sort((a, b) => b.frecuencia - a.frecuencia);

    res.json(frecuenciasOrdenadas);

  } catch (error) {
    console.error('Error al calcular frecuencias:', error);
    res.status(500).json({ error: 'Error interno al procesar la analítica' });
  }
});

// Calcular números fríos con filtro opcional
app.get('/api/analitica/frios', async (req, res) => {
  try {
    const { tipo } = req.query;

    let consulta = 'SELECT b1, b2, b3, b4, b5 FROM sorteos';
    let valores = [];

    if (tipo && tipo !== 'Todos') {
      consulta += ' WHERE tipo = $1';
      valores.push(tipo);
    }

    consulta += ' ORDER BY fecha DESC, id DESC';

    const resultado = await pool.query(consulta, valores);
    const sorteos = resultado.rows;

    const ausencias = {};
    for (let i = 1; i <= 43; i++) {
      ausencias[i] = 0;
    }

    const encontrados = new Set();

    sorteos.forEach((sorteo) => {
      const numerosDelSorteo = [sorteo.b1, sorteo.b2, sorteo.b3, sorteo.b4, sorteo.b5];

      for (let i = 1; i <= 43; i++) {
        if (!numerosDelSorteo.includes(i) && !encontrados.has(i)) {
          ausencias[i]++;
        } else if (numerosDelSorteo.includes(i)) {
          encontrados.add(i);
        }
      }
    });

    const friosOrdenados = Object.keys(ausencias)
      .map(numero => ({
        numero: parseInt(numero),
        ausencias: ausencias[numero]
      }))
      .sort((a, b) => b.ausencias - a.ausencias);

    res.json(friosOrdenados);

  } catch (error) {
    console.error('Error al calcular números fríos:', error);
    res.status(500).json({ error: 'Error al procesar los números fríos' });
  }
});

// Calcular frecuencia de la Súper Balota con filtro opcional
app.get('/api/analitica/superbalota', async (req, res) => {
  try {
    const { tipo } = req.query;

    let consulta = 'SELECT sb FROM sorteos';
    let valores = [];

    if (tipo && tipo !== 'Todos') {
      consulta += ' WHERE tipo = $1';
      valores.push(tipo);
    }

    const resultado = await pool.query(consulta, valores);
    const sorteos = resultado.rows;

    const conteoSB = {};
    for (let i = 1; i <= 16; i++) {
      conteoSB[i] = 0;
    }

    sorteos.forEach(sorteo => {
      if (sorteo.sb) {
        conteoSB[sorteo.sb]++;
      }
    });

    const frecuenciasSB = Object.keys(conteoSB)
      .map(numero => ({
        numero: parseInt(numero),
        frecuencia: conteoSB[numero]
      }))
      .sort((a, b) => b.frecuencia - a.frecuencia);

    res.json(frecuenciasSB);

  } catch (error) {
    console.error('Error al calcular analítica de SB:', error);
    res.status(500).json({ error: 'Error al procesar la analítica de Súper Balota' });
  }
});

// =========================================================================
// NUEVO: ENDPOINT CONECTADO A SUPABASE PARA ALIMENTAR EL EMULADOR EN VIVO (OPTIMIZADO FRÍOS)
// =========================================================================
app.get('/api/estadisticas-emulador', async (req, res) => {
  try {
    const { tipo } = req.query;
    const tipoFiltrado = (tipo && tipo !== 'Todos') ? tipo : 'Tradicional';

    const consultaSorteos = 'SELECT b1, b2, b3, b4, b5, sb FROM sorteos WHERE tipo = $1';
    const resultado = await pool.query(consultaSorteos, [tipoFiltrado]);
    const sorteos = resultado.rows;

    const respaldoCalientes = [7, 15, 22, 29, 31, 38, 41, 42, 43, 4, 12, 18, 25, 34];
    const respaldoFrios = [3, 9, 14, 21, 26, 33, 40, 1, 5, 11, 19, 27, 30, 36];
    const respaldoSBCalientes = [1, 7, 10, 16];
    const respaldoSBFrias = [4, 8, 12, 15];

    if (!sorteos || sorteos.length === 0) {
      return res.json({ 
        calientes: respaldoCalientes, 
        frios: respaldoFrios, 
        sbCalientes: respaldoSBCalientes, 
        sbFrias: respaldoSBFrias 
      });
    }

    const conteoBalotas = {};
    const conteoSB = {};
    for (let i = 1; i <= 43; i++) conteoBalotas[i] = 0;
    for (let i = 1; i <= 16; i++) conteoSB[i] = 0;

    sorteos.forEach(sorteo => {
      if (sorteo.b1) conteoBalotas[sorteo.b1]++;
      if (sorteo.b2) conteoBalotas[sorteo.b2]++;
      if (sorteo.b3) conteoBalotas[sorteo.b3]++;
      if (sorteo.b4) conteoBalotas[sorteo.b4]++;
      if (sorteo.b5) conteoBalotas[sorteo.b5]++;
      if (sorteo.sb) conteoSB[sorteo.sb]++;
    });

    // --- CORRECCIÓN DE ORDENAMIENTO EN FRÍOS ---
    // 1. Para Calientes: Ordenar de MAYOR a MENOR frecuencia
    const balotasParaCalientes = Object.keys(conteoBalotas)
      .map(num => ({ numero: parseInt(num), frecuencia: conteoBalotas[num] }))
      .sort((a, b) => b.frecuencia - a.frecuencia);

    const sbParaCalientes = Object.keys(conteoSB)
      .map(num => ({ numero: parseInt(num), frecuencia: conteoSB[num] }))
      .sort((a, b) => b.frecuencia - a.frecuencia);

    // 2. Para Frías: Ordenar de MENOR a MAYOR frecuencia (Los 7 ceros e historiales bajos quedan al principio)
    const balotasParaFrios = Object.keys(conteoBalotas)
      .map(num => ({ numero: parseInt(num), frecuencia: conteoBalotas[num] }))
      .sort((a, b) => a.frecuencia - b.frecuencia);

    const sbParaFrios = Object.keys(conteoSB)
      .map(num => ({ numero: parseInt(num), frecuencia: conteoSB[num] }))
      .sort((a, b) => a.frecuencia - b.frecuencia);

    // 3. Extraer los arreglos base tomando los primeros de cada lista correspondiente
    let calientes = balotasParaCalientes.slice(0, 14).map(b => b.numero);
    let frios = balotasParaFrios.slice(0, 14).map(b => b.numero);
    let sbCalientes = sbParaCalientes.slice(0, 4).map(s => s.numero);
    let sbFrias = sbParaFrios.slice(0, 4).map(s => s.numero);

    // Rellenos estratégicos sin duplicados
    respaldoCalientes.forEach(num => {
      if (!calientes.includes(num) && calientes.length < 14) calientes.push(num);
    });

    respaldoFrios.forEach(num => {
      if (!frios.includes(num) && frios.length < 14) frios.push(num);
    });

    respaldoSBCalientes.forEach(num => {
      if (!sbCalientes.includes(num) && sbCalientes.length < 4) sbCalientes.push(num);
    });

    respaldoSBFrias.forEach(num => {
      if (!sbFrias.includes(num) && sbFrias.length < 4) sbFrias.push(num);
    });

    res.json({ calientes, frios, sbCalientes, sbFrias });

  } catch (error) {
    console.error('Error al calcular estadísticas para el emulador:', error);
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
});

// --- APERTURA DEL PUERTO (LISTEN) ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
});

// --- CONGELADOR DE ERRORES CRÍTICOS ---
process.on('uncaughtException', (err) => {
  console.log("\n=======================================================");
  console.log("🛑 ¡CAPTURADO ERROR CRÍTICO ANTES DE QUE SE CAIGA!");
  console.log("Mensaje del error:", err.message);
  console.log("Línea exacta del fallo:\n", err.stack);
  console.log("=======================================================\n");
});

process.on('unhandledRejection', (reason, promise) => {
  console.log("\n=======================================================");
  console.log("🛑 ¡PROMESA ROTA DETECTADA!");
  console.log("Razón del fallo:", reason);
  console.log("=======================================================\n");
});