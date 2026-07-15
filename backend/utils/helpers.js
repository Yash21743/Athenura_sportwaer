
const mongoose = require('mongoose');

const buildFilter = (query, allowedFields) => {
  const filter = {};
  allowedFields.forEach(field => {
    if (query[field]) {
      if (field === 'search' && query.search) {
        filter.$or = [
          { name: { $regex: query.search, $options: 'i' } },
          { description: { $regex: query.search, $options: 'i' } },
          { productCode: { $regex: query.search, $options: 'i' } },
        ];
      } else if (field === 'minPrice' || field === 'maxPrice') {

      } else if (field === 'category') {
        filter.category = query.category;
      } else if (field === 'status') {
        filter.status = query.status;
      } else if (field === 'isFeatured') {
        filter.isFeatured = query.isFeatured === 'true';
      } else if (field === 'inStock') {
        filter.inStock = query.inStock === 'true';
      }
    }
  });

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = parseFloat(query.minPrice);
    if (query.maxPrice) filter.price.$lte = parseFloat(query.maxPrice);
  }

  if (query.size) {
    filter.availableSizes = { $in: query.size.split(',') };
  }

  if (query.color) {
    filter.availableColors = { $in: query.color.split(',') };
  }

  return filter;
};

const buildSort = (sortStr) => {
  const sort = {};
  if (!sortStr) return { createdAt: -1 };

  switch (sortStr) {
    case 'price-asc': sort.price = 1; break;
    case 'price-desc': sort.price = -1; break;
    case 'name-asc': sort.name = 1; break;
    case 'name-desc': sort.name = -1; break;
    case 'newest': sort.createdAt = -1; break;
    case 'oldest': sort.createdAt = 1; break;
    default: sort.createdAt = -1;
  }
  return sort;
};

const buildPagination = (page, limit) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 12;
  const skip = (pageNum - 1) * limitNum;
  return { page: pageNum, limit: limitNum, skip };
};

const paginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
  hasNext: page < Math.ceil(total / limit),
  hasPrev: page > 1,
});

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

module.exports = {
  buildFilter,
  buildSort,
  buildPagination,
  paginationMeta,
  isValidObjectId,
};
