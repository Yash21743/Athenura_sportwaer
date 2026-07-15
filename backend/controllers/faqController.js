exports.getFaqs = async (req, res, next) => {
  try {
    const faqs = [
      {
        id: 1,
        question: "What is your minimum order quantity (MOQ) for bulk orders?",
        answer: "Our minimum order quantity for custom sublimated jerseys is 20 units. For other catalog apparel, it ranges from 15 to 30 units depending on the complexity of customization."
      },
      {
        id: 2,
        question: "Can I request custom fabric samples before committing to a team order?",
        answer: "Yes, absolutely! We can ship fabric swatches and fit samples to your school, academy, or club for a nominal deposit, which is fully refundable upon placing your bulk order."
      },
      {
        id: 3,
        question: "What customization methods do you offer?",
        answer: "We offer professional full-sublimation printing, high-density embroidery, screen printing, and premium heat-pressed vinyl transfers to match your team style and budget."
      },
      {
        id: 4,
        question: "What is your production and delivery timeline?",
        answer: "Standard production takes 12 to 18 business days from final design approval. Domestic shipping within India takes an additional 3 to 5 business days."
      },
      {
        id: 5,
        question: "Do you offer free graphic design support for custom team kits?",
        answer: "Yes! Our in-house design team provides free 3D mockups and helps refine your logo or color scheme once a bulk order inquiry is initiated."
      }
    ];

    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs
    });
  } catch (error) {
    next(error);
  }
};