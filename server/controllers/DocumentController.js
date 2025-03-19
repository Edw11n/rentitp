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

        // Generar PDF
        const doc = new PDFDocument({ margin: 50 });
        
        // Eventos de error
        doc.on('error', (error) => {
            console.error('Error generando PDF:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Error generando PDF' });
            }
        });

        // Pipe al response
        doc.pipe(res);

        // Contenido
        doc.fontSize(20)
           .font('Helvetica-Bold')
           .text(`Apartamento: ${apartment.direccion_apt}`, { align: 'center' })
           .moveDown(0.5);

        doc.fontSize(14)
           .font('Helvetica')
           .text(`Barrio: ${apartment.barrio}`)
           .text(`Ubicación: ${apartment.latitud_apt}, ${apartment.longitud_apt}`)
           .text(`Información adicional: ${apartment.info_add_apt || 'N/A'}`)
           .moveDown();

        doc.fontSize(16)
           .font('Helvetica-Bold')
           .text('Información del arrendador:', { underline: true })
           .moveDown(0.5);

        doc.fontSize(14)
           .font('Helvetica')
           .text(`Nombre: ${apartment.user_name} ${apartment.user_lastname}`)
           .text(`Email: ${apartment.user_email}`)
           .text(`Teléfono: ${apartment.user_phonenumber}`);

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