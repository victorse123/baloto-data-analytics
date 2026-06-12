import { useState } from 'react';
import './App.css'; // O los estilos que ya tengas
import { HistorialSorteos } from './components/HistorialSorteos'; // <-- IMPORTAMOS EL COMPONENTE

function App() {
  // 1. Estado para controlar los campos del formulario
  const [formData, setFormData] = useState({
    tipo: 'Tradicional',
    b1: '',
    b2: '',
    b3: '',
    b4: '',
    b5: '',
    sb: ''
  });

  // Estados para manejar mensajes de éxito o error en la pantalla
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // SENSOR DE AUTO-REFRESCO: Estado para avisarle al historial que se guardó un sorteo
  const [actualizarHistorial, setActualizarHistorial] = useState(false);

  // 2. Función para actualizar el estado cuando el usuario escribe
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 3. Función para enviar los datos al backend al hacer clic en "Guardar"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    // Convertimos las balotas a números enteros antes de enviarlas
    const datosAEnviar = {
      tipo: formData.tipo,
      b1: parseInt(formData.b1),
      b2: parseInt(formData.b2),
      b3: parseInt(formData.b3),
      b4: parseInt(formData.b4),
      b5: parseInt(formData.b5),
      sb: parseInt(formData.sb)
    };

    try {
      // Hacemos la petición POST a nuestro servidor Node.js (Puerto 5000)
      const respuesta = await fetch('http://localhost:5000/api/sorteos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosAEnviar)
      });

      const resultado = await respuesta.json();

      if (respuesta.ok) {
        setMensaje(`✅ ${resultado.mensaje}`);
        
        // ¡ACTUALIZAMOS EL HISTORIAL ACÁ! Cambiamos el switch para forzar el re-render
        setActualizarHistorial(prev => !prev);

        // Limpiamos los campos de los números tras guardar con éxito
        setFormData({
          tipo: 'Tradicional',
          b1: '',
          b2: '',
          b3: '',
          b4: '',
          b5: '',
          sb: ''
        });
      } else {
        setError(`❌ Error: ${resultado.error}`);
      }
    } catch (err) {
      console.error(err);
      setError('❌ No se pudo conectar con el servidor backend. ¿Está encendido?');
    }
  };

  return (
    <div className="container" style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Registrar Sorteo Baloto</h2>
      
      {/* Alertas en pantalla */}
      {mensaje && <div style={{ color: 'green', marginBottom: '15px', fontWeight: 'bold' }}>{mensaje}</div>}
      {error && <div style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Selector de Tipo */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Tipo de Sorteo:</label>
          <select name="tipo" value={formData.tipo} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
            <option value="Tradicional">Tradicional</option>
            <option value="Revancha">Revancha</option>
          </select>
        </div>

        {/* Fila de Balotas */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Balotas (1 al 43):</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="number" name="b1" min="1" max="43" required value={formData.b1} onChange={handleChange} style={{ width: '50px', padding: '8px', textAlign: 'center' }} />
            <input type="number" name="b2" min="1" max="43" required value={formData.b2} onChange={handleChange} style={{ width: '50px', padding: '8px', textAlign: 'center' }} />
            <input type="number" name="b3" min="1" max="43" required value={formData.b3} onChange={handleChange} style={{ width: '50px', padding: '8px', textAlign: 'center' }} />
            <input type="number" name="b4" min="1" max="43" required value={formData.b4} onChange={handleChange} style={{ width: '50px', padding: '8px', textAlign: 'center' }} />
            <input type="number" name="b5" min="1" max="43" required value={formData.b5} onChange={handleChange} style={{ width: '50px', padding: '8px', textAlign: 'center' }} />
          </div>
        </div>

        {/* Súper Balota */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Súper Balota (1 al 16):</label>
          <input type="number" name="sb" min="1" max="16" required value={formData.sb} onChange={handleChange} style={{ width: '60px', padding: '8px', textAlign: 'center', border: '2px solid #e74c3c', borderRadius: '4px' }} />
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
          Guardar Sorteo
        </button>
      </form>

      {/* RENDERIZAMOS EL HISTORIAL ABAJO DEL FORMULARIO */}
      {/* Le pasamos el estado como prop para que sepa cuándo disparar el useEffect */}
      <HistorialSorteos nuevoSorteoAgregado={actualizarHistorial} />
      
    </div>
  );
}

export default App;