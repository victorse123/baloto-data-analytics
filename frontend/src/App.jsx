import { useState } from 'react';
import './App.css'; 
import { HistorialSorteos } from './components/HistorialSorteos'; 
import { AnaliticaSorteos } from './components/AnaliticaSorteos';
import { AnaliticaFrios } from './components/AnaliticaFrios';
import { AnaliticaSB } from './components/AnaliticaSB'; // <-- 1. IMPORTAMOS LA ANALÍTICA DE LA SÚPER BALOTA

function App() {
  const [formData, setFormData] = useState({
    tipo: 'Tradicional',
    b1: '',
    b2: '',
    b3: '',
    b4: '',
    b5: '',
    sb: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [actualizarHistorial, setActualizarHistorial] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

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
      const respuesta = await fetch('http://localhost:5000/api/sorteos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosAEnviar)
      });

      const resultado = await respuesta.json();

      if (respuesta.ok) {
        setMensaje(`✅ ${resultado.mensaje}`);
        setActualizarHistorial(prev => !prev);
        setFormData({ tipo: 'Tradicional', b1: '', b2: '', b3: '', b4: '', b5: '', sb: '' });
      } else {
        setError(`❌ Error: ${resultado.error}`);
      }
    } catch (err) {
      console.error(err);
      setError('❌ No se pudo conectar con el servidor backend.');
    }
  };

  return (
    <div className="container" style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Registrar Sorteo Baloto</h2>
      
      {mensaje && <div style={{ color: 'green', marginBottom: '15px', fontWeight: 'bold' }}>{mensaje}</div>}
      {error && <div style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Tipo de Sorteo:</label>
          <select name="tipo" value={formData.tipo} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
            <option value="Tradicional">Tradicional</option>
            <option value="Revancha">Revancha</option>
          </select>
        </div>

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

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Súper Balota (1 al 16):</label>
          <input type="number" name="sb" min="1" max="16" required value={formData.sb} onChange={handleChange} style={{ width: '60px', padding: '8px', textAlign: 'center', border: '2px solid #e74c3c', borderRadius: '4px' }} />
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
          Guardar Sorteo
        </button>
      </form>

      {/* HISTORIAL */}
      <HistorialSorteos nuevoSorteoAgregado={actualizarHistorial} />
      
      {/* NÚMEROS CALIENTES 🔥 */}
      <AnaliticaSorteos nuevoSorteoAgregado={actualizarHistorial} />

      {/* NÚMEROS FRÍOS ❄️ */}
      <AnaliticaFrios nuevoSorteoAgregado={actualizarHistorial} />

      {/* SÚPER BALOTA 🔴 */}
      <AnaliticaSB nuevoSorteoAgregado={actualizarHistorial} />
      
    </div>
  );
}

export default App;