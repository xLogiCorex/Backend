const express = require('express');
// PDF generáláshoz szükséges csomagok: npm i @swc/helpers tslib pdfkit 
const PDFDocument = require('pdfkit');

const router = express.Router();
const dbHandler = require('./dbHandler');
const authenticateJWT = require('./authenticateJWT');
const authorizeRole = require('./authorizeRole');

// GET /invoices – számlák listázása jogosultság alapján
router.get('/invoices', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
  try {
    const where = {};

    if (req.user.role === 'sales') {
      where.userId = req.user.id;
    }

    const invoices = await dbHandler.invoiceTable.findAll({
      where,
      order: [['issueDate', 'DESC']]
    });

    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Szerverhiba", error: error.message });
  }
});

// GET /invoices/:id/pdf – PDF számla generálás és letöltés
router.get('/invoices/:id/pdf', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
  try {
    const invoiceId = req.params.id;

    // Számla lekérése:
// include kapcsolatok order és partner modellekkel
    const invoice = await dbHandler.invoiceTable.findOne({
      where: { id: invoiceId },
      include: [
        { model: dbHandler.orderTable, as: 'order' },
        { model: dbHandler.partnerTable, as: 'partner' }
      ]
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Nem található a számla.' });
    }

    if (req.user.role === 'sales' && invoice.userId !== req.user.id) {
      return res.status(403).json({ message: 'Nincs jogosultságod ehhez a számlához.' });
    }

    // PDF létrehozása és válasz fejlécek
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=szamla_${invoiceId}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text('Számla', { align: 'center' }).moveDown();

    doc.fontSize(12).text(`Számla szám: ${invoice.invoiceNumber}`);
    if (invoice.issueDate) {
      doc.text(`Kibocsátás dátuma: ${new Date(invoice.issueDate).toISOString().split('T')[0]}`);
    }
    doc.text(`Összeg (nettó): ${invoice.totalNet} Ft`);
    doc.text(`ÁFA: ${invoice.totalVAT} Ft`);
    doc.text(`Összeg (bruttó): ${invoice.totalGross} Ft`);
    doc.moveDown();

    doc.fontSize(14).text('Partner adatok:', { underline: true }).moveDown();
    if (invoice.partner) {
      doc.fontSize(12).text(`Név: ${invoice.partner.name}`);
      doc.text(`Adószám: ${invoice.partner.taxNumber}`);
      doc.text(`Cím: ${invoice.partner.address}`);
      doc.text(`Kapcsolattartó: ${invoice.partner.contactPerson}`);
      doc.text(`Email: ${invoice.partner.email}`);
      doc.text(`Telefon: ${invoice.partner.phone}`);
      doc.moveDown();
    }

    doc.fontSize(14).text('Számla tételek:', { underline: true }).moveDown();

    doc.fontSize(12).text('Termék', 50, doc.y, { continued: true });
    doc.text('Mennyiség', 200, doc.y, { continued: true });
    doc.text('Egységár', 300, doc.y, { continued: true });
    doc.text('Összeg', 400, doc.y);
    doc.moveDown();

    let yPos = doc.y;
    invoice.items.forEach(item => {
      doc.text(item.productName || item.name || 'Ismeretlen termék', 50, yPos, { continued: true });
      doc.text(item.quantity.toString(), 200, yPos, { continued: true });
      doc.text(item.unitPrice.toFixed(2) + ' Ft', 300, yPos, { continued: true });
      doc.text((item.quantity * item.unitPrice).toFixed(2) + ' Ft', 400, yPos);
      yPos += 20;
    });

    doc.moveDown();
    if (invoice.note) {
      doc.fontSize(12).text('Megjegyzés:', { underline: true });
      doc.text(invoice.note);
    }

    doc.end();

  } catch (error) {
    res.status(500).json({ message: 'Hiba történt a PDF generálás során.', error: error.message });
  }
});

module.exports = router;
