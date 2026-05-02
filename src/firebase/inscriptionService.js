import { collection, addDoc, getDocs, doc, setDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from './config';
import { 
  COLLECTION_NAME, 
  createInscriptionDataModel, 
  REQUIRED_INSCRIPTION_FIELDS, 
  VALIDATION_PATTERNS 
} from '../models/inscriptionModel';
import { calcularCategoria } from '../utils/categories';
import { calculatePagosTotales } from '../utils/payments';

// Servicio para manejar las inscripciones en Firebase
export const inscriptionService = {
  
  // Crear una nueva inscripción
  async createInscription(inscriptionData) {
    console.log('🔥 [Firebase Service] Iniciando createInscription...');
    console.log('📊 [Firebase Service] Datos recibidos:', inscriptionData);
    
    try {
      // Verificar conexión a Firebase
      console.log('🌐 [Firebase Service] Verificando conexión a Firebase...');
      console.log('🗄️ [Firebase Service] Base de datos:', db);
      console.log('📁 [Firebase Service] Colección:', COLLECTION_NAME);

      // Validar que db esté inicializado
      if (!db) {
        throw new Error('Base de datos Firestore no inicializada');
      }

      // Obtener el número de inscripciones actuales para generar el ID
      const allInscriptions = await getDocs(collection(db, COLLECTION_NAME));
      const nextNumber = allInscriptions.size + 1;
      const customId = `MCF-2026-${nextNumber}`;

      const dataToSave = createInscriptionDataModel(inscriptionData, customId);

      // Calcular categoría y pagos totales
      const categoria = calcularCategoria(inscriptionData.fechaNacimiento, inscriptionData.sexo);
      dataToSave.categoria = categoria;
      dataToSave.totalAPagar = calculatePagosTotales(categoria, dataToSave.loteria, dataToSave.hermanosEnClub);

      console.log('📝 [Firebase Service] Datos finales a guardar:', dataToSave);
      console.log('✍️ [Firebase Service] Enviando a Firestore...');

      // Intentar crear la colección y documento
      const docRef = doc(db, COLLECTION_NAME, customId);
      
      await setDoc(docRef, dataToSave);
      
      console.log('✅ [Firebase Service] Inscripción guardada con ID:', docRef.id);
      console.log('✅ [Firebase Service] Código de inscripción personalizado:', customId);
      return {
        success: true,
        id: docRef.id,
        codigoInscripcion: customId,
        message: 'Inscripción enviada correctamente'
      };
    } catch (error) {
      console.error('💥 [Firebase Service] Error detallado:', {
        message: error.message,
        code: error.code,
        name: error.name,
        stack: error.stack,
        completeError: error
      });

      // Diagnóstico específico por tipo de error
      let userMessage = 'Error al enviar la inscripción. Inténtalo de nuevo.';
      
      if (error.code === 'permission-denied') {
        console.error('🚫 [Firebase Service] Error de permisos - Verificar reglas de Firestore');
        userMessage = 'Error de permisos. Contacta al administrador.';
      } else if (error.code === 'unavailable') {
        console.error('🌐 [Firebase Service] Firebase no disponible - Verificar conexión');
        userMessage = 'Servicio temporalmente no disponible. Inténtalo más tarde.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        console.error('📡 [Firebase Service] Error de red - Verificar conectividad');
        userMessage = 'Error de conexión. Verifica tu internet.';
      } else if (error.code === 'invalid-argument') {
        console.error('📝 [Firebase Service] Datos inválidos enviados a Firestore');
        userMessage = 'Datos del formulario inválidos. Revisa la información.';
      } else if (error.message.includes('400')) {
        console.error('🔧 [Firebase Service] Error 400 - Bad Request, posible problema de configuración');
        userMessage = 'Error de configuración. Contacta al soporte técnico.';
      }

      return {
        success: false,
        error: error.message,
        errorCode: error.code,
        message: userMessage
      };
    }
  },

  // Obtener todas las inscripciones
  async getAllInscriptions() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const inscriptions = [];
      
      querySnapshot.forEach((doc) => {
        inscriptions.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log(`✅ [Firebase Service] ${inscriptions.length} inscripciones cargadas exitosamente`);
      
      return {
        success: true,
        data: inscriptions
      };
    } catch (error) {
      console.error('❌ [Firebase Service] Error al obtener inscripciones:', error);
      
      return {
        success: false,
        error: error.message,
        message: 'Error al cargar las inscripciones'
      };
    }
  },

  // Actualizar estado de una inscripción
  async updateInscriptionStatus(inscriptionId, newStatus) {
    try {
      const inscriptionRef = doc(db, COLLECTION_NAME, inscriptionId);
      await updateDoc(inscriptionRef, {
        estado: newStatus,
        fechaActualizacion: Timestamp.now()
      });
      
      return {
        success: true,
        message: 'Estado actualizado correctamente'
      };
    } catch (error) {
      console.error('Error al actualizar inscripción: ', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Agregar un pago a una inscripción
  async addPayment(inscriptionId, paymentData) {
    try {
      console.log('🔥 [Firebase Service] Agregando pago a inscripción:', inscriptionId);
      console.log('💰 [Firebase Service] Datos del pago:', paymentData);

      const inscriptionRef = doc(db, COLLECTION_NAME, inscriptionId);
      
      // Obtener la inscripción actual
      const inscriptionSnap = await getDocs(collection(db, COLLECTION_NAME));
      let currentInscription = null;
      
      inscriptionSnap.forEach((doc) => {
        if (doc.id === inscriptionId) {
          currentInscription = { id: doc.id, ...doc.data() };
        }
      });

      if (!currentInscription) {
        throw new Error('Inscripción no encontrada');
      }

      // Preparar el nuevo pago
      const newPayment = {
        id: Date.now().toString(),
        fecha: Timestamp.now(),
        monto: parseFloat(paymentData.monto),
        metodo: paymentData.metodo, // 'banco' o 'mano'
        concepto: paymentData.concepto || 'Pago campus',
        registradoPor: paymentData.registradoPor || 'Administrador',
        notas: paymentData.notas || ''
      };

      // Obtener pagos existentes o crear array vacío
      const pagosExistentes = currentInscription.pagos || [];
      const nuevosPagos = [...pagosExistentes, newPayment];

      // Calcular totales
      const totalPagado = nuevosPagos.reduce((sum, pago) => sum + pago.monto, 0);
      const montoCampus = 120; // Precio del campus
      const estadoPago = totalPagado >= montoCampus ? 'pagado' : totalPagado > 0 ? 'parcial' : 'pendiente';

      // Actualizar la inscripción
      await updateDoc(inscriptionRef, {
        pagos: nuevosPagos,
        totalPagado: totalPagado,
        estadoPago: estadoPago,
        ultimoPago: newPayment,
        fechaActualizacion: Timestamp.now()
      });

      console.log(`✅ [Firebase Service] Pago agregado exitosamente a inscripción ${inscriptionId}`);

      return {
        success: true,
        message: 'Pago registrado correctamente',
        data: newPayment
      };
    } catch (error) {
      console.error('❌ [Firebase Service] Error al agregar pago:', error);
      return {
        success: false,
        error: error.message,
        message: 'Error al registrar el pago'
      };
    }
  },

  // Obtener historial de pagos de una inscripción
  async getPaymentHistory(inscriptionId) {
    try {
      const inscriptionSnap = await getDocs(collection(db, COLLECTION_NAME));
      let inscription = null;
      
      inscriptionSnap.forEach((doc) => {
        if (doc.id === inscriptionId) {
          inscription = { id: doc.id, ...doc.data() };
        }
      });

      if (!inscription) {
        throw new Error('Inscripción no encontrada');
      }

      return {
        success: true,
        data: inscription.pagos || []
      };
    } catch (error) {
      console.error('❌ [Firebase Service] Error al obtener historial de pagos:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Eliminar una inscripción
  async deleteInscription(inscriptionId) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, inscriptionId));
      
      return {
        success: true,
        message: 'Inscripción eliminada correctamente'
      };
    } catch (error) {
      console.error('Error al eliminar inscripción: ', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Validar datos de inscripción antes de enviar
  validateInscriptionData(data) {
    const missingFields = REQUIRED_INSCRIPTION_FIELDS.filter(field => !data[field] || (typeof data[field] === 'string' && data[field].trim() === ''));
    
    if (missingFields.length > 0) {
      return {
        isValid: false,
        message: `Los siguientes campos son obligatorios: ${missingFields.join(', ')}`
      };
    }

    // Validar teléfono del niño
    if (!VALIDATION_PATTERNS.phone.test(data.telefono)) {
      return {
        isValid: false,
        message: 'El formato del teléfono del niño no es válido'
      };
    }

    // Validar teléfono del padre
    if (!VALIDATION_PATTERNS.phone.test(data.telefonoPadre)) {
      return {
        isValid: false,
        message: 'El formato del teléfono del padre no es válido'
      };
    }

    // Validar email del padre
    if (!VALIDATION_PATTERNS.email.test(data.correoPadre)) {
      return {
        isValid: false,
        message: 'El formato del correo electrónico no es válido'
      };
    }

    // Validar DNI/NIE del niño
    if (!VALIDATION_PATTERNS.dni.test(data.dni.replace(/[-\s]/g, ''))) {
      return {
        isValid: false,
        message: 'El formato del DNI/NIE del niño no es válido'
      };
    }

    // Validar DNI/NIE del padre
    if (!VALIDATION_PATTERNS.dni.test(data.dniPadre.replace(/[-\s]/g, ''))) {
      return {
        isValid: false,
        message: 'El formato del DNI/NIE del padre no es válido'
      };
    }

    // Validar IBAN
    if (!VALIDATION_PATTERNS.iban.test(data.iban.replace(/[\s-]/g, ''))) {
      return {
        isValid: false,
        message: 'El formato del IBAN no es válido'
      };
    }

    // Validar código postal
    if (!VALIDATION_PATTERNS.postalCode.test(data.cp)) {
      return {
        isValid: false,
        message: 'El código postal debe contener 5 dígitos'
      };
    }

    return {
      isValid: true,
      message: 'Datos válidos'
    };
  }
};
