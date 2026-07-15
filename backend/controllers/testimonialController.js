
const Testimonial = require('../models/Testimonial');

exports.getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ status: 'active' }).sort({ sortOrder: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    next(error);
  }
};

exports.getAdminTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ sortOrder: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    next(error);
  }
};

exports.getTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
};

exports.createTestimonial = async (req, res, next) => {
  try {
    const { customerName, rating, review, organization, designation, image, sortOrder, status } = req.body;

    if (!customerName || !review || !rating) {
      return res.status(400).json({ success: false, message: 'Customer name, review, and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const testimonial = await Testimonial.create({
      customerName: customerName.trim(),
      rating: parseInt(rating),
      review: review.trim(),
      organization: organization ? organization.trim() : '',
      designation: designation ? designation.trim() : '',
      image: image || '',
      sortOrder: sortOrder || 0,
      status: status || 'active',
    });

    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
};

exports.updateTestimonial = async (req, res, next) => {
  try {
    const { customerName, rating, review, organization, designation, image, sortOrder, status } = req.body;

    let testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      {
        customerName: customerName ? customerName.trim() : testimonial.customerName,
        rating: rating ? parseInt(rating) : testimonial.rating,
        review: review ? review.trim() : testimonial.review,
        organization: organization !== undefined ? organization.trim() : testimonial.organization,
        designation: designation !== undefined ? designation.trim() : testimonial.designation,
        image: image !== undefined ? image : testimonial.image,
        sortOrder: sortOrder !== undefined ? sortOrder : testimonial.sortOrder,
        status: status !== undefined ? status : testimonial.status,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
};

exports.deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    await testimonial.deleteOne();
    res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    next(error);
  }
};
