// const express = require('express');
// const cors = require('cors');
// const app = express();
// const PORT = 5000;

// app.use(cors()); //PARA CONECTAR A REACT
// app.use(express.json());

// // Este es el endpoint de Hola mundo
// // app.get('/api/saludo', (req, res) => {
// //     res.json({ mensaje: "¡Hola Mundo desde el servidor de node! Estas de Vuelta."});
// // });

// app.listen(PORT, () => {
//     console.log(`servidor corriendo en http://localhost:${PORT}`);
// });



// const historicoBaloto = [
//     {
//         id: 1,
//         fecha: "2026-06-06",
//         tipo: "Tradicional",
//         numeros: [5, 15, 19, 28, 32],
//         superBalota: 1
//     },
//     {
//         id: 2,
//         fecha: "2026-06-06",
//         tipo: "Revancha",
//         numeros: [7, 11, 25, 32, 36],
//         superBalota: 8
//     },
//     {
//         id: 3,
//         fecha: "2026-06-03",
//         tipo: "Tradicional",
//         numeros: [12, 18, 22, 31, 40],
//         superBalota: 5
//     }
// ];

// // Endpoint para el historial
// app.get('/api/baloto/historico', (req, res) => {
//     res.json(historicoBaloto);
// });


const express = require('express');
const { Pool } = require('pg'); // Importamos las herramientas de SQL
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la conexión a la Base de Datos
// (Por ahora usamos una base de datos local o de prueba)
const pool = new Pool({
  user: 'postgres',          // Tu usuario de PostgreSQL
  host: 'localhost',         // Tu servidor local
  database: 'baloto_db',     // El nombre de la base de datos
  password: 'tu_contraseña', // Tu contraseña de Postgres
  port: 5432,                // Puerto por defecto de Postgres
});

// Probar la conexión al arrancar el servidor
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Error conectando a la base de datos SQL:', err.stack);
  }
  console.log('✨ ¡Conexión exitosa a la base de datos PostgreSQL!');
  release();
});