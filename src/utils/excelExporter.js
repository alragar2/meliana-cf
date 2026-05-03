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
                'Categoría': inscription.categoria || calcularCategoria(inscription.fechaNacimiento),
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
        case 'personal-data-player':
            return filteredInscriptions.map(inscription => ({
                'Código': inscription.codigoInscripcion,
                'Nombre': inscription.nombreNino,
                'Apellidos': inscription.apellidos,
                'DNI': inscription.dni,
                'Fecha Nacimiento': inscription.fechaNacimiento,
                'Categoría': calcularCategoria(inscription.fechaNacimiento),
                'Fecha Inscripción': formatTimestamp(inscription.createdAt)
            }));
        case 'complete':
            return filteredInscriptions.map(inscription => ({
                'Código': inscription.codigoInscripcion,
                'Nombre': inscription.nombreNino,
                'Apellidos': inscription.apellidos,
                'DNI': inscription.dni,
                'Fecha Nacimiento': inscription.fechaNacimiento,
                'Categoría': inscription.categoria || calcularCategoria(inscription.fechaNacimiento),
                'Dirección': inscription.direccion,
                'Población': inscription.poblacion,
                'CP': inscription.cp,
                'Teléfono': inscription.telefono,
                'Nacionalidad': inscription.nacionalidad,
                'Lugar de Nacimiento': inscription.lugarNacimiento,
                'Sexo': inscription.sexo || '-',
                'Hermanos en Club': inscription.hermanosEnClub ? 'Sí' : 'No',
                'Lotería': inscription.loteria ? 'Sí' : 'No',
                'Beneficios': inscription.beneficios ? 'Sí' : 'No',
                'Nombre Padre/Tutor': inscription.padre?.nombre || '-',
                'Apellidos Padre/Tutor': inscription.padre?.apellidos || '-',
                'Teléfono Padre/Tutor': inscription.padre?.telefono || '-',
                'Email Padre/Tutor': inscription.padre?.email || '-',
                'DNI Padre/Tutor': inscription.padre?.dni || '-',
                'Parentesco': inscription.padre?.parentesco || '-',
                'Nombre Banco': inscription.banco?.nombre || '-',
                'IBAN': inscription.banco?.iban || '-',
                'Fecha Inscripción': formatTimestamp(inscription.createdAt)
            }));

        default:
            return [];
    }
};

export const exportToExcelByCategories = (groupedData, fileName = 'inscripciones_por_categoria') => {
    import('xlsx-js-style').then(XLSX => {
        const wb = XLSX.utils.book_new();

        // Iteramos sobre cada categoría (cada pestaña)
        Object.entries(groupedData).forEach(([categoryName, data]) => {
            if (data.length > 0) {
                const headers = Object.keys(data[0]);

                const titleStyle = {
                    fill: { fgColor: { rgb: "FF9900" } }, // Naranja
                    font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } }, // Tamaño 16, Blanco
                    alignment: { horizontal: "center", vertical: "center" }
                };

                const aoa = [
                    '',
                    ['', categoryName], 
                    ['', ...headers],
                    ...data.map(item => ['', ...Object.values(item)])
                ];
                const ws = XLSX.utils.aoa_to_sheet(aoa); // Convertir datos a hoja de Excel
                
                // Ajustar anchos de columna (opcional pero recomendado)
                const dataColWidths = headers.map(key => ({
                    wch: Math.min(Math.max(key.length, ...data.map(item => String(item[key] || '').length)) + 2, 50)
                }));
                ws['!cols'] = [{ wch: 5 }, ...dataColWidths];

                XLSX.utils.sheet_add_aoa(ws, [[ { v: categoryName.toUpperCase(), s: titleStyle } ]], { origin: "B2" });

                // Añadir la hoja al libro con el nombre de la categoría
                XLSX.utils.book_append_sheet(wb, ws, categoryName.substring(0, 64)); // Excel limita a 64 caracteres
            }
        });

        const timestamp = new Date().toLocaleString('es-ES').replace(/[\/:]/g, '-');
        XLSX.writeFile(wb, `${fileName}_${timestamp}.xlsx`);
    });
};

