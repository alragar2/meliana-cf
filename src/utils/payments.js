
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
 * @param {Object} pagos - Objeto que contiene los pagos del jugador
 * @returns {number} - El total pagado actualizado
 */
export const calculatePagosTotales = (categoria, pagos, loteria) => {
    switch (categoria) {
        case 'QUERUBÍN':
            pagos.inscripcion = 0;
            pagos.cuota_1 = 20;
            pagos.cuota_2 = 20;
            pagos.cuota_3 = 20;
            pagos.cuota_4 = 20;
            pagos.cuota_5 = 20;
            pagos.cuota_6 = 20;
            pagos.cuota_7 = 20;
            pagos.cuota_8 = 20;
            pagos.cuota_9 = 20;
            break;
        case 'PREBE':
        case 'BENJAMÍN 1 AÑO':
        case 'BENJAMÍN 2 AÑO':
        case 'ALEVÍN 1 AÑO':
        case 'ALEVÍN 2 AÑO':
        case 'INFANTIL':
        case 'CADETE':
            pagos.inscripcion = 120;
            pagos.cuota_1 = 45;
            pagos.cuota_2 = 45;
            pagos.cuota_3 = 45;
            pagos.cuota_4 = 45;
            pagos.cuota_5 = 45;
            pagos.cuota_6 = 45;
            pagos.cuota_7 = 45;
            pagos.cuota_8 = 45;
            pagos.cuota_9 = 0;
            break;
        case 'JUVENIL':
            pagos.inscripcion = 120;
            pagos.cuota_1 = 45;
            pagos.cuota_2 = 45;
            pagos.cuota_3 = 45;
            pagos.cuota_4 = 45;
            pagos.cuota_5 = 45;
            pagos.cuota_6 = 45;
            pagos.cuota_7 = 45;
            pagos.cuota_8 = 0;
            pagos.cuota_9 = 0;
            break;
        case 'FEMENINO':
            pagos.inscripcion = 120;
            pagos.cuota_1 = 30;
            pagos.cuota_2 = 30;
            pagos.cuota_3 = 30;
            pagos.cuota_4 = 30;
            pagos.cuota_5 = 30;
            pagos.cuota_6 = 30;
            pagos.cuota_7 = 30;
            pagos.cuota_8 = 30;
            pagos.cuota_9 = 30;
            break;
        default:
            pagos.inscripcion = 0;
            pagos.cuota_1 = 0;
            pagos.cuota_2 = 0;
            pagos.cuota_3 = 0;
            pagos.cuota_4 = 0;
            pagos.cuota_5 = 0;
            pagos.cuota_6 = 0;
            pagos.cuota_7 = 0;
            pagos.cuota_8 = 0;
            pagos.cuota_9 = 0;
             break;
    }
    if (!loteria) {
        pagos.cuota_loteria = 50; // Cuota fija para la lotería
    }
    const totalPagado = calculateTotalPagado(pagos);
    return totalPagado;
}