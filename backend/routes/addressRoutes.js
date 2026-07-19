const express = require('express');
const router = express.Router();
const {
  getAddresses, createAddress, updateAddress, setDefaultAddress, deleteAddress,
} = require('../controllers/addressController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getAddresses);
router.post('/', createAddress);
router.put('/:id', updateAddress);
router.patch('/:id/default', setDefaultAddress);
router.delete('/:id', deleteAddress);

module.exports = router;