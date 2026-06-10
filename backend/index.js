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

// Ruta de prueba básica para verificar que el backend responda
app.get('/', (req, res) => {
  res.send('Servidor de Baloto Analytics corriendo y conectado.');
});

// El puerto ahora lo lee del .env (5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
});