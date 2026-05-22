const Favorite = require('../models/Favorite');
const Country = require('../models/Country');

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find().populate('country');
    // Filter out entries where country might have been deleted
    const validFavorites = favorites.filter(f => f.country !== null);
    
    res.status(200).json({
      success: true,
      count: validFavorites.length,
      data: validFavorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error fetching favorites',
      error: error.message
    });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const { countryId } = req.body;

    if (!countryId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a countryId'
      });
    }

    const country = await Country.findById(countryId);
    if (!country) {
      return res.status(404).json({
        success: false,
        message: 'Country not found'
      });
    }

    let favorite = await Favorite.findOne({ country: countryId });
    if (favorite) {
      return res.status(400).json({
        success: false,
        message: 'Country is already favorited'
      });
    }

    favorite = await Favorite.create({ country: countryId });
    
    const populated = await Favorite.findById(favorite._id).populate('country');

    res.status(201).json({
      success: true,
      data: populated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error adding favorite',
      error: error.message
    });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { countryId } = req.params;

    const favorite = await Favorite.findOneAndDelete({ country: countryId });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite record not found for this country'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Country removed from favorites',
      data: favorite
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error removing favorite',
      error: error.message
    });
  }
};