export const exportDatabaseToExcel = (inscriptions, fileName = 'base_de_datos_meliana_cf') => {
    import('xlsx').then(XLSX => {
        const wb = XLSX.utils.book_new();

        // --- Hoja 1: Datos Completos ---
        const completeData = inscriptions.map(inscription => ({
            'Código': inscription.codigoInscripcion,
            'Nombre': inscription.nombreNino,
            'Apellidos': inscription.apellidos,
            'DNI': inscription.dni,
            'Fecha Nacimiento': inscription.fechaNacimiento,
            'Categoría': inscription.categoria,
            'Dirección': inscription.direccion,
            'Población': inscription.poblacion,
            'CP': inscription.cp,
            'Teléfono': inscription.telefono,
            'Nacionalidad': inscription.nacionalidad,
            'Lugar de Nacimiento': inscription.lugarNacimiento,
            'Sexo': inscription.sexo || '-',
            'Hermanos en Club': inscription.hermanosEnClub ? 'Sí' : 'No',
            'Participa Lotería': inscription.loteria ? 'Sí' : 'No',
            'Nombre Padre/Tutor': inscription.padre?.nombre || '-',
            'Apellidos Padre/Tutor': inscription.padre?.apellidos || '-',
            'Teléfono Padre/Tutor': inscription.padre?.telefono || '-',
            'Email Padre/Tutor': inscription.padre?.email || '-',
            'DNI Padre/Tutor': inscription.padre?.dni || '-',
            'Parentesco': inscription.padre?.parentesco || '-',
            'Nombre Banco': inscription.banco?.nombre || '-',
            'IBAN': inscription.banco?.iban || '-',
            'Fecha Inscripción': inscription.createdAt && inscription.createdAt.seconds 
                ? new Date(inscription.createdAt.seconds * 1000).toLocaleDateString('es-ES') 
                : '-',
        }));
        
        const wsComplete = XLSX.utils.json_to_sheet(completeData);
        if (completeData.length > 0) {
            const maxWidth = 50;
            const colWidths = Object.keys(completeData[0]).map(key => {
                const maxLen = Math.max(
                    key.length,
                    ...completeData.map(item => String(item[key] || '').length)
                );
                return { wch: Math.min(maxLen + 2, maxWidth) };
            });
            wsComplete['!cols'] = colWidths;
        }
        XLSX.utils.book_append_sheet(wb, wsComplete, 'Datos Completos');

        // --- Hoja 2: Ingresos ---
        const ingresosData = inscriptions.map(inscription => {
            const pagos = inscription.pagos || {};
            const data = {
                'ID': inscription.codigoInscripcion,
                'Nombre': inscription.nombreNino,
                'Equipo': inscription.categoria,
                'Hermanos': inscription.hermanosEnClub ? 'Sí' : 'No',
                'Lotería': inscription.loteria ? 'Sí' : 'No',
                'IBAN': inscription.banco?.iban || '-',
                'Pago contado': pagos.contado || " ",
                'Inscripción': pagos.inscripcion || 0,
            };
            for (let i = 1; i <= 9; i++) {
                data[`Cuota ${i}`] = pagos[`cuota_${i}`] || 0;
            }
            data['Pago Lotería'] = pagos.cuota_loteria || 0;
            return data;
        });

        const wsIngresos = XLSX.utils.json_to_sheet(ingresosData);
        if (ingresosData.length > 0) {
            const maxWidth = 50;
            const colWidths = Object.keys(ingresosData[0]).map(key => {
                const maxLen = Math.max(
                    key.length,
                    ...ingresosData.map(item => String(item[key] || '').length)
                );
                return { wch: Math.min(maxLen + 2, maxWidth) };
            });
            wsIngresos['!cols'] = colWidths;
        }
        XLSX.utils.book_append_sheet(wb, wsIngresos, 'Ingresos');

        const timestamp = new Date().toLocaleString('es-ES').replace(/[\/:]/g, '-');
        XLSX.writeFile(wb, `${fileName}_${timestamp}.xlsx`);
    }).catch(err => {
        console.error('Error al exportar a Excel:', err);
        alert('Error al exportar a Excel. Intenta de nuevo.');
    });
};
