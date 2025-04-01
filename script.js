// API Key de Alpha Vantage (reemplázalo por la tuya)
const apiKey = '3QF1LDW393Y3SKK';

// Lista de empresas para invertir con logotipos
const empresas = [
  { simbolo: "AAPL", nombre: "Apple", logo: "https://logo.clearbit.com/apple.com" },
  { simbolo: "GOOGL", nombre: "Google", logo: "https://logo.clearbit.com/google.com" },
  { simbolo: "AMZN", nombre: "Amazon", logo: "https://logo.clearbit.com/amazon.com" },
  { simbolo: "MSFT", nombre: "Microsoft", logo: "https://logo.clearbit.com/microsoft.com" },
  { simbolo: "TSLA", nombre: "Tesla", logo: "https://logo.clearbit.com/tesla.com" }
];

// Función para obtener datos de la API
async function obtenerDatosFinancieros() {
  const contenedor = document.getElementById("empresas");
  contenedor.innerHTML = ''; // Limpiar los datos previos

  for (let empresa of empresas) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${empresa.simbolo}&apikey=${apiKey}&outputsize=compact`;

    try {
      const respuesta = await fetch(url);
      const datos = await respuesta.json();
      const precios = datos["Time Series (Daily)"];
      const fechas = Object.keys(precios);
      const preciosArr = fechas.map(fecha => parseFloat(precios[fecha]["4. close"]));

      // Crear el contenedor para cada empresa con el logo
      const div = document.createElement("div");
      div.classList.add("empresa");
      div.innerHTML = `
        <img src="${empresa.logo}" alt="${empresa.nombre}">
        <h3>${empresa.nombre} (${empresa.simbolo})</h3>
        <canvas id="grafico-${empresa.simbolo}" class="grafico"></canvas>
      `;
      contenedor.appendChild(div);

      // Crear gráfico para la empresa
      const ctx = document.getElementById(`grafico-${empresa.simbolo}`).getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: fechas.slice(0, 10), // Tomar las últimas 10 fechas
          datasets: [{
            label: 'Precio Histórico',
            data: preciosArr.slice(0, 10), // Tomar los últimos 10 precios
            borderColor: 'rgb(204, 0, 102)',
            fill: false
          }]
        },
        options: {
          scales: {
            x: { 
              ticks: { autoSkip: true, maxTicksLimit: 10 }
            }
          }
        }
      });

    } catch (error) {
      console.error("Error al obtener datos de la empresa:", error);
    }
  }
}

// Llamar a la función para cargar los datos
obtenerDatosFinancieros();

// Función para calcular la ganancia de la inversión
function calcularInversion() {
  const monto = document.getElementById("monto").value;
  if (!monto || monto <= 0) {
    alert("Por favor, ingresa un monto válido.");
    return;
  }

  const gananciaEstimacion = 0.10; // Estimación de ganancia del 10%
  const ganancia = monto * gananciaEstimacion;
  const resultado = document.getElementById("resultado");
  resultado.innerHTML = `Si inviertes $${monto}, podrías ganar aproximadamente $${ganancia.toFixed(2)} en ganancias.`;
}
