const Faq = require("../models/Faq");

// @desc    Get all FAQs
// @route   GET /api/faqs
// @access  Public
exports.getFaqs = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category && category !== "All") {
      query.category = category;
    }

    const faqs = await Faq.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new FAQ
// @route   POST /api/faqs
// @access  Private/Admin
exports.createFaq = async (req, res, next) => {
  try {
    const { question, answer, category } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Question and answer are required",
      });
    }

    const faq = await Faq.create({
      question,
      answer,
      category: category || "General",
    });

    res.status(201).json({
      success: true,
      message: "FAQ created successfully",
      data: faq,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an FAQ
// @route   PUT /api/faqs/:id
// @access  Private/Admin
exports.updateFaq = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { question, answer, category } = req.body;

    let faq = await Faq.findById(id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    if (question) faq.question = question;
    if (answer) faq.answer = answer;
    if (category) faq.category = category;

    await faq.save();

    res.status(200).json({
      success: true,
      message: "FAQ updated successfully",
      data: faq,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an FAQ
// @route   DELETE /api/faqs/:id
// @access  Private/Admin
exports.deleteFaq = async (req, res, next) => {
  try {
    const { id } = req.params;

    const faq = await Faq.findById(id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    await faq.deleteOne();

    res.status(200).json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};