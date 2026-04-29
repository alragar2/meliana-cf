import { useState, useEffect, useCallback } from 'react';
import { inscriptionService } from '../firebase/inscriptionService';

export const useInscriptions = (autoLoad = true) => {
    const [inscriptions, setInscriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Cargar todas las inscripciones
    const loadInscriptions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await inscriptionService.getAllInscriptions();

            if (result.success) {
                setInscriptions(result.data);
                setLastUpdated(new Date());
                return result.data;
            } else {
                throw new Error(result.message || result.error || 'Error al cargar inscripciones');
            }
        } catch (err) {
            console.error('Error en useInscriptions.loadInscriptions:', err);
            setError(err.message);
            setInscriptions([]);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Obtener una inscripción específica por ID
    const getInscriptionById = useCallback((id) => {
        return inscriptions.find(insc => insc.id === id);
    }, [inscriptions]);

    // Buscar inscripciones por texto
    const searchInscriptions = useCallback((searchTerm) => {
        if (!searchTerm.trim()) return inscriptions;

        const term = searchTerm.toLowerCase();
        return inscriptions.filter(insc =>
            (insc.nombreNino || '').toLowerCase().includes(term) ||
            (insc.apellidos || '').toLowerCase().includes(term) ||
            (insc.padre?.nombre || '').toLowerCase().includes(term) ||
            (insc.padre?.apellidos || '').toLowerCase().includes(term) ||
            (insc.dni || '').toLowerCase().includes(term) ||
            (insc.codigoInscripcion || '').toLowerCase().includes(term)
        );
    }, [inscriptions]);

    // Filtrar inscripciones por estado
    const filterByEstado = useCallback((estado) => {
        return inscriptions.filter(insc => insc.estado === estado);
    }, [inscriptions]);

    // Filtrar inscripciones por población
    const filterByPoblacion = useCallback((poblacion) => {
        return inscriptions.filter(insc => insc.poblacion === poblacion);
    }, [inscriptions]);

    // Filtrar inscripciones por rango de fechas
    const filterByDateRange = useCallback((dateFrom, dateTo) => {
        return inscriptions.filter(insc => {
            const inscDate = insc.createdAt?.seconds
                ? new Date(insc.createdAt.seconds * 1000)
                : new Date(insc.fechaCreacion?.seconds * 1000 || 0);

            const from = new Date(dateFrom);
            const to = new Date(dateTo);
            to.setHours(23, 59, 59, 999);

            return inscDate >= from && inscDate <= to;
        });
    }, [inscriptions]);

    // Obtener todas las poblaciones únicas
    const getPoblaciones = useCallback(() => {
        const poblaciones = new Set();
        inscriptions.forEach(insc => {
            if (insc.poblacion) poblaciones.add(insc.poblacion);
        });
        return Array.from(poblaciones).sort();
    }, [inscriptions]);

    // Obtener todos los estados únicos
    const getEstados = useCallback(() => {
        const estados = new Set();
        inscriptions.forEach(insc => {
            if (insc.estado) estados.add(insc.estado);
        });
        return Array.from(estados).sort();
    }, [inscriptions]);

    // Actualizar estado de una inscripción
    const updateInscriptionStatus = useCallback(async (inscriptionId, newStatus) => {
        try {
            const result = await inscriptionService.updateInscriptionStatus(inscriptionId, newStatus);
            
            if (result.success) {
                // Actualizar estado local
                setInscriptions(prev =>
                    prev.map(insc =>
                        insc.id === inscriptionId
                            ? { ...insc, estado: newStatus }
                            : insc
                    )
                );
                return result;
            }
            throw new Error(result.message || 'Error al actualizar');
        } catch (err) {
            console.error('Error en updateInscriptionStatus:', err);
            return { success: false, error: err.message };
        }
    }, []);

    // Eliminar una inscripción
    const deleteInscription = useCallback(async (inscriptionId) => {
        try {
            const result = await inscriptionService.deleteInscription(inscriptionId);
            
            if (result.success) {
                // Actualizar estado local
                setInscriptions(prev => prev.filter(insc => insc.id !== inscriptionId));
                return result;
            }
            throw new Error(result.message || 'Error al eliminar');
        } catch (err) {
            console.error('Error en deleteInscription:', err);
            return { success: false, error: err.message };
        }
    }, []);

    // Cargar automáticamente al montar el componente
    useEffect(() => {
        if (autoLoad) {
            loadInscriptions();
        }
    }, [autoLoad, loadInscriptions]);

    return {
        // Estado
        inscriptions,
        loading,
        error,
        lastUpdated,
        
        // Métodos de carga
        loadInscriptions,
        
        // Métodos de búsqueda y filtrado
        getInscriptionById,
        searchInscriptions,
        filterByEstado,
        filterByPoblacion,
        filterByDateRange,
        getPoblaciones,
        getEstados,
        
        // Métodos de actualización
        updateInscriptionStatus,
        deleteInscription,
        
        // Información útil
        total: inscriptions.length
    };
};

export default useInscriptions;
