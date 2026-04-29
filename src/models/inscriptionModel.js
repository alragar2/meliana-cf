import { Timestamp } from 'firebase/firestore';

// Nombre de la colección en Firestore
export const COLLECTION_NAME = 'Jugadores26-27';
export const PAYMENTS_COLLECTION = 'pagos';
export const INSCRIPTIONS_COLLECTION = 'inscripciones';

// Estructura de datos del jugador
export const createInscriptionDataModel = (inscriptionData, customId) => {
  return {
    // Datos del Niño/a
    nombreNino: inscriptionData.nombreNino,
    apellidos: inscriptionData.apellidos,
    direccion: inscriptionData.direccion,
    poblacion: inscriptionData.poblacion,
    dni: inscriptionData.dni,
    cp: inscriptionData.cp,
    fechaNacimiento: inscriptionData.fechaNacimiento,
    telefono: inscriptionData.telefono,
    nacionalidad: inscriptionData.nacionalidad,
    lugarNacimiento: inscriptionData.lugarNacimiento,
    loteria: inscriptionData.loteria || false,
    
    // Datos de los Padres/Tutores (mapa anidado)
    padre: {
      nombre: inscriptionData.nombrePadre,
      apellidos: inscriptionData.apellidosPadre,
      telefono: inscriptionData.telefonoPadre,
      email: inscriptionData.correoPadre,
      dni: inscriptionData.dniPadre,
      parentesco: inscriptionData.parentesco
    },
    
    // Datos Bancarios
    banco: {
      nombre: inscriptionData.nombreBanco,
      iban: inscriptionData.iban
    },
    
    // Metadata
    codigoInscripcion: customId,
    createdAt: Timestamp.now(),
    fechaCreacion: Timestamp.now(),
    fechaActualizacion: Timestamp.now(),
    estado: 'pendiente', // Estados: pendiente, confirmada, rechazada
    dorsal: null,
    pagos: [],
    totalPagado: 0,
    estadoPago: 'pendiente' // pendiente, parcial, pagado
  };
};

// Estructura de un pago
export const createPaymentDataModel = (paymentData) => {
  return {
    id: Date.now().toString(),
    fecha: Timestamp.now(),
    monto: parseFloat(paymentData.monto),
    metodo: paymentData.metodo, // 'banco' o 'mano'
    concepto: paymentData.concepto || 'Pago campus',
    registradoPor: paymentData.registradoPor || 'Administrador',
    notas: paymentData.notas || ''
  };
};

// Campos requeridos para validación
export const REQUIRED_INSCRIPTION_FIELDS = [
  // Datos del Niño/a
  'nombreNino',
  'apellidos', 
  'direccion',
  'poblacion',
  'dni',
  'cp',
  'fechaNacimiento',
  'telefono',
  'nacionalidad',
  'lugarNacimiento',
  // Datos de los Padres/Tutores
  'nombrePadre',
  'apellidosPadre',
  'telefonoPadre',
  'correoPadre',
  'dniPadre',
  'parentesco',
  // Datos Bancarios
  'nombreBanco',
  'iban'
];

// Patrones de validación
export const VALIDATION_PATTERNS = {
  phone: /^[+]?[0-9\s-()]{9,15}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  dni: /^[0-9XYZ]{1}[0-9]{7}[A-Z]{1}$/i,
  iban: /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/,
  postalCode: /^\d{5}$/
};

// Mapa de campos para exportación
export const EXPORT_FIELDS_PLAYER = {
  codigoInscripcion: 'Código',
  nombreNino: 'Nombre Niño/a',
  apellidos: 'Apellidos',
  dni: 'DNI',
  fechaNacimiento: 'Fecha Nac.',
  categoria: 'Categoría',
  createdAt: 'Fecha Inscripción'
};

export const EXPORT_FIELDS_PARENT = {
  codigoInscripcion: 'Código',
  nombreNino: 'Nombre Niño/a',
  'padre.nombre': 'Padre/Tutor',
  'padre.apellidos': 'Apellidos Padre',
  'padre.telefono': 'Teléfono',
  'padre.email': 'Email',
  createdAt: 'Fecha Inscripción'
};

export const EXPORT_FIELDS_PAYMENT = {
  codigoInscripcion: 'Código',
  nombreNino: 'Nombre Niño/a',
  'banco.nombre': 'Nombre Banco',
  'banco.iban': 'IBAN',
  createdAt: 'Fecha Inscripción'
};

export const EXPORT_FIELDS_PERSONAL = {
  codigoInscripcion: 'Código',
  nombreNino: 'Nombre Niño/a',
  'banco.nombre': 'Nombre Banco',
  'banco.iban': 'IBAN',
  createdAt: 'Fecha Inscripción'
};
