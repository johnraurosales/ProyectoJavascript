import {buscarDatosClima} from './api.js';
import {
    mostrarClimaActual,
    mostrarEstadoCargando,
    ocultarError,
    mostrarError
} from './dom.js';

const botonBuscar = document.getElementById('boton-buscar');
const inputCiudad = document.getElementById('entrada-ciudad');
const selectorUnidades = document.getElementById('selector-unidades');


let ultimosDatosObtenidos = null;


selectorUnidades.addEventListener('change', function () {
    if (ultimosDatosObtenidos !== null) {
        mostrarClimaActual(ultimosDatosObtenidos);
    }
});

async function iniciarBusqueda() {
    let ciudad = inputCiudad.value.trim();

    if (ciudad === '') return;

    mostrarEstadoCargando();
    ocultarError();

    botonBuscar.innerText = "Buscando...";

    try {
        const datosCompletos = await buscarDatosClima(ciudad);
        ultimosDatosObtenidos = datosCompletos;
        mostrarClimaActual(datosCompletos);
    } catch (error) {
        mostrarError('No encontramos la ciudad. Intenta otra.');
        ultimosDatosObtenidos = null;
    } finally {
        botonBuscar.innerText = "Buscar";
    }
}

botonBuscar.addEventListener('click', iniciarBusqueda);