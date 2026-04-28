import React from 'react';
import { exportToExcel, prepareDataForExport } from '../../utils/excelExporter';

export const handleExportExcel = (filteredInscriptions, activeTab, calcularCategoria, formatTimestamp) => {
        const data = prepareDataForExport(filteredInscriptions, activeTab, calcularCategoria, formatTimestamp);
        
        if (data.length === 0) {
            alert('No hay datos para exportar');
            return;
        }

        const tabNames = {
            'player': 'Jugadores',
            'parent': 'Padres',
            'payment': 'Pagos'
        };

        exportToExcel(data, `inscripciones_${tabNames[activeTab]}`);
    };
    
const DataTabs = ({ activeTab, onTabChange, filteredInscriptions, formatTimestamp, calcularCategoria }) => {
    const tabs = [
        { id: 'player', icon: 'fas fa-child', label: 'Datos del Jugador' },
        { id: 'parent', icon: 'fas fa-user', label: 'Datos del Padre' },
        { id: 'payment', icon: 'fas fa-credit-card', label: 'Datos del Pago' }
    ];

    

    return (
        <>
            <div className="tabs-header">
                <div className="tabs-container">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => onTabChange(tab.id)}
                        >
                            <i className={tab.icon}></i>
                            <span className="tab-text">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {filteredInscriptions.length === 0 ? (
                <div className="no-inscriptions">
                    <i className="fas fa-inbox fa-3x"></i>
                    <h3>No hay inscripciones</h3>
                    <p>No se encontraron inscripciones que coincidan con los filtros aplicados</p>
                </div>
            ) : (
                <table className="inscriptions-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    {activeTab === 'player' && (
                        <>
                            <thead>
                                <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
                                    <th style={{ padding: '12px 8px' }}>Código</th>
                                    <th style={{ padding: '12px 8px' }}>Nombre Niño/a</th>
                                    <th style={{ padding: '12px 8px' }}>Apellidos</th>
                                    <th style={{ padding: '12px 8px' }}>DNI</th>
                                    <th style={{ padding: '12px 8px' }}>Fecha Nac.</th>
                                    <th style={{ padding: '12px 8px' }}>Categoría</th>
                                    <th style={{ padding: '12px 8px' }}>Fecha Inscripción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInscriptions.map((inscription) => (
                                    <tr key={inscription.id} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '12px 8px' }}>{inscription.codigoInscripcion}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.nombreNino}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.apellidos}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.dni}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.fechaNacimiento}</td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <span style={{ 
                                                backgroundColor: '#e3f2fd', 
                                                color: '#1976d2', 
                                                padding: '4px 8px', 
                                                borderRadius: '12px', 
                                                fontSize: '0.85rem', 
                                                fontWeight: '500' 
                                            }}>
                                                {calcularCategoria(inscription.fechaNacimiento)}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 8px' }}>{formatTimestamp(inscription.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </>
                    )}
                    {activeTab === 'parent' && (
                        <>
                            <thead>
                                <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
                                    <th style={{ padding: '12px 8px' }}>Código</th>
                                    <th style={{ padding: '12px 8px' }}>Nombre Niño/a</th>
                                    <th style={{ padding: '12px 8px' }}>Padre/Tutor</th>
                                    <th style={{ padding: '12px 8px' }}>Apellidos Padre</th>
                                    <th style={{ padding: '12px 8px' }}>Teléfono</th>
                                    <th style={{ padding: '12px 8px' }}>Email</th>
                                    <th style={{ padding: '12px 8px' }}>Fecha Inscripción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInscriptions.map((inscription) => (
                                    <tr key={inscription.id} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '12px 8px' }}>{inscription.codigoInscripcion}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.nombreNino} {inscription.apellidos}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.padre?.nombre}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.padre?.apellidos}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.telefono}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.padre?.email}</td>
                                        <td style={{ padding: '12px 8px' }}>{formatTimestamp(inscription.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </>
                    )}
                    {activeTab === 'payment' && (
                        <>
                            <thead>
                                <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
                                    <th style={{ padding: '12px 8px' }}>Código</th>
                                    <th style={{ padding: '12px 8px' }}>Nombre Niño/a</th>
                                    <th style={{ padding: '12px 8px' }}>Nombre Banco</th>
                                    <th style={{ padding: '12px 8px' }}>IBAN</th>
                                    <th style={{ padding: '12px 8px' }}>Fecha Inscripción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInscriptions.map((inscription) => (
                                    <tr key={inscription.id} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '12px 8px' }}>{inscription.codigoInscripcion}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.nombreNino} {inscription.apellidos}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.banco?.nombre}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.banco?.iban}</td>
                                        <td style={{ padding: '12px 8px' }}>{formatTimestamp(inscription.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </>
                    )}
                </table>
            )}
        </>
    );
};

export default DataTabs;