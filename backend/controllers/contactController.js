const Contact = require('../models/Contact');
const Inquiry = require('../models/Inquiry');
const { sendContactNotification, sendContactAckToUser } = require('../utils/emailService');
const { buildFilter, buildPagination, paginationMeta } = require('../utils/helpers');

exports.createContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      subject: subject ? subject.trim() : '',
      message: message.trim(),
      status: 'unread',
    });

    // ✅ Also save to Inquiry model so contact form queries appear under Leads in Admin Dashboard
    try {
      await Inquiry.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        mobileNumber: phone && phone.trim() ? phone.trim() : '0000000000',
        productName: subject ? `Contact Form: ${subject.trim()}` : 'General Contact Form Query',
        message: message.trim(),
        status: 'new',
      });
    } catch (inquiryErr) {
      console.error('Failed to create Inquiry lead from contact form:', inquiryErr.message);
    }

    try {
      await sendContactNotification(contact);
      await sendContactAckToUser(contact);
    } catch (emailError) {
      console.error('Email notification failed:', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

exports.getContacts = async (req, res, next) => {
  try {
    const allowedFields = ['search', 'status'];
    const filter = buildFilter(req.query, allowedFields);
    const { page, limit, skip } = buildPagination(req.query.page, req.query.limit);

    const [contacts, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: contacts.length,
      pagination: paginationMeta(total, page, limit),
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

exports.getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact message not found' });
    }
    if (contact.status === 'unread') {
      contact.status = 'read';
      await contact.save();
    }
    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

exports.updateContact = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;

    let contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact message not found' });
    }

    const validStatuses = ['unread', 'read', 'replied', 'closed', 'spam'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        status: status || contact.status,
        adminNotes: adminNotes !== undefined ? adminNotes : contact.adminNotes,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact message not found' });
    }
    await contact.deleteOne();
    res.status(200).json({ success: true, message: 'Contact message deleted successfully' });
  } catch (error) {
    next(error);
  }
};
