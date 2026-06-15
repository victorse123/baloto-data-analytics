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

// // ========================================================
// // RUTA POST: Para guardar un nuevo sorteo en la base de datos
// // ========================================================
// app.post('/api/sorteos', async (req, res) => {
//   // Desestructuramos los datos que vendrán desde el formulario de React
//   const { tipo, b1, b2, b3, b4, b5, sb } = req.body;

//   // Validación rápida: Asegurarnos de que no falte ningún dato
//   if (!tipo || !b1 || !b2 || !b3 || !b4 || !b5 || !sb) {
//     return res.status(400).json({ error: "Faltan datos obligatorios del sorteo." });
//   }

//   try {
//     // Consulta SQL con parámetros ($1, $2...) para evitar hackeos (SQL Injection)
//     const queryText = `
//       INSERT INTO sorteos (tipo, b1, b2, b3, b4, b5, sb) 
//       VALUES ($1, $2, $3, $4, $5, $6, $7) 
//       RETURNING *;
//     `;
//     const values = [tipo, b1, b2, b3, b4, b5, sb];
    
//     // Ejecutamos la consulta en Supabase
//     const resultado = await pool.query(queryText, values);
    
//     // Si todo sale bien, respondemos al frontend con el registro guardado
//     res.status(201).json({
//       mensaje: "¡Sorteo guardado con éxito en Supabase!",
//       sorteo: resultado.rows[0]
//     });

//   } catch (error) {
//     console.error("❌ Error al insertar en la base de datos:", error);
//     res.status(500).json({ error: "Error interno del servidor al guardar el sorteo." });
//   }
// });

