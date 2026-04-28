// Utilidad para exportar datos a Excel
export const exportToExcel = (data, fileName = 'exportacion') => {
    // Importar dinámicamente xlsx cuando sea necesario
    import('xlsx').then(XLSX => {
        // Crear un nuevo workbook
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Datos');

        // Ajustar anchos de columna automáticamente
        const maxWidth = 50;
        const colWidths = [];
        
        if (data.length > 0) {
            Object.keys(data[0]).forEach(key => {
                const maxLen = Math.max(
                    key.length,
                    Math.max(...data.map(item => {
                        const value = item[key];
                        return String(value || '').length;
                    }))
                );
                colWidths.push({ wch: Math.min(maxLen + 2, maxWidth) });
            });
            ws['!cols'] = colWidths;
        }

        // Descargar el archivo
        const timestamp = new Date().toLocaleString('es-ES').replace(/[\/:]/g, '-');
        XLSX.writeFile(wb, `${fileName}_${timestamp}.xlsx`);
    }).catch(err => {
        console.error('Error al exportar a Excel:', err);
        alert('Error al exportar a Excel. Intenta de nuevo.');
    });
};

// Función para preparar datos según la pestaña activa
export const prepareDataForExport = (filteredInscriptions, activeTab, calcularCategoria, formatTimestamp) => {
    switch (activeTab) {
        case 'player':
            return filteredInscriptions.map(inscription => ({
                'Código': inscription.codigoInscripcion,
                'Nombre': inscription.nombreNino,
                'Apellidos': inscription.apellidos,
                'DNI': inscription.dni,
                'Fecha Nacimiento': inscription.fechaNacimiento,
                'Categoría': calcularCategoria(inscription.fechaNacimiento),
                'Fecha Inscripción': formatTimestamp(inscription.createdAt)
            }));

        case 'parent':
            return filteredInscriptions.map(inscription => ({
                'Código': inscription.codigoInscripcion,
                'Nombre del Niño': `${inscription.nombreNino} ${inscription.apellidos}`,
                'Padre/Tutor': inscription.padre?.nombre || '-',
                'Apellidos Padre': inscription.padre?.apellidos || '-',
                'Teléfono': inscription.telefono || '-',
                'Email': inscription.padre?.email || '-',
                'Fecha Inscripción': formatTimestamp(inscription.createdAt)
            }));

        case 'payment':
            return filteredInscriptions.map(inscription => ({
                'Código': inscription.codigoInscripcion,
                'Nombre del Niño': `${inscription.nombreNino} ${inscription.apellidos}`,
                'Nombre Banco': inscription.banco?.nombre || '-',
                'IBAN': inscription.banco?.iban || '-',
                'Fecha Inscripción': formatTimestamp(inscription.createdAt)
            }));

        default:
            return [];
    }
};
