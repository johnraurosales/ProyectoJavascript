let ultimosDatosGuardados = null;
let sistemaActual = 'metrico';

const convertirAFahrenheit = (celsius) => (celsius * 9 / 5) + 32;
const convertirAMillas = (kmh) => kmh * 0.621371;

function obtenerRutaIcono(codigo) {
    if (codigo === 0) {
        return 'assets/images/icon-sunny.webp'; // Despejado
    } else if (codigo === 1 || codigo === 2) {
        return 'assets/images/icon-partly-cloudy.webp'; // Parcialmente nublado
    } else if (codigo === 3) {
        return 'assets/images/icon-overcast.webp'; // Mayormente nublado
    } else if (codigo >= 45 && codigo <= 48) {
        return 'assets/images/icon-fog.webp'; // Niebla
    } else if (codigo >= 51 && codigo <= 57) {
        return 'assets/images/icon-drizzle.webp'; // Llovizna
    } else if (codigo >= 61 && codigo <= 82) {
        return 'assets/images/icon-rain.webp'; // Lluvia
    } else if ((codigo >= 71 && codigo <= 77) || codigo === 85 || codigo === 86) {
        return 'assets/images/icon-snow.webp'; // Nieve
    } else if (codigo >= 95) {
        return 'assets/images/icon-storm.webp'; // Tormenta
    } else {
        return 'assets/images/icon-sunny.webp';
    }
}


export function mostrarClimaActual(datos) {
    if (datos) ultimosDatosGuardados = datos;
    if (!ultimosDatosGuardados) return;

    const contenedorUnidades = document.getElementById('selector-unidades');
    sistemaActual = contenedorUnidades.value;

    document.getElementById('nombre-ciudad').innerText = ultimosDatosGuardados.nombre;

    const climaActual = ultimosDatosGuardados.clima.current_weather;

    const humedadActual = ultimosDatosGuardados.clima.hourly.relativehumidity_2m[0];
    let sensacion = ultimosDatosGuardados.clima.hourly.apparent_temperature[0];
    let precipitacion = ultimosDatosGuardados.clima.hourly.precipitation[0];


    let temperatura = climaActual.temperature;
    let viento = climaActual.windspeed;
    let unidadTemp = '°C';
    let unidadViento = 'km/h';
    let unidadPrecipitacion = 'mm';


    if (sistemaActual === 'imperial') {
        temperatura = convertirAFahrenheit(temperatura).toFixed(1);
        sensacion = convertirAFahrenheit(sensacion).toFixed(1);
        viento = convertirAMillas(viento).toFixed(1);
        precipitacion = (precipitacion / 25.4).toFixed(2); // Fórmula básica de mm a pulgadas
        unidadTemp = '°F';
        unidadViento = 'mph';
        unidadPrecipitacion = 'in';
    }

    // Esto va al HTML, tomar en cuenta no olvidar
    document.getElementById('grados-actuales').innerText = temperatura + unidadTemp;
    document.getElementById('sensacion').innerText = sensacion + unidadTemp;
    document.getElementById('viento').innerText = viento + ' ' + unidadViento;
    document.getElementById('humedad').innerText = humedadActual + '%';
    document.getElementById('precipitacion').innerText = precipitacion + ' ' + unidadPrecipitacion;

    const iconoClima = document.getElementById('icono-clima-actual');
    iconoClima.src = obtenerRutaIcono(climaActual.weathercode);


    mostrarPronosticoHoras();
    mostrarPronosticoSemana();
}

export function mostrarPronosticoHoras() {
    if (!ultimosDatosGuardados) return;

    const contenedorHoras = document.getElementById('carrusel-horas');
    contenedorHoras.innerHTML = '';

    let unidadTemp = sistemaActual === 'imperial' ? '°F' : '°C';

    for (let i = 0; i < 5; i++) {
        const horaCompleta = ultimosDatosGuardados.clima.hourly.time[i];
        let temperatura = ultimosDatosGuardados.clima.hourly.temperature_2m[i];
        const codigoClima = ultimosDatosGuardados.clima.hourly.weathercode[i]; // NUEVO

        if (sistemaActual === 'imperial') {
            temperatura = convertirAFahrenheit(temperatura).toFixed(1);
        }

        const horaCorta = horaCompleta.split('T')[1];
        const rutaImagen = obtenerRutaIcono(codigoClima); // NUEVO

        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-hora';


        tarjeta.innerHTML = `
            <p class="texto-hora">${horaCorta}</p>
            <img src="${rutaImagen}" alt="Clima" class="icono-pequeno"> 
            <p class="temperatura-hora">${temperatura}${unidadTemp}</p>
        `;

        contenedorHoras.appendChild(tarjeta);
    }
}

export function mostrarPronosticoSemana() {
    if (!ultimosDatosGuardados) return;

    const contenedorDias = document.getElementById('lista-dias');
    contenedorDias.innerHTML = '';

    const nombresDias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    let unidadTemp = sistemaActual === 'imperial' ? '°F' : '°C';

    for (let i = 0; i < 7; i++) {
        const fechaCruda = ultimosDatosGuardados.clima.daily.time[i];
        let tempMax = ultimosDatosGuardados.clima.daily.temperature_2m_max[i];
        let tempMin = ultimosDatosGuardados.clima.daily.temperature_2m_min[i];
        const codigoClima = ultimosDatosGuardados.clima.daily.weathercode[i]; // NUEVO

        if (sistemaActual === 'imperial') {
            tempMax = convertirAFahrenheit(tempMax).toFixed(1);
            tempMin = convertirAFahrenheit(tempMin).toFixed(1);
        }

        const fechaObjeto = new Date(fechaCruda + 'T00:00:00');
        const diaEnEspanol = nombresDias[fechaObjeto.getDay()];
        const rutaImagen = obtenerRutaIcono(codigoClima); // NUEVO

        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-dia';


        tarjeta.innerHTML = `
            <p class="texto-dia">${diaEnEspanol}</p>
            <img src="${rutaImagen}" alt="Clima" class="icono-pequeno">
            <p class="temperatura-dia">Máx: ${tempMax}${unidadTemp} <br> Mín: ${tempMin}${unidadTemp}</p>
        `;

        contenedorDias.appendChild(tarjeta);
    }
}

export function mostrarEstadoCargando() {
    document.getElementById('nombre-ciudad').innerText = 'Cargando...';
    document.getElementById('grados-actuales').innerText = '--°C';
    document.getElementById('sensacion').innerText = '--°C';
    document.getElementById('humedad').innerText = '--%';
    document.getElementById('viento').innerText = '-- km/h';
    document.getElementById('precipitacion').innerText = '-- mm';
    document.getElementById('lista-dias').innerHTML = '';
    document.getElementById('carrusel-horas').innerHTML = '';
}

export function mostrarError(mensaje) {

    document.getElementById('contenido-clima').style.display = 'none';


    const divError = document.getElementById('contenedor-error');
    divError.style.display = 'block';
    document.getElementById('mensaje-error').innerText = mensaje;
}

export function ocultarError() {

    document.getElementById('contenido-clima').style.display = 'flex';
    document.getElementById('contenedor-error').style.display = 'none';
}