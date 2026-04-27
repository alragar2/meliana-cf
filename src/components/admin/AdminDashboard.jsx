import React, { useState, useEffect } from 'react';
import { inscriptionService } from '../../firebase/inscriptionService';
import { authService } from '../../firebase/authService';
import FiltersPanel from './FiltersPanel';
import '../../css/admin-dashboard.css';

const AdminDashboard = ({ user, onLogout }) => {
    const [inscriptions, setInscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        sortBy: 'newest'
    });

    useEffect(() => {
        loadInscriptions();
    }, []);

    const loadInscriptions = async () => {
        try {
            setLoading(true);
            setError('');
            
            const result = await inscriptionService.getAllInscriptions();
            
            if (result.success) {
                setInscriptions(result.data);
                setError('');
            } else {
                console.error('Error al cargar inscripciones:', result);
                setError(result.message || result.error || 'Error al cargar inscripciones');
                setInscriptions([]);
            }
        } catch (error) {
            console.error('Error inesperado al cargar inscripciones:', error);
            setError('Error inesperado al cargar las inscripciones');
            setInscriptions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        if (window.confirm('¿Está seguro que desea cerrar sesión?')) {
            try {
                await authService.signOutAdmin();
                onLogout();
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
                onLogout(); // Cerrar de todas formas
            }
        }
    };

    const filteredInscriptions = inscriptions.filter(inscription => {
        // Filtro de búsqueda por texto
        const padreNombre = inscription.padre?.nombre || '';
        const padreApellidos = inscription.padre?.apellidos || '';
        
        const matchesSearch = 
            (inscription.nombreNino || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (inscription.apellidos || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            padreNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            padreApellidos.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesSearch;
    }).sort((a, b) => {
        // Aplicar ordenamiento según el filtro seleccionado
        switch (filters.sortBy) {
            case 'oldest':
                // Más antiguos primero
                const aDateOld = a.createdAt?.seconds || a.fechaCreacion?.seconds || 0;
                const bDateOld = b.createdAt?.seconds || b.fechaCreacion?.seconds || 0;
                return aDateOld - bDateOld;
            
            case 'newest':
            default:
                // Más recientes primero (por defecto)
                const aDateNew = a.createdAt?.seconds || a.fechaCreacion?.seconds || 0;
                const bDateNew = b.createdAt?.seconds || b.fechaCreacion?.seconds || 0;
                return bDateNew - aDateNew;
        }
    });

    const formatTimestamp = (timestamp) => {
        try {
            let date;
            if (timestamp && timestamp.seconds) {
                // Firestore timestamp
                date = new Date(timestamp.seconds * 1000);
            } else {
                date = new Date(timestamp);
            }
            return date.toLocaleString('es-ES');
        } catch {
            return 'Fecha no disponible';
        }
    };

    // Manejar cambios en filtros
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    // Limpiar filtros
    const clearFilters = () => {
        setFilters({
            sortBy: 'newest'
        });
    };

    // Toggle del panel de filtros
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <i className="fas fa-spinner fa-spin fa-2x"></i>
                <p>Cargando inscripciones...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <div className="admin-header-content">
                    <h1>
                        <i className="fas fa-users"></i>
                        Gestión de Inscripciones
                    </h1>
                    <div className="admin-user-info">
                        <span className="welcome-text">
                            <i className="fas fa-user-shield"></i>
                            {user?.email || 'Administrador'}
                        </span>
                    </div>
                    <div className="admin-header-actions">
                        <button onClick={loadInscriptions} className="btn-refresh">
                            <i className="fas fa-sync-alt"></i>
                            Actualizar
                        </button>
                        <button onClick={handleLogout} className="btn-logout">
                            <i className="fas fa-sign-out-alt"></i>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            <div className="admin-content">
                {error && (
                    <div className="error-banner">
                        <i className="fas fa-exclamation-triangle"></i>
                        {error}
                    </div>
                )}

                <div className={`admin-layout ${showFilters ? 'filters-open' : 'filters-closed'}`}>
                    <FiltersPanel
                        showFilters={showFilters}
                        filters={filters}
                        inscriptions={inscriptions}
                        onFilterChange={handleFilterChange}
                        onClearFilters={clearFilters}
                        onToggleFilters={toggleFilters}
                    />

                    {/* Contenido Principal */}
                    <div className="main-content">
                        <div className="admin-controls">
                            <div className="controls-row">
                                <button 
                                    className="btn-toggle-filters"
                                    onClick={toggleFilters}
                                >
                                    <i className="fas fa-filter"></i>
                                    {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                                </button>
                                
                                <div className="search-box">
                                    <i className="fas fa-search"></i>
                                    <input
                                        type="text"
                                        placeholder="Buscar por nombre del niño, apellidos o padre..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="stats">
                                <span className="stat-item">
                                    <i className="fas fa-child"></i>
                                    Total: {filteredInscriptions.length} de {inscriptions.length} inscripciones
                                </span>
                            </div>
                        </div>

                        <div className="inscriptions-table-container" style={{ overflowX: 'auto', marginTop: '20px' }}>
                            {filteredInscriptions.length === 0 ? (
                                <div className="no-inscriptions">
                                    <i className="fas fa-inbox fa-3x"></i>
                                    <h3>No hay inscripciones</h3>
                                    <p>
                                        {searchTerm || filters.horario || filters.edad || filters.demarcacion
                                            ? 'No se encontraron inscripciones que coincidan con los filtros aplicados' 
                                            : 'Aún no se han recibido inscripciones para el campus'
                                        }
                                    </p>
                                </div>
                            ) : (
                                <table className="inscriptions-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
                                            <th style={{ padding: '12px 8px' }}>Código</th>
                                            <th style={{ padding: '12px 8px' }}>Nombre Niño/a</th>
                                            <th style={{ padding: '12px 8px' }}>DNI</th>
                                            <th style={{ padding: '12px 8px' }}>Fecha Nac.</th>
                                            <th style={{ padding: '12px 8px' }}>Padre/Tutor</th>
                                            <th style={{ padding: '12px 8px' }}>Teléfono</th>
                                            <th style={{ padding: '12px 8px' }}>Fecha Inscripción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredInscriptions.map((inscription) => (
                                            <tr key={inscription.id} style={{ borderBottom: '1px solid #ddd' }}>
                                                <td style={{ padding: '12px 8px' }}>{inscription.codigoInscripcion}</td>
                                                <td style={{ padding: '12px 8px' }}>{inscription.nombreNino} {inscription.apellidos}</td>
                                                <td style={{ padding: '12px 8px' }}>{inscription.dni}</td>
                                                <td style={{ padding: '12px 8px' }}>{inscription.fechaNacimiento}</td>
                                                <td style={{ padding: '12px 8px' }}>{inscription.padre?.nombre} {inscription.padre?.apellidos}</td>
                                                <td style={{ padding: '12px 8px' }}>{inscription.telefono}</td>
                                                <td style={{ padding: '12px 8px' }}>{formatTimestamp(inscription.createdAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
