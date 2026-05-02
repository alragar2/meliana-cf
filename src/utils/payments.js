
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
export const calculatePagosTotales = (categoria, loteria, hermanosEnClub) => {

    let pago = 0;
    switch (categoria) {
        case 'QUERUBÍN':
            pago = 180;
            break;
        case 'PREBE':
        case 'BENJAMÍN 1 AÑO':
        case 'BENJAMÍN 2 AÑO':
        case 'ALEVÍN 1 AÑO':
        case 'ALEVÍN 2 AÑO':
        case 'INFANTIL':
        case 'CADETE':
            pago = 480;
            break;
        case 'JUVENIL':
            pago = 435;
            break;
        case 'FEMENINO':
            pago = 390;
            break;
        default:
            pago = 0;
             break;
    }
    if (!loteria) {
        pago += 50;
    }

    if (hermanosEnClub) {
        pago -= 50;
    }

    return pago;
}