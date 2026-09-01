const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { sendContactMail } = require('../utils/mailer');
const { verifyAdmin } = require('../middleware/authMiddleware');

// POST: Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL || 'kushalsaialeti98@gmail.com';
    
    // 1. Save to database
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    // 2. Mail to Admin (via Resend API)
    // We fire this asynchronously to ensure fast response, but catch errors
    sendContactMail({ adminEmail, name, email, subject, message }).catch(err => {
      console.error('[CONTACT_MAIL_ERROR]: Failed to notify admin:', err.message);
    });

    res.status(201).json({ message: 'Contact request sent successfully.' });
  } catch (error) {
    console.error('Contact submit error:', error);
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

// GET: All contact messages (for Admin)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch contacts.' });
  }
});

// PATCH: Mark as read
router.patch('/:id/read', verifyAdmin, async (req, res) => {
    try {
      await Contact.findByIdAndUpdate(req.params.id, { isRead: true });
      res.json({ message: 'Marked as read.' });
    } catch (error) {
      res.status(500).json({ message: 'Update failed.' });
    }
});

// DELETE: Remove contact message
router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
      await Contact.findByIdAndDelete(req.params.id);
      res.json({ message: 'Deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Delete failed.' });
    }
});

module.exports = router;
