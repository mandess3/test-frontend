import React, { useState } from 'react';
import axios from 'axios';

function App() {

  // Valores cambiantes al momento de ejecucion (ReactJS)
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [resultados, setResultados] = useState(null);

  // Escucha si una foto es seleccionada 
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
    }
  };

  
  const enviarImagen = () => {

    // Advertencia si no se ha seleccionado una foto
    if (!selectedFile) {
      alert('Selecciona una foto primero');
      return;
    }


    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onloadend = () => {

      // Toma la imagen en base64
      const base64Image = reader.result.split(',')[1];

      // Se envia a la API
      axios.post("http://localhost:8000/analizar-emociones", { imagen: base64Image })
        .then(response => {
          const resultadosFormateados = {};
          response.data.emociones.forEach((emocion) => {
            resultadosFormateados[emocion.emocion] = emocion.porcentaje;
          });
          setResultados(resultadosFormateados);
        })
        .catch(error => {
          console.error("Error al enviar la imagen:", error);
        });
    };
  };

  return (
    <div>
      <h1>Detector de Emociones</h1>

      {imagePreview && (
        <div>
          {/* Mostrar la imagen previa aquí */}
          <img src={imagePreview} alt="Imagen previa" /*style={{ width: '200px', height: '200px' }}*/ />
        </div>
      )}

      <input type="file" onChange={handleFileChange} accept="image/*" />
      <button onClick={enviarImagen}>Enviar Imagen</button>

      {resultados && (
        <div>
          <h2>Resultados de Emociones:</h2>
          {Object.entries(resultados).map(([emocion, porcentaje]) => (
            <p>{emocion}: {porcentaje.toFixed(2)}%</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
