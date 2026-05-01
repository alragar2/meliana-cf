export const calcularCategoria = (fechaNacimiento, sexo) => {
        if (!fechaNacimiento) return '-';
        const year = parseInt(fechaNacimiento.substring(0, 4));
        if (isNaN(year)) return '-';

        if (sexo === 'femenino') return 'FEMENINO';

        if (year === 2021 || year === 2022) return 'QUERUBÍN';
        if (year === 2020 || year === 2019) return 'PREBE';
        if (year === 2018) return 'BENJAMÍN 1 AÑO'; 
        if (year === 2017) return 'BENJAMÍN 2 AÑO';
        if (year === 2016) return 'ALEVÍN 1 AÑO';
        if (year === 2015) return 'ALEVÍN 2 AÑO';
        if (year === 2014 || year === 2013) return 'INFANTIL';
        if (year === 2012 || year === 2011) return 'CADETE';
        if (year >= 2008 && year <= 2010) return 'JUVENIL';

        return 'AMATEUR';
    };