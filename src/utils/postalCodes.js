// Diccionario de códigos postales comunes en Valencia (principalmente Horta Nord)
export const INITIAL_POSTAL_CODES_CACHE = {
    '46133': 'Meliana',
    '46134': 'Foios',
    '46135': 'Albalat dels Sorells',
    '46137': 'Vinalesa',
    '46131': 'Bonrepòs i Mirambell',
    '46132': 'Almàssera',
    '46136': 'Museros',
    '46138': 'Rafelbunyol',
    '46139': 'La Pobla de Farnals',
    '46130': 'Massamagrell',
    '46111': 'Alboraya',
    '46016': 'Tavernes Blanques',
    '46100': 'Burjassot',
    '46113': 'Moncada',
    '46110': 'Godella',
    '46115': 'Alfara del Patriarca',
    '46001': 'Valencia',
    '46002': 'Valencia',
    '46003': 'Valencia',
    '46004': 'Valencia',
    '46005': 'Valencia',
    '46006': 'Valencia',
    '46007': 'Valencia',
    '46008': 'Valencia',
    '46009': 'Valencia',
    '46010': 'Valencia',
    '46011': 'Valencia',
    '46012': 'Valencia',
    '46013': 'Valencia',
    '46014': 'Valencia',
    '46015': 'Valencia',
    '46017': 'Valencia',
    '46018': 'Valencia',
    '46019': 'Valencia',
    '46020': 'Valencia',
    '46021': 'Valencia',
    '46022': 'Valencia',
    '46023': 'Valencia',
    '46024': 'Valencia',
    '46025': 'Valencia',
    '46026': 'Valencia',
    '46120': 'Alboraya'
};

/**
 * Normaliza el nombre de una población (sin espacios extra, primera letra de cada palabra en mayúscula)
 * @param {string} text 
 * @returns {string}
 */
export const normalizeLocationName = (text) => {
    if (!text) return '';
    return text
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Resuelve una lista de códigos postales consultando Zippopotam.us para los que no están en la caché.
 * @param {Array<string>} cps - Lista de códigos postales a resolver
 * @param {Object} currentCache - Estado actual de la caché
 * @returns {Promise<Object>} - Nuevas entradas de caché resueltas
 */
export const fetchUnknownPostalCodes = async (cps, currentCache) => {
    const newResolved = {};
    const pendingCps = [...new Set(cps)]
        .map(cp => cp ? cp.trim() : '')
        .filter(cp => cp && /^\d{5}$/.test(cp) && !currentCache[cp]);

    if (pendingCps.length === 0) return newResolved;

    console.log(`🔍 [PostalCodes] Consultando ${pendingCps.length} códigos postales desconocidos:`, pendingCps);

    // Consultar secuencialmente con un pequeño retardo para evitar bloqueos por límite de tasa (rate limits)
    for (const cp of pendingCps) {
        try {
            const response = await fetch(`https://api.zippopotam.us/es/${cp}`);
            if (response.ok) {
                const data = await response.json();
                if (data.places && data.places.length > 0) {
                    const rawPlace = data.places[0]['place name'];
                    newResolved[cp] = normalizeLocationName(rawPlace);
                    console.log(`✅ [PostalCodes] Código ${cp} resuelto como: ${newResolved[cp]}`);
                }
            } else {
                console.warn(`⚠️ [PostalCodes] No se pudo obtener información para el CP ${cp}. Status: ${response.status}`);
            }
        } catch (error) {
            console.error(`💥 [PostalCodes] Error al consultar CP ${cp}:`, error);
        }
        // Esperar 100ms entre llamadas por cortesía al servidor
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    return newResolved;
};

/**
 * Obtiene la población oficial/resuelta para una inscripción.
 * Prioriza la traducción del código postal, y si no existe o falla, normaliza la población escrita.
 * @param {Object} inscription 
 * @param {Object} cache 
 * @returns {string}
 */
export const getResolvedPopulation = (inscription, cache) => {
    if (!inscription) return 'Desconocido';
    const cp = inscription.cp ? inscription.cp.trim() : '';
    if (cp && cache[cp]) {
        return cache[cp];
    }
    return normalizeLocationName(inscription.poblacion) || 'Desconocido';
};
