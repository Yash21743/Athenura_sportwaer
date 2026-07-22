
const BulkOrder = require('../models/BulkOrder');
const { sendBulkOrderNotification, sendBulkOrderAckToCustomer } = require('../utils/emailService');
const { buildFilter, buildPagination, paginationMeta } = require('../utils/helpers');

exports.createBulkOrder = async (req, res, next) => {
  try {
    const fullName = req.body.fullName;
    const organizationName = req.body.organizationName || req.body.orgName;
    const phoneNumber = req.body.phoneNumber || req.body.phone;
    const emailAddress = req.body.emailAddress || req.body.email;
    const productCategory = req.body.productCategory || req.body.category || 'Sports Wear';
    const preferredDeliveryDate = req.body.preferredDeliveryDate || req.body.deliveryDate;
    const additionalRequirements = req.body.additionalRequirements || req.body.requirements || req.body.message;

    let customPrinting = false;
    const customPrintingRaw = req.body.customPrinting;
    if (customPrintingRaw !== undefined && customPrintingRaw !== null) {
      if (typeof customPrintingRaw === 'boolean') {
        customPrinting = customPrintingRaw;
      } else if (typeof customPrintingRaw === 'string') {
        customPrinting = customPrintingRaw.toLowerCase().includes('yes') || customPrintingRaw === 'true';
      }
    }

    let quantityRequired = req.body.quantityRequired || req.body.quantity;
    if (req.body.sizeQuantities && typeof req.body.sizeQuantities === 'object') {
      const sumSizes = Object.values(req.body.sizeQuantities).reduce((acc, v) => acc + (parseInt(v, 10) || 0), 0);
      if (sumSizes > 0) quantityRequired = sumSizes;
    }
    if (!quantityRequired || isNaN(quantityRequired)) quantityRequired = 1;

    if (!fullName || !phoneNumber || !emailAddress) {
      return res.status(400).json({
        success: false,
        message: 'Full name, phone number, and email are required',
      });
    }

    const bulkOrder = await BulkOrder.create({
      fullName: fullName.trim(),
      organizationName: organizationName ? organizationName.trim() : '',
      phoneNumber,
      emailAddress: emailAddress.trim().toLowerCase(),
      productCategory,
      quantityRequired: parseInt(quantityRequired, 10),
      customPrinting,
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

    const validStatuses = ['pending', 'reviewing', 'quoted', 'confirmed', 'in-production', 'shipped', 'delivered', 'completed', 'cancelled'];
    const statusLower = status ? status.toLowerCase() : undefined;
    if (statusLower && !validStatuses.includes(statusLower)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    order = await BulkOrder.findByIdAndUpdate(
      req.params.id,
      {
        status: statusLower || order.status,
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
