
import { calcularCategoria } from './categories';

/**
 * Calcula el total pagado por un jugador
 * @param {Object} pagos - Objeto que contiene los pagos del jugador
 * @returns {number} - Total pagado
 */
export const calculateTotalPagado = (pagos) => {
    let total = pagos.inscripcion || 0;
    for (let i = 1; i <= 9; i++) {
        total += pagos[`cuota_${i}`] || 0;
    }
    total += pagos.cuota_loteria || 0;
    return total;
}


/**
 * Calcula los pagos totales según la categoría del jugador
 * @param {string} categoria - La categoría del jugador
 * @param {boolean} loteria - Si participa en la lotería
 * @param {boolean} hermanosEnClub - Si tiene hermanos en el club
 * @returns {number} - El total a pagar
 */
export const calculatePagosTotales = (categoria, loteria, hermanosEnClub, sexo) => {

    let pago = 0;
    switch (categoria) {
        case 'QUERUBÍN':
            pago = 225;
            break;
        case 'PREBE':
        case 'BENJAMÍN 1 AÑO':
        case 'BENJAMÍN 2 AÑO':
        case 'ALEVÍN 1 AÑO':
        case 'ALEVÍN 2 AÑO':
        case 'INFANTIL':
        case 'CADETE':
            pago = 520;
            break;
        case 'JUVENIL':
            pago = 470;
            break;
        case 'FEMENINO INFANTIL':
            pago = 435;
            break;
        default:
            pago = 0;
             break;
    }

    if (sexo === 'femenino' && categoria !== 'QUERUBÍN') {
        pago = 435;
    }

    if (hermanosEnClub && categoria !== 'QUERUBÍN' && categoria !== 'AMATEUR') {
        pago -= 50;
    }

    return pago;
}

/**
 * Calcula el desglose de pagos por mes según la categoría
 * @param {string} categoria - La categoría del jugador
 * @param {boolean} hermanosEnClub - Si tiene hermanos en el club
 * @returns {Object} - Objeto con inscripción, cuotas y total
 */
export const calculatePaymentBreakdown = (categoria, hermanosEnClub = false, sexo) => {
    const meses = [
        'septiembre',
        'octubre',
        'noviembre',
        'diciembre',
        'febrero',
        'marzo',
        'abril',
        'mayo'
    ];

    const mesesFemeninoPlusQuerubin = [
        'septiembre',
        'octubre',
        'noviembre',
        'diciembre',
        'febrero',
        'marzo',
        'abril',
        'mayo',
        'junio'
    ];

    let inscripcion = 0;
    let cuotaMensual = 0;
    let numCuotas = 0;
    let mesesAPagar = [];

    switch (categoria) {
        case 'QUERUBÍN':
            inscripcion = 0;
            cuotaMensual = 25;
            numCuotas = 9;
            mesesAPagar = mesesFemeninoPlusQuerubin;
            break;
        case 'FEMENINO INFANTIL':
        case 'FEMENINO ALEVÍN':
            inscripcion = 120;
            cuotaMensual = 35;
            numCuotas = 9;
            mesesAPagar = mesesFemeninoPlusQuerubin;
            break;
        case 'JUVENIL':
            inscripcion = 120;
            cuotaMensual = 50;
            numCuotas = 7;
            mesesAPagar = meses.slice(0, 7);
            break;
        case 'PREBE':
        case 'BENJAMÍN 1 AÑO':
        case 'BENJAMÍN 2 AÑO':
        case 'ALEVÍN 1 AÑO':
        case 'ALEVÍN 2 AÑO':
        case 'INFANTIL':
        case 'CADETE':
            inscripcion = 120;
            cuotaMensual = 50;
            numCuotas = 8;
            mesesAPagar = meses;
            break;
        default:
            inscripcion = 0;
            cuotaMensual = 0;
            numCuotas = 0;
            mesesAPagar = [];
    }

    if (sexo === 'femenino') {
        inscripcion = 120;
            cuotaMensual = 35;
            numCuotas = 9;
            mesesAPagar = mesesFemeninoPlusQuerubin;
    }


    // Aplicar descuento si tiene hermanos en el club (no aplica a QUERUBÍN o AMATEUR)
    let inscripcionFinal = inscripcion;
    if (hermanosEnClub && inscripcion > 0 && categoria !== 'QUERUBÍN' && categoria !== 'AMATEUR') {
        inscripcionFinal = inscripcion - 50;
    }

    // Construir desglose de cuotas
    const cuotas = mesesAPagar.map((mes, index) => ({
        mes: mes.charAt(0).toUpperCase() + mes.slice(1),
        cantidad: cuotaMensual,
        indice: index + 1
    }));

    const totalCuotas = cuotaMensual * numCuotas;
    const total = inscripcionFinal + totalCuotas;

    return {
        inscripcion: inscripcionFinal,
        cuotas,
        totalCuotas,
        total
    };
}