// MODIFICADO: Guardar un sorteo incluyendo la fecha
app.post('/api/sorteos', async (req, res) => {
  try {
    // 1. Recibimos la fecha junto a las balotas desde el frontend
    const { tipo, b1, b2, b3, b4, b5, sb, fecha } = req.body;

    // Validación simple por si acaso
    if (!fecha) {
      return res.status(400).json({ error: 'La fecha es obligatoria' });
    }

    // 2. Agregamos 'fecha' tanto en las columnas como en los VALUES ($8)
    const consulta = `
      INSERT INTO sorteos (tipo, b1, b2, b3, b4, b5, sb, fecha) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *
    `;
    
    // El orden de los elementos en este arreglo debe coincidir exactamente con los $1, $2...
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

// Ruta de prueba básica para verificar que el backend responda
// app.get('/', (req, res) => {
//   res.send('Servidor de Baloto Analytics corriendo y conectado.');
// });

// NUEVA RUTA: Obtener todos los sorteos guardados
// app.get('/api/sorteos', async (req, res) => {
//   try {
//     // Hacemos una consulta SQL para traer los sorteos ordenados por el más reciente
//     const resultado = await pool.query('SELECT * FROM sorteos ORDER BY id DESC');
    
//     // Le respondemos al frontend con la lista de sorteos en formato JSON
//     res.json(resultado.rows);
//   } catch (error) {
//     console.error('Error al obtener los sorteos:', error);
//     res.status(500).json({ error: 'Error interno del servidor al consultar los datos' });
//   }
// });

app.get('/api/sorteos', async (req, res) => {
  try {
    // Ordenamos por fecha de forma descendente (el más nuevo primero)
    const resultado = await pool.query('SELECT id, tipo, b1, b2, b3, b4, b5, sb, fecha FROM sorteos ORDER BY fecha DESC, id DESC');
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener sorteos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// NUEVA RUTA: Calcular la frecuencia de los números calientes
app.get('/api/analitica/frecuencias', async (req, res) => {
  try {
    // 1. Traemos todos los sorteos de la base de datos
    const resultado = await pool.query('SELECT b1, b2, b3, b4, b5 FROM sorteos');
    const sorteos = resultado.rows;

    // 2. Creamos un objeto para llevar el conteo (del 1 al 43)
    // Inicializamos todos los números en 0 apariciones
    const conteo = {};
    for (let i = 1; i <= 43; i++) {
      conteo[i] = 0;
    }

    // 3. Recorremos cada sorteo y sumamos las apariciones de cada balota
    sorteos.forEach(sorteo => {
      if (sorteo.b1) conteo[sorteo.b1]++;
      if (sorteo.b2) conteo[sorteo.b2]++;
      if (sorteo.b3) conteo[sorteo.b3]++;
      if (sorteo.b4) conteo[sorteo.b4]++;
      if (sorteo.b5) conteo[sorteo.b5]++;
    });

    // 4. Convertimos el objeto en una lista ordenada de mayor a menor frecuencia
    const frecuenciasOrdenadas = Object.keys(conteo)
      .map(numero => ({
        numero: parseInt(numero),
        frecuencia: conteo[numero]
      }))
      .sort((a, b) => b.frecuencia - a.frecuencia); // Ordena de mayor a menor

    // 5. Enviamos el resultado al frontend
    res.json(frecuenciasOrdenadas);

  } catch (error) {
    console.error('Error al calcular frecuencias:', error);
    res.status(500).json({ error: 'Error interno al procesar la analítica' });
  }
});

// NUEVA RUTA: Calcular los números fríos (ausencias consecutivas)
app.get('/api/analitica/frios', async (req, res) => {
  try {
    // 1. Traemos todos los sorteos ordenados del más reciente al más antiguo
    // (Asumiendo que tienes una columna 'id' autoincremental o 'fecha')
    const resultado = await pool.query('SELECT b1, b2, b3, b4, b5 FROM sorteos ORDER BY fecha DESC');
    const sorteos = resultado.rows;

    // 2. Creamos el mapa para registrar cuántos sorteos llevan sin salir
    const ausencias = {};
    for (let i = 1; i <= 43; i++) {
      ausencias[i] = 0;
    }

    // Conjunto para marcar los números que YA encontramos en el viaje hacia atrás
    const encontrados = new Set();

    // 3. Recorremos los sorteos desde el más nuevo hacia el pasado
    sorteos.forEach((sorteo, index) => {
      const numerosDelSorteo = [sorteo.b1, sorteo.b2, sorteo.b3, sorteo.b4, sorteo.b5];

      for (let i = 1; i <= 43; i++) {
        // Si el número NO está en este sorteo y TAMPOCO ha salido en los más nuevos...
        if (!numerosDelSorteo.includes(i) && !encontrados.has(i)) {
          ausencias[i]++;
        } else if (numerosDelSorteo.includes(i)) {
          // Si el número sale en este sorteo, lo marcamos como encontrado
          // para que no siga sumando ausencias en sorteos más viejos
          encontrados.add(i);
        }
      }
    });

    // 4. Convertimos a un arreglo ordenado de MAYOR a MENOR ausencia
    const friosOrdenados = Object.keys(ausencias)
      .map(numero => ({
        numero: parseInt(numero),
        ausencias: ausencias[numero]
      }))
      .sort((a, b) => b.ausencias - a.ausencias); // Los que más llevan sin salir van primero

    res.json(friosOrdenados);

  } catch (error) {
    console.error('Error al calcular números fríos:', error);
    res.status(500).json({ error: 'Error al procesar los números fríos' });
  }
});

// NUEVA RUTA: Calcular la frecuencia de la Súper Balota (SB)
app.get('/api/analitica/superbalota', async (req, res) => {
  try {
    // 1. Traemos solo la columna sb de la base de datos
    const resultado = await pool.query('SELECT sb FROM sorteos');
    const sorteos = resultado.rows;

    // 2. Creamos el contador exclusivo del 1 al 16
    const conteoSB = {};
    for (let i = 1; i <= 16; i++) {
      conteoSB[i] = 0;
    }

    // 3. Contamos las apariciones de la Súper Balota
    sorteos.forEach(sorteo => {
      if (sorteo.sb) {
        conteoSB[sorteo.sb]++;
      }
    });

    // 4. Convertimos a un arreglo ordenado de mayor a menor frecuencia
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

// El puerto ahora lo lee del .env (5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
});