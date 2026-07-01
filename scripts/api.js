
export async function buscarDatosClima(ciudad) {
    const urlGeocoding = 'https://geocoding-api.open-meteo.com/v1/search?name=' + ciudad + '&count=1&language=es&format=json';


    const respuesta = await fetch(urlGeocoding);
    const datosLocacion = await respuesta.json();

    if (!datosLocacion.results) {
        throw new Error('Ciudad no encontrada');
    }

    const lat = datosLocacion.results[0].latitude;
    const lon = datosLocacion.results[0].longitude;
    const nombreReal = datosLocacion.results[0].name;

    // Esti es la url de clima, no olvidarrr
    const urlClima = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current_weather=true&hourly=temperature_2m,relativehumidity_2m,weathercode,apparent_temperature,precipitation&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto';


    const respuestaClima = await fetch(urlClima);
    const datosDelClima = await respuestaClima.json();

    return {
        nombre: nombreReal,
        clima: datosDelClima
    };
}