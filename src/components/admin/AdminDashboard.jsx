import React, { useState } from 'react';
import { authService } from '../../firebase/authService';
import useInscriptions from '../../hooks/useInscriptions';
import FiltersPanel from './FiltersPanel';
import DataTabs from './DataTabs';
import '../../css/admin-dashboard.css';
import { handleExportExcel, handleExportDB } from './DataTabs'; 
import { calcularCategoria } from '../../utils/categories';

const AdminDashboard = ({ user, onLogout }) => {
    const { inscriptions, loading, error, loadInscriptions, filterByDateRange, getPoblaciones } = useInscriptions(true);
    
    const [activeTab, setActiveTab] = useState('player');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        sortBy: 'newest',
        categoria: '',
        estado: '',
        poblacion: '',
        fechaDesde: '',
        fechaHasta: ''
    });

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

        // Filtro por categoría
        const matchesCategoria = !filters.categoria || calcularCategoria(inscription.fechaNacimiento) === filters.categoria;

        // Filtro por estado
        const matchesEstado = !filters.estado || inscription.estado === filters.estado;

        // Filtro por población
        const matchesPoblacion = !filters.poblacion || inscription.poblacion === filters.poblacion;

        // Filtro por fecha desde
        let matchesFechaDesde = true;
        if (filters.fechaDesde) {
            const fechaInscripcion = inscription.createdAt?.seconds ? new Date(inscription.createdAt.seconds * 1000) : new Date(inscription.fechaCreacion?.seconds * 1000 || 0);
            const fechaFiltro = new Date(filters.fechaDesde);
            matchesFechaDesde = fechaInscripcion >= fechaFiltro;
        }

        // Filtro por fecha hasta
        let matchesFechaHasta = true;
        if (filters.fechaHasta) {
            const fechaInscripcion = inscription.createdAt?.seconds ? new Date(inscription.createdAt.seconds * 1000) : new Date(inscription.fechaCreacion?.seconds * 1000 || 0);
            const fechaFiltro = new Date(filters.fechaHasta);
            fechaFiltro.setHours(23, 59, 59, 999); // Fin del día
            matchesFechaHasta = fechaInscripcion <= fechaFiltro;
        }

        return matchesSearch && matchesCategoria && matchesEstado && matchesPoblacion && matchesFechaDesde && matchesFechaHasta;
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
            sortBy: 'newest',
            categoria: '',
            estado: '',
            poblacion: '',
            fechaDesde: '',
            fechaHasta: ''
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
                        poblaciones={getPoblaciones()}
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
                                        placeholder="Buscar"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="stats">
                                <button
                                    className="btn-export-excel"
                                    onClick={() => handleExportExcel(filteredInscriptions, activeTab, calcularCategoria, formatTimestamp)}
                                    title="Descargar como Excel"
                                >
                                    <i className="fas fa-file-excel"></i>
                                    <span className="export-text">Jugadores</span>
                                </button>
                                <button
                                    className="btn-export-excel"
                                    onClick={() => handleExportDB(filteredInscriptions)  }
                                    title="Descargar como Excel"    
                                >
                                    <i className="fas fa-file-excel"></i>
                                    <span className="export-text">Base de Datos</span>
                                </button>
                                <span className="stat-item">
                                    <i className="fas fa-child"></i>
                                    Total: {filteredInscriptions.length} de {inscriptions.length} inscripciones
                                </span>
                            </div>
                        </div>

                        <div className="inscriptions-table-container" style={{ overflowX: 'auto', marginTop: '20px' }}>
                            <DataTabs
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                                filteredInscriptions={filteredInscriptions}
                                formatTimestamp={formatTimestamp}
                                calcularCategoria={calcularCategoria}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
