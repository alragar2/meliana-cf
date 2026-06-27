import React from 'react';
import { calcularCategoria, obtenerCategoriaValida } from '../../utils/categories';

const FiltersPanel = ({ 
    showFilters, 
    filters, 
    inscriptions, 
    onFilterChange, 
    onClearFilters, 
    onToggleFilters 
}) => {
    // Obtener categorías únicas basadas en la categoría guardada o en el cálculo por fecha y sexo
    const getUniqueCategories = () => {
        const categories = [];
        inscriptions.forEach(inscription => {
            const category = obtenerCategoriaValida(inscription);
            if (category && !categories.includes(category)) {
                categories.push(category);
            }
        });
        return categories.sort();
    };

    // Obtener estados únicos
    const getUniqueStatuses = () => {
        const statuses = inscriptions.map(inscription => inscription.estado);
        return [...new Set(statuses)].filter(Boolean).sort();
    };

    // Obtener poblaciones únicas
    const getUniqueLocations = () => {
        const locations = inscriptions.map(inscription => inscription.poblacion);
        return [...new Set(locations)].filter(Boolean).sort();
    };

    // Opciones de ordenamiento
    const getSortOptions = () => {
        return [
            { value: 'newest', label: 'Más recientes primero' },
            { value: 'oldest', label: 'Más antiguos primero' }
        ];
    };

    return (
        <>
            {/* Overlay para móvil */}
            {showFilters && (
                <div 
                    className="filters-overlay"
                    onClick={onToggleFilters}
                ></div>
            )}

            {/* Panel de Filtros */}
            <div className={`filters-panel ${showFilters ? 'open' : ''}`}>
                <div className="filters-header">
                    <h3>
                        <i className="fas fa-filter"></i>
                        Filtros
                    </h3>
                    <div className="filters-header-actions">
                        <button 
                            className="btn-clear-filters"
                            onClick={onClearFilters}
                            title="Limpiar filtros"
                        >
                            <i className="fas fa-eraser"></i>
                            Limpiar
                        </button>
                        <button 
                            className="btn-close-filters"
                            onClick={onToggleFilters}
                            title="Cerrar filtros"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div className="filters-content">
                    <div className="filter-group">
                        <label htmlFor="categoria-filter">Categoría</label>
                        <select
                            id="categoria-filter"
                            className="filter-select"
                            value={filters.categoria || ''}
                            onChange={(e) => onFilterChange('categoria', e.target.value)}
                        >
                            <option value="">Todas las categorías</option>
                            {getUniqueCategories().map(categoria => (
                                <option key={categoria} value={categoria}>
                                    {categoria}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="poblacion-filter">Población</label>
                        <select
                            id="poblacion-filter"
                            className="filter-select"
                            value={filters.poblacion || ''}
                            onChange={(e) => onFilterChange('poblacion', e.target.value)}
                        >
                            <option value="">Todas las poblaciones</option>
                            {getUniqueLocations().map(poblacion => (
                                <option key={poblacion} value={poblacion}>
                                    {poblacion}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="fecha-desde-filter">Fecha desde</label>
                        <input
                            type="date"
                            id="fecha-desde-filter"
                            className="filter-input"
                            value={filters.fechaDesde || ''}
                            onChange={(e) => onFilterChange('fechaDesde', e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="fecha-hasta-filter">Fecha hasta</label>
                        <input
                            type="date"
                            id="fecha-hasta-filter"
                            className="filter-input"
                            value={filters.fechaHasta || ''}
                            onChange={(e) => onFilterChange('fechaHasta', e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="sort-filter">Ordenar por</label>
                        <select
                            id="sort-filter"
                            className="filter-select"
                            value={filters.sortBy || 'newest'}
                            onChange={(e) => onFilterChange('sortBy', e.target.value)}
                        >
                            {getSortOptions().map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FiltersPanel;
