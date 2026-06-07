const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors()); //PARA CONECTAR A REACT
app.use(express.json());

// Este es el endpoint de Hola mundo
// app.get('/api/saludo', (req, res) => {
//     res.json({ mensaje: "¡Hola Mundo desde el servidor de node! Estas de Vuelta."});
// });

app.listen(PORT, () => {
    console.log(`servidor corriendo en http://localhost:${PORT}`);
});



const historicoBaloto = [
    {
        id: 1,
        fecha: "2026-06-06",
        tipo: "Tradicional",
        numeros: [5, 15, 19, 28, 32],
        superBalota: 1
    },
    {
        id: 2,
        fecha: "2026-06-06",
        tipo: "Revancha",
        numeros: [7, 11, 25, 32, 36],
        superBalota: 8
    },
    {
        id: 3,
        fecha: "2026-06-03",
        tipo: "Tradicional",
        numeros: [12, 18, 22, 31, 40],
        superBalota: 5
    }
];

// Endpoint para el historial
app.get('/api/baloto/historico', (req, res) => {
    res.json(historicoBaloto);
});