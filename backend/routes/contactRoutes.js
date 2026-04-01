const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// POST: Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Save to database
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    // Mail to Admin
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: email,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Request: ${subject}`,
      html: `
        <h3>New Portfolio Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    // Note: We don't await mail, so response is fast. 
    // We catch its errors though.
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(201).json({ message: 'Contact request sent successfully.' });
  } catch (error) {
    console.error('Contact submit error:', error);
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

// GET: All contact messages (for Admin)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch contacts.' });
  }
});

// PATCH: Mark as read
router.patch('/:id/read', async (req, res) => {
    try {
      await Contact.findByIdAndUpdate(req.params.id, { isRead: true });
      res.json({ message: 'Marked as read.' });
    } catch (error) {
      res.status(500).json({ message: 'Update failed.' });
    }
});

// DELETE: Remove contact message
router.delete('/:id', async (req, res) => {
    try {
      await Contact.findByIdAndDelete(req.params.id);
      res.json({ message: 'Deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Delete failed.' });
    }
});

module.exports = router;
