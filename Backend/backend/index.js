const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors()); //PARA CONECTAR A REACT
app.use(express.json());

// Este es el endpoint de Hola mundo
app.get('/api/saludo', (req, res) => {
    res.json({ mensaje: "¡Hola Mundo desde el servidor de node! Estas de Vuelta."});
});

app.listen(PORT, () => {
    console.log(`servidor corriendo en http://localhost:${PORT}`);
});

