// modify-db.js
import { db } from './config'; 
import { doc, updateDoc } from 'firebase/firestore';
import { COLLECTION_NAME } from '../models/inscriptionModel';

/**
 * Actualiza un campo de pago específico en Firestore y recalcula el total.
 * @param {string} id - ID del documento en Firestore.
 * @param {string} campo - Nombre del campo (ej: 'inscripcion', 'cuota_1').
 * @param {number} numericValue - Nuevo valor numérico.
 * @param {object} pagosActuales - El objeto completo de pagos de la inscripción.
 */
export const savePaymentToFirestore = async (id, campo, numericValue, pagosActuales) => {
    // La conversión a número ahora se hace en el componente que llama a esta función.
    try {
        const docRef = doc(db, COLLECTION_NAME, id);

        // 1. Calculamos el nuevo total sumando los pagos actuales + el nuevo cambio
        const nuevosPagos = { 
            ...(pagosActuales || {}), 
            [campo]: numericValue 
        };
        
        const nuevoTotalPagado = Object.values(nuevosPagos).reduce(
            (acc, val) => acc + (parseFloat(val) || 0), 
            0
        );

        // 2. Ejecutamos la actualización
        await updateDoc(docRef, {
            [`pagos.${campo}`]: numericValue,
            "totalPagado": nuevoTotalPagado
        });

        console.log(`✅ Registro ${id} actualizado: ${campo} = ${numericValue}€`);
        return { success: true, nuevoTotalPagado };
    } catch (error) {
        console.error("❌ Error en modify-db:", error);
        throw error; // Lanzamos el error para que el componente pueda manejarlo
    }
};