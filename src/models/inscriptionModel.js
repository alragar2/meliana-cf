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
    sexo: inscriptionData.sexo,
    loteria: inscriptionData.loteria || false,
    beneficios: inscriptionData.beneficios || false,
    
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
    hermanosEnClub: inscriptionData.hermanosEnClub || false,
    categoria: null,
    dorsal: null,
    pagos: {
        inscripcion: 0,
        cuota_1: 0,
        cuota_2: 0,
        cuota_3: 0,
        cuota_4: 0,
        cuota_5: 0,
        cuota_6: 0,
        cuota_7: 0,
        cuota_8: 0,
        cuota_9: 0,
        cuota_loteria: 0
    },
    totalPagado: 0,
    totalAPagar: 0
  };
};

// Campos requeridos para validación
export const REQUIRED_INSCRIPTION_FIELDS = [
  // Datos del Niño/a
  'nombreNino',
  'apellidos', 
  'direccion',
  'poblacion',
  'cp',
  'fechaNacimiento',
  'telefono',
  'nacionalidad',
  'lugarNacimiento',
  'sexo',
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

