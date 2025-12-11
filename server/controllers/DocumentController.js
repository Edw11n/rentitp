const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const Document = require('../models/DocumentModel');
const { validateId } = require('../utils/validators');

// Genera un PDF con la información del apartamento y del arrendador
exports.generatePDF = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar ID
        if (!validateId(id)) {
            return res.status(400).json({ error: 'ID de apartamento inválido' });
        }

        // Obtener datos
        const apartment = await Document.getApartmentById(id);
        if (!apartment) {
            return res.status(404).json({ error: 'Apartamento no encontrado' });
        }

        // Configurar respuesta
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=apartamento_${id}.pdf`);
        res.setHeader('Content-Security-Policy', "default-src 'self'");

        // Generar PDF con márgenes optimizados
        const doc = new PDFDocument({ margin: 40, size: 'A4' });
        
        // Eventos de error
        doc.on('error', (error) => {
            console.error('Error generando PDF:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Error generando PDF' });
            }
        });

        // Pipe al response
        doc.pipe(res);

        // ============ ENCABEZADO ============
        // Fondo del encabezado (color profesional azul)
        doc.rect(0, 0, doc.page.width, 100)
           .fillAndStroke('#1e40af', '#1e40af');

        // Logo/Nombre de la empresa
        doc.fontSize(32)
           .font('Helvetica-Bold')
           .fillColor('#ffffff')
           .text('RentUp', 50, 25, { align: 'left' })
           .fontSize(11)
           .font('Helvetica')
           .text('Tu plataforma de confianza para encontrar apartamentos', 50, 62, { align: 'left', width: 300 });

        // Fecha y número de documento
        doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#ffffff')
           .text(`Documento generado: ${new Date().toLocaleDateString('es-ES')}`, 50, 25, { align: 'right' })
           .text(`Ref: APT-${id}`, 50, 40, { align: 'right' });

        // Espacio después del encabezado
        doc.moveDown(2.5);

        // ============ TÍTULO PRINCIPAL ============
        doc.fillColor('#1e40af')
           .fontSize(18)
           .font('Helvetica-Bold')
           .text('DETALLES DEL APARTAMENTO', { underline: true })
           .moveDown(0.3);

        // ============ SECCIÓN DE INFORMACIÓN DEL APARTAMENTO ============
        doc.fontSize(12)
           .fillColor('#000000')
           .font('Helvetica-Bold')
           .text('Ubicación y Detalles');

        doc.moveDown(0.2);

        // Crear tabla de información del apartamento
        const apartmentTableTop = doc.y;
        const apartmentTableLeft = 50;
        const apartmentTableWidth = doc.page.width - 100;

        // Encabezado de tabla
        drawTableRow(doc, apartmentTableLeft, doc.y, apartmentTableWidth, 
                     ['Campo', 'Valor'], 
                     ['#e5e7eb', '#e5e7eb'],
                     ['#1e40af', '#1e40af'], 
                     true);

        // Filas de datos
        const apartmentData = [
            ['Dirección', apartment.direccion_apt],
            ['Barrio', apartment.barrio],
            ['Latitud', apartment.latitud_apt],
            ['Longitud', apartment.longitud_apt],
            ['Información Adicional', apartment.info_add_apt || 'N/A']
        ];

        let alternateColor = true;
        apartmentData.forEach((row) => {
            const bgColor = alternateColor ? '#f9fafb' : '#ffffff';
            drawTableRow(doc, apartmentTableLeft, doc.y, apartmentTableWidth, 
                         row, 
                         [bgColor, bgColor],
                         ['#374151', '#374151'],
                         false);
            alternateColor = !alternateColor;
        });

        // Línea separadora
        doc.strokeColor('#d1d5db')
           .moveTo(apartmentTableLeft, doc.y)
           .lineTo(apartmentTableLeft + apartmentTableWidth, doc.y)
           .stroke();

        doc.moveDown(0.8);

        // ============ SECCIÓN DE INFORMACIÓN DEL ARRENDADOR ============
        doc.fillColor('#1e40af')
           .fontSize(18)
           .font('Helvetica-Bold')
           .text('INFORMACIÓN DEL ARRENDADOR', { underline: true })
           .moveDown(0.3);

        doc.fontSize(12)
           .fillColor('#000000')
           .font('Helvetica-Bold')
           .text('Datos de Contacto');

        doc.moveDown(0.2);

        // Crear tabla de información del arrendador
        const landlordTableLeft = 50;
        const landlordTableWidth = doc.page.width - 100;

        // Encabezado de tabla
        drawTableRow(doc, landlordTableLeft, doc.y, landlordTableWidth, 
                     ['Concepto', 'Detalle'], 
                     ['#10b981', '#10b981'],
                     ['#ffffff', '#ffffff'], 
                     true);

        // Filas de datos
        const landlordData = [
            ['Nombre Completo', `${apartment.user_name} ${apartment.user_lastname}`],
            ['Correo Electrónico', apartment.user_email],
            ['Teléfono', apartment.user_phonenumber || 'No disponible']
        ];

        alternateColor = true;
        landlordData.forEach((row) => {
            const bgColor = alternateColor ? '#f0fdf4' : '#ffffff';
            drawTableRow(doc, landlordTableLeft, doc.y, landlordTableWidth, 
                         row, 
                         [bgColor, bgColor],
                         ['#374151', '#374151'],
                         false);
            alternateColor = !alternateColor;
        });

        // Línea separadora final
        doc.strokeColor('#d1d5db')
           .moveTo(landlordTableLeft, doc.y)
           .lineTo(landlordTableLeft + landlordTableWidth, doc.y)
           .stroke();

        // ============ PIE DE PÁGINA ============
        doc.moveDown(1.5);
        doc.fontSize(9)
           .fillColor('#6b7280')
           .text('Este documento fue generado automáticamente por RentUp.', { align: 'center' })
           .text('Para más información, visita nuestra plataforma.', { align: 'center' });

        // Finalizar
        doc.end();

    } catch (error) {
        console.error('Error en generatePDF:', error);
        res.status(500).json({
            error: 'Error generando PDF',
            ...(process.env.NODE_ENV === 'development' && { details: error.message })
        });
    }
};

// Función auxiliar para dibujar filas de tabla
function drawTableRow(doc, x, y, width, data, bgColors, textColors, isBold) {
    const colWidth = width / data.length;
    const rowHeight = 35;

    // Fondo de la fila
    bgColors.forEach((color, i) => {
        doc.rect(x + (i * colWidth), y, colWidth, rowHeight)
           .fillAndStroke(color, '#d1d5db');
    });

    // Texto de la fila
    data.forEach((text, i) => {
        const cellX = x + (i * colWidth) + 10;
        const cellY = y + 10;

        if (isBold) {
            doc.font('Helvetica-Bold');
        } else {
            doc.font('Helvetica');
        }

        doc.fontSize(10)
           .fillColor(textColors[i])
           .text(text, cellX, cellY, {
               width: colWidth - 20,
               height: rowHeight - 20,
               align: 'left',
               valign: 'center'
           });
    });

    // Mover la posición del documento después de la fila
    doc.y = y + rowHeight;
    doc.moveDown(0.3);
}

// Genera un Excel con la información del apartamento y del arrendador
exports.generateExcel = async (req, res) => {
    try {
        const { id } = req.params;

        if (!validateId(id)) {
            return res.status(400).json({ error: 'ID de apartamento inválido' });
        }

        const apartment = await Document.getApartmentById(id);
        if (!apartment) {
            return res.status(404).json({ error: 'Apartamento no encontrado' });
        }

        // Configurar respuesta
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=apartamento_${id}.xlsx`);
        res.setHeader('Content-Security-Policy', "default-src 'self'");

        // Crear libro Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Detalles');

        // Formato profesional
        worksheet.columns = [
            { header: 'Campo', key: 'field', width: 25, style: { font: { bold: true } } },
            { header: 'Valor', key: 'value', width: 40 }
        ];

        // Datos del apartamento
        worksheet.addRow({ field: 'Dirección', value: apartment.direccion_apt });
        worksheet.addRow({ field: 'Barrio', value: apartment.barrio });
        worksheet.addRow({ field: 'Coordenadas', value: `${apartment.latitud_apt}, ${apartment.longitud_apt}` });
        worksheet.addRow({ field: 'Información adicional', value: apartment.info_add_apt || 'N/A' });
        worksheet.addRow({ field: null, value: null }); // Espacio

        // Datos del arrendador
        worksheet.addRow({ field: 'Arrendador', value: '' }).getCell('A6').font = { bold: true };
        worksheet.addRow({ field: 'Nombre', value: `${apartment.user_name} ${apartment.user_lastname}` });
        worksheet.addRow({ field: 'Email', value: apartment.user_email });
        worksheet.addRow({ field: 'Teléfono', value: apartment.user_phonenumber });

        // Estilo de cabeceras
        worksheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD3D3D3' }
            };
        });

        // Enviar archivo
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error en generateExcel:', error);
        res.status(500).json({
            error: 'Error generando Excel',
            ...(process.env.NODE_ENV === 'development' && { details: error.message })
        });
    }
};