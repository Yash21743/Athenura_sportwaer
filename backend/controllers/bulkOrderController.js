
const BulkOrder = require('../models/BulkOrder');
const { sendBulkOrderNotification, sendBulkOrderAckToCustomer } = require('../utils/emailService');
const { buildFilter, buildPagination, paginationMeta } = require('../utils/helpers');

exports.createBulkOrder = async (req, res, next) => {
  try {
    const {
      fullName, organizationName, phoneNumber, emailAddress,
      productCategory, quantityRequired, customPrinting,
      preferredDeliveryDate, additionalRequirements,
    } = req.body;

    if (!fullName || !phoneNumber || !emailAddress || !productCategory || !quantityRequired) {
      return res.status(400).json({
        success: false,
        message: 'Full name, phone number, email, product category, and quantity are required',
      });
    }

    const bulkOrder = await BulkOrder.create({
      fullName: fullName.trim(),
      organizationName: organizationName ? organizationName.trim() : '',
      phoneNumber,
      emailAddress: emailAddress.trim().toLowerCase(),
      productCategory,
      quantityRequired: parseInt(quantityRequired),
      customPrinting: customPrinting === 'true' || customPrinting === true,
      preferredDeliveryDate: preferredDeliveryDate || undefined,
      additionalRequirements: additionalRequirements ? additionalRequirements.trim() : '',
      status: 'pending',
    });

    try {
      await sendBulkOrderNotification(bulkOrder);
      await sendBulkOrderAckToCustomer(bulkOrder);
    } catch (emailError) {
      console.error('Email notification failed:', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Bulk order request submitted successfully! Our team will contact you within 24 hours.',
      data: bulkOrder,
    });
  } catch (error) {
    next(error);
  }
};

exports.getBulkOrders = async (req, res, next) => {
  try {
    const allowedFields = ['search', 'status'];
    const filter = buildFilter(req.query, allowedFields);
    const { page, limit, skip } = buildPagination(req.query.page, req.query.limit);

    const [orders, total] = await Promise.all([
      BulkOrder.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      BulkOrder.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      pagination: paginationMeta(total, page, limit),
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

exports.getBulkOrder = async (req, res, next) => {
  try {
    const order = await BulkOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Bulk order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

exports.updateBulkOrder = async (req, res, next) => {
  try {
    const { status, adminNotes, quotedPrice } = req.body;

    let order = await BulkOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Bulk order not found' });
    }

    const validStatuses = ['pending', 'reviewing', 'quoted', 'confirmed', 'in-production', 'shipped', 'delivered', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    order = await BulkOrder.findByIdAndUpdate(
      req.params.id,
      {
        status: status || order.status,
        adminNotes: adminNotes !== undefined ? adminNotes : order.adminNotes,
        quotedPrice: quotedPrice ? parseFloat(quotedPrice) : order.quotedPrice,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

exports.deleteBulkOrder = async (req, res, next) => {
  try {
    const order = await BulkOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Bulk order not found' });
    }
    await order.deleteOne();
    res.status(200).json({ success: true, message: 'Bulk order deleted successfully' });
  } catch (error) {
    next(error);
  }
};
