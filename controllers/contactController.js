const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');
const validator = require('validator');

const submitContact = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, service, budget, message } = req.body;
    if (!firstName || !lastName || !email || !service || !message)
      return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    if (!validator.isEmail(email))
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    if (message.length < 20)
      return res.status(400).json({ success: false, message: 'Message must be at least 20 characters.' });

    const contact = await Contact.create({ firstName, lastName, email, phone: phone||'', service, budget: budget||'Not specified', message });

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const t = nodemailer.createTransport({ service:'gmail', auth:{ user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }});
        await t.sendMail({
          from: `"TechStack Website" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER,
          subject: `📩 New Enquiry — ${firstName} ${lastName} | ${service}`,
          html: `<div style="font-family:sans-serif;max-width:600px">
            <h2 style="color:#C9A84C">New Contact — TechStack</h2>
            <p><b>Name:</b> ${firstName} ${lastName}</p>
            <p><b>Email:</b> <a href="mailto:${email}">${email}</a></p>
            <p><b>Phone:</b> ${phone||'Not provided'}</p>
            <p><b>Service:</b> ${service}</p>
            <p><b>Budget:</b> ${budget||'Not specified'}</p>
            <p><b>Message:</b></p>
            <blockquote style="border-left:3px solid #C9A84C;padding-left:1rem;color:#555">${message}</blockquote>
            <p style="color:#999;font-size:12px">Received: ${new Date().toLocaleString('en-IN')}</p>
          </div>`
        });
        await t.sendMail({
          from: `"TechStack" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: `Thanks for reaching out, ${firstName}! — TechStack`,
          html: `<div style="font-family:sans-serif;max-width:600px">
            <h2 style="color:#C9A84C">We received your message!</h2>
            <p>Hi ${firstName},</p>
            <p>Thank you for contacting <strong>TechStack</strong>. We've received your enquiry about <strong>${service}</strong> and will get back to you within <strong>24 hours</strong>.</p>
            <blockquote style="border-left:3px solid #C9A84C;padding-left:1rem;color:#555">${message}</blockquote>
            <p>Regards,<br><strong>BalaGanesh</strong><br>Founder, TechStack<br>📧 gayathrim16042006@gmail.com<br>📍 Tirunelveli, Tamil Nadu</p>
          </div>`
        });
      } catch(e) { console.warn('Email failed:', e.message); }
    }

    res.status(201).json({ success: true, message: "Message received! We'll reply within 24 hours.", id: contact._id });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

const getContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page)||1, limit = 20;
    const [contacts, total] = await Promise.all([
      Contact.find().sort({ createdAt:-1 }).skip((page-1)*limit).limit(limit),
      Contact.countDocuments()
    ]);
    res.json({ success:true, contacts, total, page, pages: Math.ceil(total/limit) });
  } catch { res.status(500).json({ success:false, message:'Server error' }); }
};

const updateStatus = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new:true });
    if (!contact) return res.status(404).json({ success:false, message:'Not found' });
    res.json({ success:true, contact });
  } catch { res.status(500).json({ success:false, message:'Server error' }); }
};

const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success:true, message:'Deleted' });
  } catch { res.status(500).json({ success:false, message:'Server error' }); }
};

module.exports = { submitContact, getContacts, updateStatus, deleteContact };