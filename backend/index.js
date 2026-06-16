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

// MODIFICADO: Calcular frecuencias con filtro opcional (?tipo=Tradicional o ?tipo=Revancha)
app.get('/api/analitica/frecuencias', async (req, res) => {
  try {
    const { tipo } = req.query; // Leemos el parámetro de la URL
    
    let consulta = 'SELECT b1, b2, b3, b4, b5 FROM sorteos';
    let valores = [];

    // Si viene un tipo específico y no es 'Todos', inyectamos el filtro SQL
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

// MODIFICADO: Calcular números fríos con filtro opcional
app.get('/api/analitica/frios', async (req, res) => {
  try {
    const { tipo } = req.query;

    let consulta = 'SELECT b1, b2, b3, b4, b5 FROM sorteos';
    let valores = [];

    if (tipo && tipo !== 'Todos') {
      consulta += ' WHERE tipo = $1';
      valores.push(tipo);
    }

    // Mantenemos el orden cronológico real para calcular las ausencias hacia atrás
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

// MODIFICADO: Calcular frecuencia de la Súper Balota con filtro opcional
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
});
