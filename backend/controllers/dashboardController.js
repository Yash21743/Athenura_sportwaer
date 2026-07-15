const Product = require('../models/Product');
const Category = require('../models/Category');
const Inquiry = require('../models/Inquiry');
const BulkOrder = require('../models/BulkOrder');
const Testimonial = require('../models/Testimonial');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [totalProducts, activeCategories, newLeads, monthlyInquiries] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments({ status: 'active' }),
      Inquiry.countDocuments({ status: 'new' }),
      Inquiry.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      data: {
        products: totalProducts,
        categories: activeCategories,
        leads: newLeads,
        inquiries: monthlyInquiries
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getRecentActivities = async (req, res, next) => {
  try {
    const [inquiries, orders] = await Promise.all([
      Inquiry.find().sort({ createdAt: -1 }).limit(3).populate('product', 'name'),
      BulkOrder.find().sort({ createdAt: -1 }).limit(2)
    ]);

    const activities = [];
    inquiries.forEach(i => {
      activities.push({
        id: i._id,
        icon: "🆕",
        color: "#3B82F6",
        text: `New lead from ${i.name}`,
        time: i.createdAt
      });
    });
    orders.forEach(o => {
      activities.push({
        id: o._id,
        icon: "✅",
        color: "#10B981",
        text: `Bulk order from ${o.fullName || o.organizationName}`,
        time: o.createdAt
      });
    });

    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.status(200).json({
      success: true,
      data: activities.slice(0, 5)
    });
  } catch (error) {
    next(error);
  }
};

exports.getInquiryTrend = async (req, res, next) => {
  try {
    const data = [
      { m: "Jan", v: 38 }, { m: "Feb", v: 52 }, { m: "Mar", v: 45 },
      { m: "Apr", v: 70 }, { m: "May", v: 88 }, { m: "Jun", v: 65 },
      { m: "Jul", v: 94 }, { m: "Aug", v: 110 }, { m: "Sep", v: 78 },
      { m: "Oct", v: 130 }, { m: "Nov", v: 115 }, { m: "Dec", v: 142 }
    ];
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
