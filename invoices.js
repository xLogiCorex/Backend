const express = require('express');
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

    // Partner nevek hozzáadása manuálisan
    const invoicesWithPartnerNames = await Promise.all(
      invoices.map(async (invoice) => {
        const partner = await dbHandler.partnerTable.findByPk(invoice.partnerId, {
          attributes: ['name']
        });
        return {
          ...invoice.toJSON(),
          partnerName: partner ? partner.name : 'Ismeretlen partner'
        };
      })
    );

    res.status(200).json(invoicesWithPartnerNames);
  } catch (error) {
    res.status(500).json({ message: "Szerverhiba", error: error.message });
  }
});

// GET /invoices/:id – egy számla lekérése
router.get('/invoices/:id', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
  try {
    const invoiceId = req.params.id;

    // Számla lekérése
    const invoice = await dbHandler.invoiceTable.findByPk(invoiceId);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Nem található a számla.' });
    }

    // Jogosultság ellenőrzés
    if (req.user.role === 'sales' && invoice.userId !== req.user.id) {
      return res.status(403).json({ message: 'Nincs jogosultságod ehhez a számlához.' });
    }

    // Partner adatok lekérése
    const partner = await dbHandler.partnerTable.findByPk(invoice.partnerId);
    // Rendelés adatok lekérése
    const order = await dbHandler.orderTable.findByPk(invoice.orderId);

    const response = {
      ...invoice.toJSON(),
      partner: partner || {},
      order: order ? { orderNumber: order.orderNumber } : {}
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Szerverhiba', error: error.message });
  }
});

// GET /invoices/:id/pdf – PDF számla generálás és letöltés
router.get('/invoices/:id/pdf', /*authenticateJWT(), authorizeRole(['admin', 'sales']),*/ async (req, res) => {
  console.log("📄 PDF endpoint elindult, ID:", req.params.id);
  try {
    console.log("PDF lekérés ID:", req.params.id);

    const invoiceId = req.params.id;

    // Számla lekérése
    const invoice = await dbHandler.invoiceTable.findByPk(invoiceId);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Nem található a számla.' });
    }

    // Jogosultság ellenőrzés
    /*if (req.user.role === 'sales' && invoice.userId !== req.user.id) {
      return res.status(403).json({ message: 'Nincs jogosultságod ehhez a számlához.' });
    }*/

    // Partner adatok lekérése
    const partner = await dbHandler.partnerTable.findByPk(invoice.partnerId);
    // Rendelés adatok lekérése
    const order = await dbHandler.orderTable.findByPk(invoice.orderId);

    // PDF létrehozása
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=szamla_${invoice.invoiceNumber}.pdf`);
    doc.pipe(res);

    // Fejléc
    doc.fontSize(20).text('Számla', { align: 'center' }).moveDown();

    // Számla adatok
    doc.fontSize(12)
        .text(`Számla szám: ${invoice.invoiceNumber}`)
        .text(`Rendelés szám: ${order ? order.orderNumber : 'Ismeretlen'}`)
        .text(`Kibocsátás dátuma: ${new Date(invoice.issueDate).toLocaleDateString('hu-HU')}`)
        .text(`Összeg (nettó): ${invoice.totalNet.toLocaleString('hu-HU')} Ft`)
        .text(`ÁFA (27%): ${invoice.totalVAT.toLocaleString('hu-HU')} Ft`)
        .text(`Összeg (bruttó): ${invoice.totalGross.toLocaleString('hu-HU')} Ft`)
        .moveDown();

    // Partner adatok
    doc.fontSize(14).text('Partner adatok:', { underline: true }).moveDown();
    if (partner) {
      doc.fontSize(12)
          .text(`Név: ${partner.name}`)
          .text(`Adószám: ${partner.taxNumber}`)
          .text(`Cím: ${partner.address}`)
          .text(`Kapcsolattartó: ${partner.contactPerson}`)
          .text(`Email: ${partner.email}`)
          .text(`Telefon: ${partner.phone}`);
    }
    doc.moveDown();

    // Számla tételek
    doc.fontSize(14).text('Számla tételek:', { underline: true }).moveDown();

    // Táblázat fejléc
    doc.fontSize(12)
        .text('Termék', 50, doc.y, { continued: true })
        .text('Mennyiség', 250, doc.y, { continued: true })
        .text('Egységár', 350, doc.y, { continued: true })
        .text('Összeg', 450, doc.y);
    doc.moveDown();

    // Tételek
    let yPos = doc.y;
    const items = Array.isArray(invoice.items) ? invoice.items : JSON.parse(invoice.items || '[]');
    
    items.forEach(item => {
      doc.text(item.productName || item.name || 'Ismeretlen termék', 50, yPos, { continued: true })
          .text((item.quantity || item.qty || 0).toString(), 250, yPos, { continued: true })
          .text((item.unitPrice || 0).toLocaleString('hu-HU') + ' Ft', 350, yPos, { continued: true })
          .text(((item.quantity || item.qty || 0) * (item.unitPrice || 0)).toLocaleString('hu-HU') + ' Ft', 450, yPos);
          yPos += 20;
    });

    // Összesítő
    doc.moveDown();
    doc.text(`Nettó összeg: ${invoice.totalNet.toLocaleString('hu-HU')} Ft`, { align: 'right' });
    doc.text(`ÁFA (27%): ${invoice.totalVAT.toLocaleString('hu-HU')} Ft`, { align: 'right' });
    doc.text(`Bruttó összeg: ${invoice.totalGross.toLocaleString('hu-HU')} Ft`, { align: 'right' });

    // Megjegyzés
    if (invoice.note) {
      doc.moveDown();
      doc.fontSize(12).text('Megjegyzés:', { underline: true });
      doc.text(invoice.note);
    }

    doc.end();
    res.status(200).send(doc).end()
  } catch (error) {
    console.error('PDF generálás hiba:', error);
    res.status(500).json({ message: 'Hiba történt a PDF generálás során.', error: error.message });
  }
});

// POST /invoices – új számla létrehozása
router.post('/invoices', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
  try {
    const { orderId, partnerId, items, totalNet, totalVAT, totalGross, note } = req.body;

    // Ellenőrizzük, hogy ehhez a rendeléshez már van-e számla
    const existingInvoice = await dbHandler.invoiceTable.findOne({
      where: { orderId }
    });

    if (existingInvoice) {
      return res.status(400).json({ message: 'Ehhez a rendeléshez már tartozik számla.' });
    }

    // Számlaszám generálás: SZ-ÉÉÉÉ-00001
    const year = new Date().getFullYear();
    const lastInvoice = await dbHandler.invoiceTable.findOne({
      order: [['id', 'DESC']]
    });
    
    const nextNumber = lastInvoice ? parseInt(lastInvoice.invoiceNumber.split('-')[2]) + 1 : 1;
    const invoiceNumber = `SZ-${year}-${String(nextNumber).padStart(5, '0')}`;

    // Számla létrehozása
    const newInvoice = await dbHandler.invoiceTable.create({
      invoiceNumber,
      orderId,
      partnerId,
      userId: req.user.id,
      issueDate: new Date(),
      items: Array.isArray(items) ? items : [],
      totalNet: totalNet || 0,
      totalVAT: totalVAT || 0,
      totalGross: totalGross || 0,
      note: note || ''
    });

    res.status(201).json({ message: 'Számla létrehozva', invoice: newInvoice });
  } catch (error) {
    res.status(500).json({ message: 'Hiba a számla létrehozásakor', error: error.message });
  }
});

module.exports = router;