const Product = require('../models/Product');
const { buildFilter, buildSort, buildPagination, paginationMeta, isValidObjectId } = require('../utils/helpers');

exports.getProducts = async (req, res, next) => {
  try {
    const allowedFields = ['search', 'category', 'minPrice', 'maxPrice', 'size', 'color', 'isFeatured', 'inStock'];
    const filter = buildFilter(req.query, allowedFields);
    filter.status = 'active';

    if (req.query.gender) {
      filter.gender = { $in: [req.query.gender, 'Unisex'] };
    }

    const { page, limit, skip } = buildPagination(req.query.page, req.query.limit);
    const sort = buildSort(req.query.sort);

    const [products, total] = await Promise.all([
      Product.find(filter).populate('category', 'name slug').sort(sort).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      pagination: paginationMeta(total, page, limit),
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAdminProducts = async (req, res, next) => {
  try {
    const allowedFields = ['search', 'category', 'status', 'gender'];
    const filter = buildFilter(req.query, allowedFields);

    const { page, limit, skip } = buildPagination(req.query.page, req.query.limit);
    const sort = buildSort(req.query.sort);

    const [products, total] = await Promise.all([
      Product.find(filter).populate('category', 'name').sort(sort).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      pagination: paginationMeta(total, page, limit),
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const query = isValidObjectId(req.params.slug)
      ? { _id: req.params.slug, status: 'active' }
      : { slug: req.params.slug, status: 'active' };

    const product = await Product.findOne(query).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let relatedProducts = [];
    if (product.category) {
      relatedProducts = await Product.find({
        category: product.category._id,
        _id: { $ne: product._id },
        status: 'active',
      }).limit(8).select('name slug price images featuredImage');
    } else {
      relatedProducts = await Product.find({
        _id: { $ne: product._id },
        status: 'active',
      }).limit(8).select('name slug price images featuredImage');
    }

    res.status(200).json({ success: true, data: product, relatedProducts });
  } catch (error) {
    next(error);
  }
};

exports.getAdminProduct = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const {
      name, description, category, price, compareAtPrice,
      productCode, fabricDetails, availableSizes, availableColors,
      isFeatured, status, sizeChart, specifications,
      shippingInfo, returnPolicy, weight, gender,
      stock, stockStatus,   // ✅ ADDED — these were being silently dropped before
    } = req.body;

    let images = [];
    let featuredImage = '';

    if (req.files && req.files.length > 0) {
      images = req.files.map(file => ({ url: file.path, publicId: file.filename }));
      featuredImage = images[0].url;
    }

    if (req.body.featuredImage) {
      featuredImage = req.body.featuredImage;
    }

    const product = await Product.create({
      name,
      description,
      category: category || null,
      gender: gender || 'Unisex',
      price: parseFloat(price),
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : undefined,
      productCode,
      fabricDetails,
      stock: stock !== undefined && stock !== '' ? parseInt(stock, 10) : 0,   // ✅ ADDED
      stockStatus: stockStatus || undefined,                                  // ✅ ADDED (schema hook will recompute anyway)
      availableSizes: availableSizes ? availableSizes.split(',').map(s => s.trim()) : [],
      availableColors: availableColors ? availableColors.split(',').map(c => c.trim()) : [],
      images,
      featuredImage,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      status: status || 'active',
      sizeChart: sizeChart ? JSON.parse(sizeChart) : undefined,
      specifications: specifications ? JSON.parse(specifications) : undefined,
      shippingInfo,
      returnPolicy,
      weight: weight ? parseFloat(weight) : undefined,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Product Code already exists. Please use a unique code.' });
    }
    console.error('CREATE PRODUCT ERROR:', error);
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updateData = { ...req.body };

    if (updateData.category === '') {
      updateData.category = null;
    }
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.compareAtPrice) updateData.compareAtPrice = parseFloat(updateData.compareAtPrice);
    if (updateData.weight) updateData.weight = parseFloat(updateData.weight);
    if (updateData.stock !== undefined && updateData.stock !== '') {   // ✅ ADDED
      updateData.stock = parseInt(updateData.stock, 10);
    }

    if (updateData.availableSizes && typeof updateData.availableSizes === 'string') {
      updateData.availableSizes = updateData.availableSizes.split(',').map(s => s.trim());
    }
    if (updateData.availableColors && typeof updateData.availableColors === 'string') {
      updateData.availableColors = updateData.availableColors.split(',').map(c => c.trim());
    }

    if (updateData.isFeatured !== undefined) {
      updateData.isFeatured = updateData.isFeatured === 'true' || updateData.isFeatured === true;
    }

    if (updateData.sizeChart && typeof updateData.sizeChart === 'string') {
      try { updateData.sizeChart = JSON.parse(updateData.sizeChart); } catch (e) { }
    }
    if (updateData.specifications && typeof updateData.specifications === 'string') {
      try { updateData.specifications = JSON.parse(updateData.specifications); } catch (e) { }
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({ url: file.path, publicId: file.filename }));
      updateData.images = [...product.images, ...newImages];
      if (!product.featuredImage && newImages.length > 0) {
        updateData.featuredImage = newImages[0].url;
      }
    }

    if (updateData.removeImage) {
      updateData.images = product.images.filter(img => img.publicId !== updateData.removeImage);
      delete updateData.removeImage;
      if (product.featuredImage && product.featuredImage.includes(updateData.removeImage)) {
        updateData.featuredImage = updateData.images.length > 0 ? updateData.images[0].url : '';
      }
    }

    // ✅ NOTE: findByIdAndUpdate does NOT run document middleware (pre('save')) by default,
    // so stock→stockStatus recompute won't fire here. We do it manually below instead.
    if (updateData.stock !== undefined) {
      if (updateData.stock === 0) {
        updateData.inStock = false;
        updateData.stockStatus = 'Out of Stock';
      } else if (updateData.stock <= 10) {
        updateData.inStock = true;
        updateData.stockStatus = 'Low Stock';
      } else {
        updateData.inStock = true;
        updateData.stockStatus = 'In Stock';
      }
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('category', 'name');

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Product Code already exists. Please use a unique code.' });
    }
    console.error('UPDATE PRODUCT ERROR:', error);
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.images && product.images.length > 0) {
      const cloudinary = require('../config/cloudinary');
      const publicIds = product.images.map(img => img.publicId).filter(Boolean);
      if (publicIds.length > 0) {
        try {
          await cloudinary.api.delete_resources(publicIds);
        } catch (e) {
          console.error('Cloudinary delete error:', e.message);
        }
      }
    }

    await product.deleteOne();
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true, status: 'active' })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(8)
      .select('name slug price compareAtPrice featuredImage category isFeatured');

    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

exports.getProductsByCategory = async (req, res, next) => {
  try {
    const Category = require('../models/Category');
    const category = await Category.findOne({ slug: req.params.slug, status: 'active' });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const filter = { category: category._id, status: 'active' };
    const { page, limit, skip } = buildPagination(req.query.page, req.query.limit);
    const sort = buildSort(req.query.sort);

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      pagination: paginationMeta(total, page, limit),
      category: { id: category._id, name: category.name, slug: category.slug },
      data: products,
    });
  } catch (error) {
    next(error);
  }
};