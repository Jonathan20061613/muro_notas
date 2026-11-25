import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:3000/api/notas';
const COLORES_POSTIT = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#fed7aa'];

function App() {
  const [notas, setNotas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [color, setColor] = useState(COLORES_POSTIT[0]);
  const [notaEditandoId, setNotaEditandoId] = useState(null);

  const cargarNotas = async () => {
    try {
      const respuesta = await fetch(API_URL);
      const datos = await respuesta.json();
      setNotas(datos);
    } catch (error) {
      console.error('Error al cargar notas:', error);
    }
  };

  useEffect(() => {
    cargarNotas();
  }, []);

  const limpiarFormulario = () => {
    setNotaEditandoId(null);
    setTitulo('');
    setContenido('');
    setColor(COLORES_POSTIT[0]);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || !contenido.trim()) return;

    const datosNota = { titulo, contenido, color };

    try {
      if (notaEditandoId) {
        await fetch(`${API_URL}/${notaEditandoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datosNota),
        });
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datosNota),
        });
      }

      limpiarFormulario();
      cargarNotas();
    } catch (error) {
      console.error('Error al guardar la nota:', error);
    }
  };

  const eliminarNota = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      cargarNotas();
    } catch (error) {
      console.error('Error al eliminar la nota:', error);
    }
  };

  const prepararEdicion = (nota) => {
    setNotaEditandoId(nota.id);
    setTitulo(nota.titulo);
    setContenido(nota.contenido);
    setColor(nota.color);
  };

  return (
    <div className="contenedor">
      <h1>Muro de Notas Rápidas</h1>

      <form className="formulario-nota" onSubmit={manejarEnvio}>
        <input
          type="text"
          placeholder="Título de la nota..."
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <textarea
          placeholder="Escribe tu nota aquí..."
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          required
        />

        <div className="controles-inferiores">
          <div className="selector-colores">
            {COLORES_POSTIT.map((c) => (
              <div
                key={c}
                className={`circulo-color ${color === c ? 'activo' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>

          <div className="botones-form">
            {notaEditandoId && (
              <button type="button" className="btn-cancelar" onClick={limpiarFormulario}>
                Cancelar
              </button>
            )}
            <button type="submit" className="btn-guardar">
              {notaEditandoId ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </div>
      </form>

      <div className="muro-notas">
        {notas.map((nota) => (
          <div
            key={nota.id}
            className="post-it"
            style={{ backgroundColor: nota.color }}
          >
            <div>
              <h3>{nota.titulo}</h3>
              <p>{nota.contenido}</p>
            </div>
            <div className="acciones-nota">
              <button className="btn-editar" onClick={() => prepararEdicion(nota)}>
                Editar
              </button>
              <button className="btn-eliminar" onClick={() => eliminarNota(nota.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;