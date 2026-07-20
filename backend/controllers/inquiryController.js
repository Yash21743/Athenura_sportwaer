
const Inquiry = require('../models/Inquiry');
const Product = require('../models/Product');
const { sendInquiryNotification, sendInquiryAckToCustomer } = require('../utils/emailService');
const { buildFilter, buildPagination, paginationMeta, isValidObjectId } = require('../utils/helpers');

exports.createInquiry = async (req, res, next) => {
  try {
    const { name, email, productName, quantity, message, size, color } = req.body;
    const mobileNumber = req.body.mobileNumber || req.body.phone;
    const productId = req.body.productId || req.body.product;
    const organizationName = req.body.organizationName || req.body.organization;

    if (!name || !mobileNumber || !email) {
      return res.status(400).json({ success: false, message: 'Name, mobile number, and email are required' });
    }

    if (productId) {
      if (!isValidObjectId(productId)) {
        return res.status(400).json({ success: false, message: 'Invalid product ID' });
      }
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
    }

    const inquiry = await Inquiry.create({
      name: name.trim(),
      mobileNumber,
      email: email.trim().toLowerCase(),
      productName: productName ? productName.trim() : '',
      product: productId || undefined,
      quantity: quantity ? parseInt(quantity) : undefined,
      message: message ? message.trim() : '',
      organizationName: organizationName ? organizationName.trim() : undefined,
      size: size ? size.trim() : undefined,
      color: color ? color.trim() : undefined,
      status: 'new',
    });

    try {
      await sendInquiryNotification(inquiry);
      await sendInquiryAckToCustomer(inquiry);
    } catch (emailError) {
      console.error('Email notification failed:', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully. We will get back to you soon!',
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

exports.getInquiries = async (req, res, next) => {
  try {
    const allowedFields = ['search', 'status'];
    const filter = buildFilter(req.query, allowedFields);
    const { page, limit, skip } = buildPagination(req.query.page, req.query.limit);

    const [inquiries, total] = await Promise.all([
      Inquiry.find(filter).populate('product', 'name productCode featuredImage').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Inquiry.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: inquiries.length,
      pagination: paginationMeta(total, page, limit),
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};

exports.getInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).populate('product', 'name productCode featuredImage');
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.status(200).json({ success: true, data: inquiry });
  } catch (error) {
    next(error);
  }
};

exports.updateInquiry = async (req, res, next) => {
  try {
    const { status, adminNotes, followUpDate } = req.body;

    let inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    const validStatuses = ['new', 'contacted', 'in-progress', 'quoted', 'converted', 'closed', 'spam'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      {
        status: status || inquiry.status,
        adminNotes: adminNotes !== undefined ? adminNotes : inquiry.adminNotes,
        followUpDate: followUpDate || inquiry.followUpDate,
      },
      { new: true, runValidators: true }
    ).populate('product', 'name productCode featuredImage');

    res.status(200).json({ success: true, data: inquiry });
  } catch (error) {
    next(error);
  }
};

exports.deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    await inquiry.deleteOne();
    res.status(200).json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getInquiryStats = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [total, newCount, contactedCount, convertedCount, monthlyCount] = await Promise.all([
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'new' }),
      Inquiry.countDocuments({ status: 'contacted' }),
      Inquiry.countDocuments({ status: 'converted' }),
      Inquiry.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        new: newCount,
        contacted: contactedCount,
        converted: convertedCount,
        last30Days: monthlyCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
