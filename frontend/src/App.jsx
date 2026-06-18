import { useState, useRef } from 'react';
import './App.css'; 
import { HistorialSorteos } from './components/HistorialSorteos'; 
import { AnaliticaSorteos } from './components/AnaliticaSorteos';
import { AnaliticaFrios } from './components/AnaliticaFrios';
import { AnaliticaSB } from './components/AnaliticaSB';

function App() {
  const [formData, setFormData] = useState({
    fecha: '',
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

  // NUEVO: Estado global para saber qué estadísticas estamos viendo
  const [filtro, setFiltro] = useState('Todos');

  const refB1 = useRef(null);
  const refB2 = useRef(null);
  const refB3 = useRef(null);
  const refB4 = useRef(null);
  const refB5 = useRef(null);
  const refSB = useRef(null);
  const refBoton = useRef(null);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });

  //   if (value.length >= 1) {
  //     const num = parseInt(value);
  //     if (value.length === 2 || num >= 4) {
  //       if (name === 'b1') refB2.current.focus();
  //       if (name === 'b2') refB3.current.focus();
  //       if (name === 'b3') refB4.current.focus();
  //       if (name === 'b4') refB5.current.focus();
  //       if (name === 'b5') refSB.current.focus();
  //     }
  //   }
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // LÓGICA DE SALTO AUTOMÁTICO PERFECCIONADA
    if (value.length >= 1) {
      const num = parseInt(value);
      
      // REGLA: Salta si tiene 2 dígitos O si es un número del 5 al 9.
      // El 4 ya no salta solo, esperando a que decidas si es un 4 o un 40, 41, 42, 43.
      if (value.length === 2 || (num >= 5 && num <= 9)) {
        if (name === 'b1') refB2.current.focus();
        if (name === 'b2') refB3.current.focus();
        if (name === 'b3') refB4.current.focus();
        if (name === 'b4') refB5.current.focus();
        if (name === 'b5') refSB.current.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    const datosAEnviar = {
      fecha: formData.fecha,
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
        setFormData({ fecha: '', tipo: formData.tipo, b1: '', b2: '', b3: '', b4: '', b5: '', sb: '' });
        
        setTimeout(() => {
          const inputFecha = document.getElementsByName('fecha')[0];
          if (inputFecha) inputFecha.focus();
        }, 50);

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
          <label style={{ display: 'block', marginBottom: '5px' }}>Fecha del Sorteo:</label>
          <input type="date" name="fecha" required value={formData.fecha} onChange={handleChange} style={{ width: '96%', padding: '8px', fontFamily: 'inherit' }} />
        </div>

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
            <input type="number" name="b1" min="1" max="43" required ref={refB1} value={formData.b1} onChange={handleChange} style={{ width: '50px', padding: '8px', textAlign: 'center' }} />
            <input type="number" name="b2" min="1" max="43" required ref={refB2} value={formData.b2} onChange={handleChange} style={{ width: '50px', padding: '8px', textAlign: 'center' }} />
            <input type="number" name="b3" min="1" max="43" required ref={refB3} value={formData.b3} onChange={handleChange} style={{ width: '50px', padding: '8px', textAlign: 'center' }} />
            <input type="number" name="b4" min="1" max="43" required ref={refB4} value={formData.b4} onChange={handleChange} style={{ width: '50px', padding: '8px', textAlign: 'center' }} />
            <input type="number" name="b5" min="1" max="43" required ref={refB5} value={formData.b5} onChange={handleChange} style={{ width: '50px', padding: '8px', textAlign: 'center' }} />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Súper Balota (1 al 16):</label>
          <input type="number" name="sb" min="1" max="16" required ref={refSB} value={formData.sb} onChange={handleChange} style={{ width: '60px', padding: '8px', textAlign: 'center', border: '2px solid #e74c3c', borderRadius: '4px' }} />
        </div>

        <button type="submit" ref={refBoton} style={{ width: '100%', padding: '10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
          Guardar Sorteo
        </button>
      </form>

      {/* HISTORIAL GENERAL */}
      <HistorialSorteos nuevoSorteoAgregado={actualizarHistorial} />
      
      <hr style={{ margin: '40px 0 20px 0', border: '0', borderTop: '2px dashed #ccc' }} />

      {/* NUEVO: BARRA DE FILTROS PARA ANALÍTICA */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <h3>📊 Filtro Estadístico</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          {['Todos', 'Tradicional', 'Revancha'].map((opcion) => (
            <button
              key={opcion}
              onClick={() => setFiltro(opcion)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid #34495e',
                cursor: 'pointer',
                fontWeight: 'bold',
                backgroundColor: filtro === opcion ? '#34495e' : 'white',
                color: filtro === opcion ? 'white' : '#34495e',
                transition: 'all 0.2s ease'
              }}
            >
              {opcion}
            </button>
          ))}
        </div>
      </div>

      {/* PASAMOS EL FILTRO COMO PROP A CADA COMPONENTE */}
      <AnaliticaSorteos nuevoSorteoAgregado={actualizarHistorial} filtro={filtro} />
      <AnaliticaFrios nuevoSorteoAgregado={actualizarHistorial} filtro={filtro} />
      <AnaliticaSB nuevoSorteoAgregado={actualizarHistorial} filtro={filtro} />
      
    </div>
  );
}

export default App;