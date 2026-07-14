
const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters');
  if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) errors.push('Valid email is required');
  if (!password || password.length < 8) errors.push('Password must be at least 8 characters');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(', ') });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) errors.push('Email is required');
  if (!password) errors.push('Password is required');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(', ') });
  }

  next();
};

const validateInquiry = (req, res, next) => {
  const { name, mobileNumber, email } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters');
  if (!mobileNumber || !/^[0-9]{10,15}$/.test(mobileNumber)) errors.push('Valid mobile number is required');
  if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) errors.push('Valid email is required');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(', ') });
  }

  next();
};

const validateBulkOrder = (req, res, next) => {
  const { fullName, phoneNumber, emailAddress, productCategory, quantityRequired } = req.body;
  const errors = [];

  if (!fullName || fullName.trim().length < 2) errors.push('Full name must be at least 2 characters');
  if (!phoneNumber || phoneNumber.trim().length < 10) errors.push('Valid phone number is required');
  if (!emailAddress || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress)) errors.push('Valid email is required');
  if (!productCategory) errors.push('Product category is required');
  if (!quantityRequired || parseInt(quantityRequired) < 1) errors.push('Quantity must be at least 1');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(', ') });
  }

  next();
};

const validateContact = (req, res, next) => {
  const { name, email, message } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters');
  if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) errors.push('Valid email is required');
  if (!message || message.trim().length < 10) errors.push('Message must be at least 10 characters');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(', ') });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateInquiry,
  validateBulkOrder,
  validateContact,
};
