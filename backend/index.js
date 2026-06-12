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

// ========================================================
// RUTA POST: Para guardar un nuevo sorteo en la base de datos
// ========================================================
app.post('/api/sorteos', async (req, res) => {
  // Desestructuramos los datos que vendrán desde el formulario de React
  const { tipo, b1, b2, b3, b4, b5, sb } = req.body;

  // Validación rápida: Asegurarnos de que no falte ningún dato
  if (!tipo || !b1 || !b2 || !b3 || !b4 || !b5 || !sb) {
    return res.status(400).json({ error: "Faltan datos obligatorios del sorteo." });
  }

  try {
    // Consulta SQL con parámetros ($1, $2...) para evitar hackeos (SQL Injection)
    const queryText = `
      INSERT INTO sorteos (tipo, b1, b2, b3, b4, b5, sb) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *;
    `;
    const values = [tipo, b1, b2, b3, b4, b5, sb];
    
    // Ejecutamos la consulta en Supabase
    const resultado = await pool.query(queryText, values);
    
    // Si todo sale bien, respondemos al frontend con el registro guardado
    res.status(201).json({
      mensaje: "¡Sorteo guardado con éxito en Supabase!",
      sorteo: resultado.rows[0]
    });

  } catch (error) {
    console.error("❌ Error al insertar en la base de datos:", error);
    res.status(500).json({ error: "Error interno del servidor al guardar el sorteo." });
  }
});

// Ruta de prueba básica para verificar que el backend responda
// app.get('/', (req, res) => {
//   res.send('Servidor de Baloto Analytics corriendo y conectado.');
// });

// NUEVA RUTA: Obtener todos los sorteos guardados
app.get('/api/sorteos', async (req, res) => {
  try {
    // Hacemos una consulta SQL para traer los sorteos ordenados por el más reciente
    const resultado = await pool.query('SELECT * FROM sorteos ORDER BY id DESC');
    
    // Le respondemos al frontend con la lista de sorteos en formato JSON
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener los sorteos:', error);
    res.status(500).json({ error: 'Error interno del servidor al consultar los datos' });
  }
});

// El puerto ahora lo lee del .env (5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
});