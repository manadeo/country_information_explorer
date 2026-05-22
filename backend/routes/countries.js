const express = require('express');
const router = express.Router();
const {
  getCountries,
  getCountryById,
  getCountryByCode
} = require('../controllers/countryController');

router.get('/', getCountries);
router.get('/:id', getCountryById);
router.get('/code/:code', getCountryByCode);

module.exports = router;
