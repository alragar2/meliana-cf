import React, { useState, useEffect }from 'react';
import { exportToExcel, prepareDataForExport, exportToExcelByCategories } from '../../utils/excelExporter';
import { savePaymentToFirestore } from '../../firebase/modify-db';
import '../../css/dataTabs.css';

export const handleExportExcel = (filteredInscriptions, activeTab, calcularCategoria, formatTimestamp) => {
    if (filteredInscriptions.length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    const tabNames = { 'player': 'Jugadores', 'parent': 'Padres', 'payment': 'Pagos', 'personal-data-player': 'Datos Personales Jugadores' };

        const dataAgrupada = {};

        filteredInscriptions.forEach(inscription => {
            const cat = calcularCategoria(inscription.fechaNacimiento) || 'Sin Categoría';
            if (!dataAgrupada[cat]) dataAgrupada[cat] = [];

            dataAgrupada[cat].push({
                'Nombre': inscription.nombreNino + ' ' + inscription.apellidos,
                'Año': inscription.fechaNacimiento?.split('-')[0],
                'Dorsal': " " 
            });
        });

        exportToExcelByCategories(dataAgrupada, `Inscripciones_Jugadores_Por_Categoria`);
    
};

export const handleExportDB = (inscriptions, calcularCategoria, formatTimestamp) => {
    if (inscriptions.length === 0) {
        alert('No hay datos para exportar');
        return;
    }
    const data = prepareDataForExport(inscriptions, 'complete', calcularCategoria, formatTimestamp);
    exportToExcel(data, `Inscripciones_Completa`);
};
    
const DataTabs = ({ activeTab, onTabChange, filteredInscriptions, formatTimestamp, calcularCategoria }) => {

    const [localInscriptions, setLocalInscriptions] = useState(filteredInscriptions);

    useEffect(() => {
        setLocalInscriptions(filteredInscriptions);
    }, [filteredInscriptions]);

    const handleSave = async (id, campo, valor) => {
        // Buscamos los pagos actuales para pasarlos a la función
        const inscripcion = localInscriptions.find(ins => ins.id === id);
        
        try {
            const result = await savePaymentToFirestore(id, campo, valor, inscripcion.pagos);
            if (result.success) {
                // Actualizar el total pagado en el estado local para que se refleje inmediatamente
                setLocalInscriptions(prevInscriptions => 
                    prevInscriptions.map(ins => 
                        ins.id === id 
                            ? { ...ins, totalPagado: result.nuevoTotalPagado } 
                            : ins
                    )
                );
            } else {
                alert("Error al guardar en la base de datos. La respuesta no fue exitosa.");
            }
        } catch (err) {
            alert("Error al guardar en la base de datos");
        }
    };

    const handleInputChange = (id, campo, valor) => {
        const nuevas = localInscriptions.map(ins => {
            if (ins.id === id) {
                return { ...ins, pagos: { ...ins.pagos, [campo]: valor } };
            }
            return ins;
        });
        setLocalInscriptions(nuevas);
    };

    const tabs = [
        { id: 'player', icon: 'fas fa-child', label: 'Datos Jugador' },
        { id: 'parent', icon: 'fas fa-user', label: 'Datos Padre' },
        { id: 'payment', icon: 'fas fa-credit-card', label: 'Datos Pago' },
        { id: 'personal-data-player', icon: 'fas fa-id-card', label: 'Datos Personales Jugador' },
        { id: 'cuotes_payment', icon: 'fas fa-money-bill-wave', label: 'Pagos de cuotas' }
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
                                    <th style={{ padding: '12px 8px' }}>Total a Pagar</th>
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
                                                {inscription.categoria || calcularCategoria(inscription.fechaNacimiento)}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.totalAPagar}€</td>
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
                                    <th style={{ padding: '12px 8px' }}>Teléfono</th>
                                    <th style={{ padding: '12px 8px' }}>Email</th>
                                    <th style={{ padding: '12px 8px' }}>DNI</th>
                                    <th style={{ padding: '12px 8px' }}>Parentesco</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInscriptions.map((inscription) => (
                                    <tr key={inscription.id} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '12px 8px' }}>{inscription.codigoInscripcion}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.nombreNino} {inscription.apellidos}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.padre?.nombre} {inscription.padre?.apellidos}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.padre?.telefono}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.padre?.email}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.padre?.dni}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.padre?.parentesco}</td>
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
                                    <th style={{ padding: '12px 8px' }}>Lotería</th>
                                    <th style={{ padding: '12px 8px' }}>Total a Pagar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInscriptions.map((inscription) => (
                                    <tr key={inscription.id} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '12px 8px' }}>{inscription.codigoInscripcion}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.nombreNino} {inscription.apellidos}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.banco?.nombre}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.banco?.iban}</td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <span style={{
                                                backgroundColor: inscription.loteria ? '#c8e6c9' : '#ffcdd2',
                                                color: inscription.loteria ? '#2e7d32' : '#c62828',
                                                padding: '4px 8px'
                                                }}>
                                                {inscription.loteria ? 'Sí' : 'No'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.totalAPagar}€</td>
                                    </tr>
                                ))}
                            </tbody>
                        </>
                    )}{activeTab === 'personal-data-player' && (
                        <>
                            <thead>
                                <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
                                    <th style={{ padding: '12px 8px' }}>Código</th>
                                    <th style={{ padding: '12px 8px' }}>Nombre Niño/a</th>
                                    <th style={{ padding: '12px 8px' }}>Población</th>
                                    <th style={{ padding: '12px 8px' }}>DNI</th>
                                    <th style={{ padding: '12px 8px' }}>CP</th>
                                    <th style={{ padding: '12px 8px' }}>Fecha Nac.</th>
                                    <th style={{ padding: '12px 8px' }}>Teléfono</th>
                                    <th style={{ padding: '12px 8px' }}>Nacionalidad</th>
                                    <th style={{ padding: '12px 8px' }}>Lugar Nac.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInscriptions.map((inscription) => (
                                    <tr key={inscription.id} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '12px 8px' }}>{inscription.codigoInscripcion}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.nombreNino} {inscription.apellidos}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.poblacion}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.dni}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.cp}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.fechaNacimiento}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.telefono}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.nacionalidad}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.lugarNacimiento}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </>
                    )}{activeTab === 'cuotes_payment' && (
                        <>
                            <thead>
                                <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
                                    <th style={{ padding: '12px 8px' }}>Código</th>
                                    <th style={{ padding: '12px 8px' }}>Nombre Niño/a</th>
                                    <th style={{ padding: '12px 8px' }}>Inscripción</th>
                                    <th style={{ padding: '12px 8px' }}>Cuota 1</th>
                                    <th style={{ padding: '12px 8px' }}>Cuota 2</th>
                                    <th style={{ padding: '12px 8px' }}>Cuota 3</th>
                                    <th style={{ padding: '12px 8px' }}>Cuota 4</th>
                                    <th style={{ padding: '12px 8px' }}>Cuota 5</th>
                                    <th style={{ padding: '12px 8px' }}>Cuota 6</th>
                                    <th style={{ padding: '12px 8px' }}>Cuota 7</th>
                                    <th style={{ padding: '12px 8px' }}>Cuota 8</th>
                                    <th style={{ padding: '12px 8px' }}>Cuota 9</th>
                                    <th style={{ padding: '12px 8px' }}>Cuota Loteria</th>
                                    <th style={{ padding: '12px 8px' }}>Lotería</th>
                                    <th style={{ padding: '12px 8px' }}>Total a Pagar</th>
                                    <th style={{ padding: '12px 8px' }}>Total Pagado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {localInscriptions.map((inscription) => (
                                    <tr key={inscription.id} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '12px 8px' }}>{inscription.codigoInscripcion}</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.nombreNino} {inscription.apellidos}</td>
                                        {/* Campo Inscripción Editable */}
                                        <td style={{ padding: '4px' }}>
                                            <div className="cuota-cell-container">
                                                <input 
                                                    type="number"
                                                    value={inscription.pagos?.inscripcion || 0}
                                                    className="input-cuota"
                                                    onChange={(e) => handleInputChange(inscription.id, 'inscripcion', e.target.value)}
                                                    onBlur={(e) => handleSave(inscription.id, 'inscripcion', e.target.value)}
                                                />
                                                <span>€</span>
                                            </div>
                                        </td>

                                        {/* Cuotas del 1 al 9 Dinámicas */}
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                            <td key={num} style={{ padding: '4px' }}>
                                                <div className="cuota-cell-container">
                                                    <input 
                                                        type="number"
                                                        value={inscription.pagos?.[`cuota_${num}`] || 0}
                                                        className="input-cuota"
                                                        onChange={(e) => handleInputChange(inscription.id, `cuota_${num}`, e.target.value)}
                                                        onBlur={(e) => handleSave(inscription.id, `cuota_${num}`, e.target.value)}
                                                    /> 
                                                    <span>€</span>
                                                </div>
                                            </td>
                                        ))}

                                        <td style={{ padding: '4px' }}>
                                            <div className="cuota-cell-container">
                                                <input 
                                                    type="number"
                                                    value={inscription.pagos?.cuota_loteria || 0}
                                                    className="input-cuota"
                                                    onChange={(e) => handleInputChange(inscription.id, 'cuota_loteria', e.target.value)}
                                                    onBlur={(e) => handleSave(inscription.id, 'cuota_loteria', e.target.value)}
                                                />
                                                <span>€</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <span style={{
                                                backgroundColor: inscription.loteria ? '#c8e6c9' : '#ffcdd2',
                                                color: inscription.loteria ? '#2e7d32' : '#c62828',
                                                padding: '4px 8px'
                                                }}>
                                                {inscription.loteria ? 'Sí' : 'No'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.totalAPagar}€</td>
                                        <td style={{ padding: '12px 8px' }}>{inscription.totalPagado}€</td>
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